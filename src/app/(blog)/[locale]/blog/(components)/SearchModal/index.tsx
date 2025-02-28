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
import { useTranslations } from "next-intl"

interface Props {
    onClose: () => void
}

export default function SearchModal({ onClose }: Props) {
    const t = useTranslations('SearchModal')
    const tErr = useTranslations('ErrorMessages')
    
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
                    'overflow-y-auto',  'm-auto', 'rounded-xl', 'bg-white', 'shadow-xl', 'border',
                    'border-gray-400', 'w-full', 'h-full',
                    // sm
                    'sm:max-h-[20rem]', 'sm:w-[50%]', 'sm:mt-20',
                    // dark
                    'dark:bg-gray-900', 'dark:border-gray-700',
                ])}
            >
                <div
                    className={clsx([
                        'flex', 'justify-between', 'items-center', 'border-b', 'border-gray-400',
                        'p-2', 'dark:border-gray-700'
                    ])}
                >
                    <h3
                        className={clsx([
                            'font-bold', 'text-xl', 'p-2', 'dark:text-gray-100'
                        ])}
                    >
                        {t('title')}
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
                        placeholder={t('placeholder')}
                        className={clsx([
                            'p-2', 'w-full', 'bg-gray-100', 'outline-none',
                            // focus
                            'focus:bg-gray-200', 'dark:focus:bg-blue-900',
                            // hover
                            'hover:bg-gray-300',
                            // dark
                            'dark:hover:bg-gray-700', 'dark:bg-gray-800', 'dark:text-white',
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
                                <Loading iconSize={52} text={t('searching')} />
                            </div>
                        )
                    }}
                    error={{
                        status: error !== null,
                        content: (
                            <div className={clsx(["m-auto", "mt-10"])}>
                                <ErrorElement iconSize={52} text={tErr('basic')} />
                            </div>
                        )
                    }}
                    content={{
                        empty: posts.length < 1,
                        emptyContent: (
                            <div className={clsx(["m-auto", "mt-10"])}>
                                <NoData iconSize={52} text={t('notfound')} />
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