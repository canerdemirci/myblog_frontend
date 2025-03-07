'use client'

import StaggeredContent from "@/app/(components)/StaggeredContent"
import PostCard from "../PostCard"
import TagButtonsSection from "./TagButtonsSection"
import PostsSkeleton from "./PostsSkeleton"
import NoData from "../NoData"
import ErrorElement from "../ErrorElement"

import clsx from "clsx"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { routeMap } from "@/utils/routeMap"

import { getPosts } from "@/blog_api_actions/post_repo"
import { getTags } from "@/blog_api_actions/tag_repo"

import { MdAdd, MdDownload } from "react-icons/md"

export default function PostsSection() {
    const tErr = useTranslations('ErrorMessages')
    const t = useTranslations('HomePage')
    
    const POST_LIMIT = 12
    const fakeAllTag = { id: '0', name: t('allTag'), postCount: 0 }

    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [fetchError, setFetchError] = useState<Error | null>(null)
    const [getMoreloading, setGetMoreLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0)
    const [atEnd, setAtEnd] = useState<boolean>(false)
    const [tags, setTags] = useState<Tag[]>([])
    const [selectedTagId, setSelectedTagId] = useState<string>(fakeAllTag.id)

    // Fetch posts by selected tag id and pagination
    useEffect(() => {
        setLoading(true)
        setAtEnd(false)
        getPosts({ take: POST_LIMIT, skip: 0 }, selectedTagId === '0' ? undefined : selectedTagId)
            .then(p => setPosts(p))
            .catch(e => setFetchError(e))
            .finally(() => setLoading(false))
    }, [selectedTagId])

    // Fetch tags for tag buttons that related at least one post
    useEffect(() => {
        getTags().then(t => setTags([fakeAllTag as Tag, ...(t.filter(n => n.postCount > 0))]))
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
            .catch(_ => alert(tErr('basic')))
            .finally(() => setGetMoreLoading(false))
    }

    function handleTagButton(id: string) {
        if (!loading) {
            setPage(0)
            setSelectedTagId(id)
        }
    }

    return (
        <StaggeredContent
          loading={{
            status: loading,
            content: (<PostsSkeleton />),
          }}
          error={{
            status: fetchError !== null,
            content: (
                <section className={clsx('my-28')}>
                    <ErrorElement
                        iconSize={140}
                        text={tErr('fetchError')}
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
                        text={t('empty')}
                    />
                </section>
            ),
            content: (
              <section
                className={clsx(['relative'])}
              >
                <TagButtonsSection
                    onClick={handleTagButton}
                    tags={tags}
                    selectedTagId={selectedTagId}
                />
                <div
                    className={clsx([
                        'gap-6', 'mx-4',
                        'sm:grid', 'sm:grid-cols-2', 'lg:grid-cols-3', '2xl:grid-cols-4',
                    ])}
                >
                    {posts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={routeMap.blog.posts.postById(post.id)}
                            className={clsx([
                                'block',
                                [(index === 0 && selectedTagId === '0') ? 'col-span-2' : '']
                            ])}
                        >
                            <PostCard
                                title={post.title}
                                cover={post.cover}
                                date={`${post.createdAt}`}
                                commentCount={post.commentCount}
                                likeCount={post.likeCount}
                                readCount={post.viewCount}
                                shareCount={post.shareCount}
                                tags={post.tags?.map(tag => tag.name)}
                            />
                        </Link>
                    ))}
                </div>
                {/* Add More Button */}
                {(!atEnd && !loading && posts.length >= POST_LIMIT) && <button
                    className={clsx([
                        getMoreloading && ['animate-pulse'],
                        'w-52', 'mx-auto', 'px-4', 'py-2', 'mb-32', 'rounded-xl', 'cursor-pointer',
                        'bg-gray-100', 'border', 'border-gray-200', 'drop-shadow-md',
                        'flex', 'justify-center', 'items-center', 'gap-2', 'font-bold',
                        // hover
                        'hover:bg-gray-800', 'hover:border-gray-800', 'hover:text-green-400',
                    ])}
                    onClick={handleMoreBtn}
                >
                    {getMoreloading ? <MdDownload size={52} /> : <MdAdd size={52} />}
                    <span>{getMoreloading ? t('loading') : t('more')}</span>
                </button>}
              </section>
            )
          }}
        />
    )
}