'use client'

import MDEditor from '@uiw/react-md-editor'
import { useParams } from 'next/navigation'
import { addUserPostInteraction, addGuestPostInteraction, isGuestLikedPost, isUserLikedPost } from '@/blog_api/post_interaction_repo'
import { getPost } from '@/blog_api/post_repo'
import { ApiError } from '@/blog_api/index'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { montserrat } from '@/app/fonts'
import StaggeredContent from '@/app/(components)/StaggeredContent'

import { MdBookmark, MdShare, MdComment, MdFavorite, MdViewAgenda }  from 'react-icons/md'
import { IoMdEye } from 'react-icons/io'
import ShareButtons from '../../(components)/ShareButtons'
import { routeMap } from '@/app/(admin)/routeMap'
import { useSession } from 'next-auth/react'
import { guestId } from '@/lib/sharedFunctions'

export default function PostPage() {
    const { data: session } = useSession()
    
    const params = useParams()
    const postId = params.id as string

    const [post, setPost] = useState<Post | null>(null)
    const [error, setError] = useState<ApiError | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [complete, setComplete] = useState<boolean>(false)
    
    useEffect(() => {
        getPost(postId)
        .then(p => {
            setPost(p)
        })
        .catch((e: ApiError) => {
            if (e.data.status === 404) {
                setNotFound(true)
            } else {
                setError(e)
            }
        })
        .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!session && post) {
            addGuestPostInteraction({
                type: 'VIEW',
                postId: post.id,
                guestId: guestId()
            })
                .then((_) => {
                    isGuestLikedPost(post.id, guestId())
                        .then(r => setIsLiked(r))
                        .finally(() => setComplete(true))
                })
        }

        if (session && session.user?.id && post) {
            addUserPostInteraction({
                type: 'VIEW',
                postId: post.id,
                userId: session.user.id
            })
                .then((_) => {
                    isUserLikedPost(post.id, session?.user?.id!)
                        .then(r => setIsLiked(r))
                        .finally(() => setComplete(true))
                })
        }
    }, [session, post])

    function handleShare() {
        if (session && session.user?.id) {
            addUserPostInteraction({
                postId: postId,
                type: 'SHARE',
                userId: session.user.id
            })
        } else {
            addGuestPostInteraction({
                postId: postId,
                type: 'SHARE',
                guestId: guestId()
            })
        }
    }

    function interactions() {
        return (
            <div className='w-60 m-auto rounded-xl bg-white p-2 flex justify-center items-center gap-4 shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-950'>
                <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'>
                        <MdFavorite size={24} className={'cursor-pointer ' + (isLiked ? 'text-red-500' : 'text-gray-400')}
                        onClick={() => {
                            setIsLiked(prev => !prev)

                            if (session && session.user?.id) {
                                addUserPostInteraction({
                                    type: isLiked ? 'UNLIKE' : 'LIKE',
                                    postId: post?.id!,
                                    userId: session.user.id
                                })
                            } else {
                                addGuestPostInteraction({
                                    type: isLiked ? 'UNLIKE' : 'LIKE',
                                    postId: post?.id!,
                                    guestId: guestId()
                                })
                            }
                        }}
                    />
                </div>
                <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'>
                    <MdComment size={24} className='cursor-pointer text-green-700  dark:text-green-500' />
                </div>
                <div className='group relative cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'>
                    <MdShare size={24} className='cursor-pointer text-blue-700 dark:text-blue-500' />
                    <ShareButtons
                        url={process.env.NEXT_PUBLIC_ENV === 'dev' ? process.env.NEXT_PUBLIC_BASE_URL_DEV! : process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION! + routeMap.blog.posts.postById(postId)}
                        onShare={handleShare}
                    />
                </div>
                <div className='cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'>
                    <MdBookmark size={24} className='cursor-pointer text-yellow-700  dark:text-yellow-500' />
                </div>
            </div>
        )
    }

    return (
        <div>
            <StaggeredContent
                loading={{
                    status: loading && complete,
                    content: (<h2>Makale yükleniyor...</h2>)
                }}
                error={{
                    status: error !== null,
                    content: (<h2>Sunucu Hatası! Lütfen daha sonra tekrar deneyiniz.</h2>)
                }}
                content={{
                    notFound: notFound,
                    notFoundContent: (<h2>Makale bulunamadı.</h2>),
                    content: (
                        <div className='relative w-full md:w-[800px] md:m-auto md:my-8 bg-white dark:bg-[#0d1116] md:rounded-lg md:drop-shadow-md'>
                            <Image
                                src={
                                    post?.cover
                                        ? `http://localhost:8000/api/static/${post?.cover}`
                                        : '/images/no_cover.png'
                                }
                                width={800}
                                height={420}
                                priority={true}
                                alt='Makale Kapağı'
                                className='aspect-[40/21] w-full md:rounded-tl-lg md:rounded-tr-lg'
                            />
                            <div>
                                <h1 className={`${montserrat.className} p-4 text-xl md:text-4xl font-bold dark:text-gray-100 text-gray-900`}>
                                    {post?.title}
                                </h1>
                                <div className='p-4'>
                                    <div className={`${montserrat.className} text-xl dark:text-white`}>
                                        <div className='flex items-center gap-2'>
                                            {`${post?.createdAt}`} 
                                            <IoMdEye /> {post?.viewCount}
                                        </div>
                                    </div>
                                    <br />
                                    <MDEditor.Markdown
                                        source={post?.content}
                                        style={{ whiteSpace: 'normal' }}
                                    />
                                    <br />
                                    {interactions()}
                                    <br />
                                    <div className="flex items-center justify-start flex-wrap">
                                        {post?.tags.map((t, i) => (
                                            <span key={i} className={`${montserrat.className} text-xs block p-2 mr-3 mb-3 rounded-lg bg-gray-200 border-gray-100 dark:bg-gray-800 dark:text-white`}>
                                                # {t.name}
                                            </span>))}
                                    </div>
                                </div>
                            </div>
                            <br />
                        </div>
                    )
                }}
            />
        </div>
    )
}