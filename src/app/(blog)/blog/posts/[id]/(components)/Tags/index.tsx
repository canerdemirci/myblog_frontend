'use client'

import clsx from "clsx"
import { routeMap } from "@/utils/routeMap"
import { montserrat } from '@/app/fonts'
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getPostsOfTag } from "@/blog_api_actions/post_repo"
import Loading from "@/app/(blog)/blog/(components)/Loading"

interface Props {
    post: Post
}

export default function Tags({ post } : Props) {
    const [posts, setPosts] = useState<PostOfTag[]>([])
    const [postsFetching, setPostsFetching] = useState<boolean>(false)
    
    function handleClick(tag: string) {
        setPostsFetching(true)
        getPostsOfTag(tag)
            .then(ps => setPosts(ps))
            .catch(_ => alert("Bir hata oluştu!"))
            .finally(() => setPostsFetching(false))
    }

    function Posts() {
        if (postsFetching) {
            return (<Loading iconSize={52} text='Yükleniyor' />)
        } else if (posts.length > 0) {
            return (
                <div className={clsx(['max-h-[750px]', 'overflow-y-auto', 'mb-16'])}>
                    <h2
                        className={clsx([
                            montserrat.className,
                            'text-center', 'font-bold', 'text-3xl', 'text-gray-800',
                            'mb-8', 'mt-4', 'dark:text-gray-100',
                        ])}
                    >
                        ETİKETE AİT MAKALELER
                    </h2>
                    <div className={clsx(['grid', 'gap-8', 'sm:grid-cols-2'])}>
                        {posts.map(rp => (
                            <Link
                                key={rp.id}
                                href={routeMap.blog.posts.postById(rp.id)}
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
                                            className={clsx([
                                                'font-bold', 'dark:text-gray-100', 'text-xl'
                                            ])}
                                        >
                                            {rp.title}
                                        </h3>
                                        <p
                                            className={clsx([
                                                'font-bold', 'text-gray-500',
                                                'dark:text-gray-300', 'text-xl'
                                            ])}
                                        >
                                            {`${rp.createdAt}`}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        }
    }
    
    if (post.tags.length > 0) {
        return (
            <section>
                <div
                    className={clsx([
                        "mb-8", "mt-16", "flex", "items-center", "justify-start", "flex-wrap"
                    ])}
                >
                    {
                        post.tags.map((t, i) => (
                            <span
                                key={i}
                                className={clsx([
                                    montserrat.className, 'text-xs', 'block', 'p-2', 'mr-3', 'mb-3', 'rounded-lg', 'bg-gray-200', 'border-gray-100',
                                    'cursor-pointer',
                                    // dark
                                    'dark:bg-gray-800', 'dark:text-white',
                                    // hover
                                    'hover:bg-gray-300', 'dark:hover:bg-gray-500',
                                ])}
                                onClick={() => handleClick(t.name)}
                            >
                                # {t.name}
                            </span>
                        ))
                    }
                </div>
                {Posts()}
            </section>
        )
    }
}