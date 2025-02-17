import { getPost, getRelatedPosts } from '@/blog_api_actions/post_repo'
import { montserrat } from '@/app/fonts'
import Image from 'next/image'
import { clsx } from 'clsx'
import { IoMdEye } from 'react-icons/io'
import { routeMap } from '@/utils/routeMap'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import CommentsSection from './(components)/CommentsSection'
import ArticleContent from './(components)/ArticleContent'
import Interactions from './(components)/Interactions'
import NotFound from '../../(components)/NotFound'
import ErrorElement from '../../(components)/ErrorElement'
import Tags from './(components)/Tags'
import Link from 'next/link'
import type { Metadata, ResolvingMetadata } from 'next'
import { cache } from 'react'

type Props = {
    params: { id: string }
}

const fetchPost = cache(async (id: string) => await getPost(id))

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata)
: Promise<Metadata>
{
    const postId = params.id as string
    const post = await fetchPost(postId)

    return {
        title: post.title,
        keywords: post.tags.map(t => t.name),
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            url: process.env.NEXT_PUBLIC_BASE_URL! + routeMap.blog.posts.postById(post.id),
            type: "article",
            publishedTime: `${post.createdAt}`,
            authors: ['Caner DEMİRCİ'],
            ...(post.cover && {
                images: [
                    {
                        url: routeMap.static.root + '/' + post.cover,
                        alt: post.title,
                        width: 1200,
                        height: 630
                    }
                ]
            })
        }
    }
}

export default async function PostPage({ params } : Props) {
    const session = await getServerSession(authOptions)
    const postId = params.id as string
    
    function PostCover(post: Post) {
        return (
            <Image
                src={
                    post.cover
                        ? `${routeMap.static.root}/${post.cover}`
                        : '/images/no_cover.png'
                }
                width={800}
                height={420}
                priority={true}
                alt='Makale Kapağı'
                className={clsx([
                    'aspect-[40/21]', 'w-full', 'md:rounded-tl-lg', 'md:rounded-tr-lg', 'mb-4'
                ])}
            />
        )
    }

    function RelatedPosts(relatedPosts: RelatedPost[]) {
        return (
            <section>
                <h2
                    className={clsx([
                        'text-center', 'font-bold', 'text-2xl', 'text-gray-800',
                        'my-16', 'dark:text-gray-100',
                    ])}
                >
                    İLGİNİZİ ÇEKEBİLECEK DİĞER MAKALELER
                </h2>
                <div className={clsx(['grid', 'sm:grid-cols-2', 'gap-8'])}>
                    {relatedPosts.map(rp => (
                        <Link
                            key={rp.id}
                            href={routeMap.blog.posts.postById(rp.id)}
                            className={clsx([
                                'break-inside-avoid', 'break-after-avoid-page',
                                'inline-block', 'w-full'
                            ])}
                        >
                            
                                <div className={clsx(['flex', 'flex-col', 'gap-4'])}>
                                    <Image
                                        src={
                                            rp.cover
                                                ? `${routeMap.static.root}/${rp.cover}`
                                                : '/images/no_cover.png'
                                        }
                                        width={400}
                                        height={210}
                                        priority={true}
                                        className={clsx([
                                            'w-full', 'aspect-[40/21]', 'rounded-tl-md',
                                            'rounded-tr-md'
                                        ])}
                                        alt="Makale Kapağı"
                                    />
                                    <div
                                        className={clsx([
                                            'flex', 'justify-between', 'gap-8'
                                        ])}
                                    >
                                        <h3
                                            className={clsx(['font-bold', 'dark:text-gray-100'])}
                                        >
                                            {rp.title}
                                        </h3>
                                        <p
                                            className={clsx([
                                                'font-bold', 'text-gray-500',
                                                'dark:text-gray-300',
                                            ])}
                                        >
                                            {`${rp.createdAt}`}
                                        </p>
                                    </div>
                                </div>
                        </Link>
                    ))}
                </div>
            </section>
        )
    }
    
    try {
        const post = await fetchPost(postId)
        const relatedPosts = await getRelatedPosts(post.tags.map(t => t.name))

        return (
            <main
                className={clsx([
                    'relative', 'w-full', 'md:w-[800px]', 'md:m-auto', 'md:my-8', 'bg-white', 'dark:bg-[#0d1116]', 'md:rounded-lg', 'md:drop-shadow-xl', 'border',
                    'dark:border-gray-800', 'border-gray-300'
                ])}
            >
                {PostCover(post)}
                <div>
                    {/* Post Title */}
                    <h1
                        className={`${montserrat.className} p-4 text-3xl md:text-4xl font-bold dark:text-gray-100 text-gray-900`}
                    >
                        {post.title}
                    </h1>
                    <div className={clsx('p-4')}>
                        <div
                            className={clsx([
                                montserrat.className, 'text-xl', 'dark:text-white'
                            ])}
                        >
                            {/* Some info about post */}
                            <div className={clsx([
                                'flex', 'mb-4', 'items-center', 'gap-2'
                            ])}>
                                {`${post.createdAt}`} <IoMdEye /> {post.viewCount}
                            </div>
                        </div>
                        <ArticleContent content={post.content} />
                        <Interactions post={post} user={session?.user} />
                        <Tags post={post} />
                        <CommentsSection
                            user={session?.user}
                            postId={post.id}
                        />
                        {relatedPosts.length > 0 && RelatedPosts(relatedPosts)}
                    </div>
                </div>
            </main>
        )
    } catch (error: any) {
        if (error?.data?.status === 404) {
            return (
                <NotFound text="Makale bulunamadı." />
            )
        } else {
            return (
                <div className={clsx('my-36')}>
                    <ErrorElement
                        iconSize={180}
                        text={(
                            <p className={clsx(['xs:text-4xl', 'text-2xl'])}>Bir hata oluştu!</p>
                        )}
                    />
                </div>
            )
        }
    }
}