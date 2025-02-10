'use client'

import Modal from "../Modal"
import StaggeredContent from '@/app/(components)/StaggeredContent'
import Loading from "../Loading"
import NoData from "../NoData"
import ErrorElement from "../ErrorElement"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getPostSearchResults } from "@/blog_api_actions/post_repo"
import { MdArticle, MdClose } from 'react-icons/md'
import { routeMap } from '@/utils/routeMap'
import { clsx } from 'clsx'
import { ApiError } from "@/lib/custom_fetch"

interface Props {
    onClose: () => void
}

export default function SearchModal({ onClose }: Props) {
    const [posts, setPosts] = useState<PostSearchResult[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [error, setError] = useState<ApiError | null>(null)
    const [query, setQuery] = useState<string>('')

    useEffect(() => {
        const debouncedSearch = setTimeout(() => {
            if (query) {
                setIsFetching(true)
                
                getPostSearchResults(query)
                    .then(p => setPosts(p))
                    .catch(e => setError(e))
                    .finally(() => setIsFetching(false))
            } else {
                setPosts([])
            }
        }, 500)

        return () => clearTimeout(debouncedSearch)
    }, [query])

    return (
        <Modal onClose={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={clsx([
                    'overflow-y-auto',  'm-auto', 'rounded-xl', 'bg-white',
                    'shadow-xl', 'border', 'border-gray-400', 'dark:bg-gray-900',
                    'dark:border-gray-700',
                    'w-full', 'h-full',
                    'sm:max-h-[20rem]', 'sm:w-[50%]', 'sm:mt-20'
                ])}
            >
                <div
                    className={clsx([
                        'flex', 'justify-between', 'items-center', 'border-b', 'dark:border-gray-700', 'p-2', 'border-gray-400'
                    ])}
                >
                    <h3
                        className={clsx([
                            'font-bold', 'text-xl', 'p-2', 'dark:text-gray-100'
                        ])}
                    >
                        Arama Sonuçları
                    </h3>
                    <MdClose
                        size={36}
                        className={clsx([
                            'cursor-pointer', 'text-red-400', 'dark:text-green-200'
                        ])}
                        onClick={onClose}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Makale bulmak için anahtar kelimeleri yazın."
                        className={clsx([
                            'p-2', 'w-full', 'bg-gray-100',
                            'outline-none', 'focus:bg-gray-200', 'hover:bg-gray-300',
                            'dark:bg-gray-800', 'dark:text-white', 'dark:focus:bg-blue-900',
                             'dark:hover:bg-gray-700'
                        ])}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
                <StaggeredContent
                    loading={{
                        status: isFetching,
                        content: (
                            <div className={clsx(["m-auto", "mt-10"])}>
                                <Loading iconSize={52} text="Yükleniyor..." />
                            </div>
                        )
                    }}
                    error={{
                        status: error !== null,
                        content: (
                            <div className={clsx(["m-auto", "mt-10"])}>
                                <ErrorElement iconSize={52} text="Bir hata oluştu!" />
                            </div>
                        )
                    }}
                    content={{
                        empty: posts.length < 1,
                        emptyContent: (
                            <div className={clsx(["m-auto", "mt-10"])}>
                                <NoData iconSize={52} text="Hiçbir sonuç bulunamadı." />
                            </div>
                        ),
                        content: posts.map(p => (
                            <div
                                key={p.id}
                                className={clsx([
                                    'cursor-pointer', 'p-2', 'flex', 'items-center',
                                    'gap-2', 'hover:bg-gray-200', 'dark:hover:bg-gray-700'
                                ])}
                            >
                                <MdArticle
                                    size={24}
                                    className={clsx(['text-gray-400'])}
                                />
                                <Link
                                    href={routeMap.blog.posts.postById(p.id)}
                                    className={clsx(['dark:text-gray-100'])}
                                    onClick={onClose}
                                >
                                    {p.title}
                                </Link>
                            </div>
                        ))
                    }}
                />
            </div>
        </Modal>
    )
}