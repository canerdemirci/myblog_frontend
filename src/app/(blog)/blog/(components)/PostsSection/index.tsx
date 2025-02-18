'use client'

import StaggeredContent from "@/app/(components)/StaggeredContent"
import PostCard from "../PostCard"
import NoData from "../NoData"
import ErrorElement from "../ErrorElement"
import Link from "next/link"
import { routeMap } from "@/utils/routeMap"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { getPosts } from "@/blog_api_actions/post_repo"
import { getTags } from "@/blog_api_actions/tag_repo"
import { MdAdd, MdDownload } from "react-icons/md"

export default function PostsSection() {
    const POST_LIMIT = 12
    const fakeAllTag = { id: '0', name: 'Hepsi', postCount: 0 }

    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [fetchError, setFetchError] = useState<Error | null>(null)
    const [getMoreloading, setGetMoreLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0)
    const [atEnd, setAtEnd] = useState<boolean>(false)
    const [tags, setTags] = useState<Tag[]>([])
    const [selectedTagId, setSelectedTagId] = useState<string>(fakeAllTag.id)
    
    useEffect(() => {
        setLoading(true)
        setAtEnd(false)

        getPosts({ take: POST_LIMIT, skip: 0 }, selectedTagId === '0' ? undefined : selectedTagId)
            .then(p => setPosts(p))
            .catch(e => setFetchError(e))
            .finally(() => setLoading(false))
    }, [selectedTagId])

    useEffect(() => {
        getTags().then(t => setTags(
            // Only tags of has at least one post
            [fakeAllTag as Tag, ...(t.filter(n => n.postCount > 0))]
        ))
    }, [])

    function handleMoreBtn() {
        setGetMoreLoading(true)
        setPage(prev => prev + 1)
        getPosts(
            { take: POST_LIMIT, skip: (page + 1) * POST_LIMIT },
            selectedTagId === '0' ? undefined : selectedTagId
        )
            .then(p => {
                if (p.length > 0) {
                    setAtEnd(false)
                    setPosts(prev => [...prev, ...p])
                } else {
                    setAtEnd(true)
                }
            })
            .catch(_ => alert('Bir hata oluştu!'))
            .finally(() => setGetMoreLoading(false))
    }

    function handleTagButton(id: string) {
        if (!loading) {
            setPage(0)
            setSelectedTagId(id)
        }
    }

    function PostsSkeleton() {
        return (
            <section className={clsx([
                'md:columns-2', 'md:m-4', 'lg:columns-3', 'gap-8'
            ])}>
                {new Array(10).fill('x', 0, 9).map((_, i) => (
                    <div key={i} className={clsx([
                        'break-inside-avoid', 'break-after-avoid-page', 'inline-block',
                        'w-full'
                    ])}>
                        <div className={clsx([
                            'bg-gray-300', 'h-80', 'rounded-xl',
                            'flex', 'shrink-0', 'flex-col', 'justify-center', 'items-center', 
                            'gap-8', 'animate-pulse',
                            // 320 - 768
                            'min-[320px]:w-full max-[768px]:w-full',
                            'min-[320px]:m-0 max-[768px]:m-0',
                            'min-[320px]:mb-8 max-[768px]:mb-8',
                        ])}>
                            <div className={clsx([
                                'rounded-xl', 'bg-gray-200', 'w-[90%]', 'h-[40%]', 'mb-4'
                            ])}></div>
                            <div className={clsx([
                                'w-3/4', 'h-2', 'bg-gray-100', 'rounded-md'
                            ])}></div>
                            <div className={clsx([
                                'w-3/4', 'h-2', 'bg-gray-100', 'rounded-md'
                            ])}></div>
                            <div className={clsx([
                                'w-3/4', 'h-2', 'bg-gray-100', 'rounded-md'
                            ])}></div>
                        </div>
                    </div>
                ))}
            </section>
        )
    }

    function TagButtonsSection() {
        if (tags.length > 0) return (
            <div
                className={clsx([
                    'flex', 'sticky', 'top-0', 'items-center', 'gap-4', 'w-full', 'overflow-x-auto', 'p-4', 'dark:bg-black', 'bg-gray-50', 'no-scrollbar'
                ])}
                onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft
                    document.getElementById('right-fade')!.style.right = `${-scrollLeft}px`
                    document.getElementById('left-fade')!.style.left = `${scrollLeft}px`
                }}
            >
                {/* Left and right fade effects */}
                <div
                    id="left-fade"
                    className={clsx([
                        'absolute', 'top-[20%]', 'left-0', 'w-14', 'h-[60%]', 'bg-gradient-to-r',
                        'from-gray-100', 'cursor-pointer', 'dark:from-black'
                    ])}
                    onClick={() => handleTagButton('0')}></div>
                <div
                    id="right-fade"
                    className={clsx([
                        'absolute', 'top-[20%]', 'right-0', 'w-14', 'h-[60%]', 'bg-gradient-to-l',
                        'from-gray-100', 'cursor-pointer', 'dark:from-black'
                    ])}
                    onClick={() => handleTagButton(tags[tags.length-1].id)}></div>
                {/* Tag buttons */}
                {tags.map(t => (
                    <button
                        key={t.id}
                        className={clsx([
                            'p-2', 'flex-shrink-0', 'rounded-md', 'cursor-pointer',
                            'font-bold', 
                            selectedTagId === t.id
                                ? ['bg-red-500', 'text-white']
                                : [
                                    'bg-gray-200', 'hover:bg-gray-400',
                                    'dark:bg-gray-800', 'dark:hover:bg-gray-700',
                                    'text-gray-600', 'hover:text-gray-800',
                                    'dark:text-gray-100', 'dark:hover:text-green-300',
                                ]
                        ])}
                        onClick={() => handleTagButton(t.id)}
                    >
                        {t.name}
                    </button>
                ))}
            </div>
        )
    }

    return (
        <StaggeredContent
          loading={{
            status: loading,
            content: PostsSkeleton(),
          }}
          error={{
            status: fetchError !== null,
            content: (
                <section className={clsx('my-28')}>
                    <ErrorElement
                        iconSize={140}
                        text="Makaleler yüklenirken bir hata oluştu."
                    />
                </section>
            ),
          }}
          content={{
            empty: posts.length === 0,
            emptyContent: (
                <section className={clsx('my-28')}>
                    <NoData
                        iconSize={140}
                        text="Sistemde gösterilecek makale yok."
                    />
                </section>
            ),
            content: (
              <section
                className={clsx(['flex', 'relative', 'flex-col', 'gap-8'])}
              >
                {TagButtonsSection()}
                <div
                    className={clsx([
                        'md:columns-2', 'md:mx-4', 'mb-8', 'lg:columns-3', '2xl:columns-4'
                    ])}
                >
                    {posts.map(p => (
                        <Link
                            key={p.id}
                            href={routeMap.blog.posts.postById(p.id)}
                            className={clsx([
                                'break-inside-avoid', 'break-after-avoid-page', 'block'
                            ])}
                        >
                            <PostCard
                                title={p.title}
                                cover={p.cover}
                                date={`${p.createdAt}`}
                                commentCount={p.commentCount}
                                likeCount={p.likeCount}
                                readCount={p.viewCount}
                                shareCount={p.shareCount}
                                tags={p.tags?.map(t => t.name)}
                            />
                        </Link>
                    ))}
                </div>
                {/* Add More Button */}
                {(!atEnd && !loading && posts.length >= POST_LIMIT) && <button
                    className={clsx([
                        'w-52', 'mx-auto',
                        'px-4', 'py-2', 'mb-32', 'rounded-xl', 'cursor-pointer',
                        'bg-gray-100', 'border', 'border-gray-200', 'drop-shadow-md',
                        'hover:bg-gray-800', 'hover:border-gray-800', 'hover:text-green-400',
                        'flex', 'justify-center', 'items-center', 'gap-2', 'font-bold',
                        getMoreloading && ['animate-pulse']
                    ])}
                    onClick={handleMoreBtn}
                >
                    {getMoreloading ? <MdDownload size={52} /> : <MdAdd size={52} />}
                    <span>{getMoreloading ? 'YÜKLENİYOR...' : 'DAHA FAZLA'}</span>
                </button>}
              </section>
            )
          }}
        />
    )
}