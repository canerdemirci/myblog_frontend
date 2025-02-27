'use client'

import Modal from "../Modal"
import ErrorElement from "../ErrorElement"
import StaggeredContent from '@/app/(components)/StaggeredContent'
import NoData from "../NoData"
import Loading from "../Loading"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { routeMap } from '@/utils/routeMap'
import { guestId } from '@/lib/sharedFunctions'
import { ApiError } from "@/lib/custom_fetch"
import { useSession } from 'next-auth/react'
import { deleteBookmark, getGuestBookmarks, getUserBookmarks }
    from '@/blog_api_actions/bookmark_repo'
import { MdBookmark, MdClose, MdDelete } from 'react-icons/md'

interface Props {
    onClose: () => void
}

export default function BookmarksModal({ onClose }: Props) {
    const { data: session } = useSession()

    const [bookmarks, setBookmarks] = useState<UserBookmark[] | GuestBookmark[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [error, setError] = useState<ApiError | null>(null)

    useEffect(() => {
        setIsFetching(true)

        if (session && session.user?.id) {
            getUserBookmarks(
                session.user.id,
                { userId: session.user.id, email: session.user.email }
            )
                .then(b => setBookmarks(b))
                .catch(e => setError(e))
                .finally(() => setIsFetching(false))
        } else {
            getGuestBookmarks(guestId())
                .then(b => setBookmarks(b))
                .catch(e => setError(e))
                .finally(() => setIsFetching(false))
        }
    }, [])

    function handleDeleteBookmark(id: string) {
        if (confirm("Daha sonra okuma listenizden kaldırmak istediğinizden emin misiniz?")) {
            deleteBookmark(id)
                .then(_ => setBookmarks(prev =>
                    [...prev.filter(b => b.id !== id)] as GuestBookmark[] | UserBookmark[]
                ))
                .catch(_ => alert('Bir hata oluştu.'))
        }
    }

    return (
        <Modal onClose={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={clsx([
                    'overflow-y-auto',  'm-auto', 'rounded-xl', 'bg-white',
                    'shadow-xl', 'border', 'border-gray-400',
                    // ss
                    'ss:h-screen',
                    // sm
                    'sm:w-[100%]', 'sm:mt-0', 'sm:max-h-[20rem]',
                    // md
                    'md:w-[50%]', 'md:mt-20',
                    // dark
                    'dark:bg-gray-900', 'dark:border-gray-700',
                ])}
            >
                <div
                    className={clsx([
                        'flex', 'justify-between', 'items-center', 'border-b', 'border-gray-200',
                        'p-2',
                        // dark
                        'dark:border-gray-700'
                    ])}
                >
                    <h3
                        className={clsx([
                            'font-bold', 'text-xl', 'p-2', 'dark:text-gray-100'
                        ])}
                    >
                        Kaydettiğiniz Makaleler
                    </h3>
                    <MdClose
                        size={36}
                        className={clsx([
                            'cursor-pointer', 'text-red-400', 'dark:text-green-200'
                        ])}
                        onClick={onClose}
                    />
                </div>
                <StaggeredContent
                    loading={{
                        status: isFetching,
                        content: (
                            <div className={clsx(["m-auto", "mt-16"])}>
                                <Loading iconSize={52} text="Yükleniyor..." />
                            </div>
                        )
                    }}
                    error={{
                        status: error !== null,
                        content: (
                            <div className={clsx(["m-auto", "mt-16"])}>
                                <ErrorElement iconSize={52} text="Bir hata oluştu!" />
                            </div>
                        )
                    }}
                    content={{
                        empty: bookmarks.length < 1,
                        emptyContent: (
                            <div className={clsx(["m-auto", "mt-16"])}>
                                <NoData
                                    iconSize={52}
                                    text={
                                        "Daha sonra okumak için kaydettiğiniz bir " +
                                        "makale bulunamadı."
                                    }
                                />
                            </div>
                        ),
                        content: (
                            <div className={clsx("p-2")}>
                                {
                                    bookmarks.map(b => (
                                        <div
                                            key={b.id}
                                            className={clsx([
                                                'group', 'flex', 'justify-between', 'items-center',
                                                'cursor-pointer', 'p-2',  
                                                'hover:bg-gray-200', 'hover:rounded-xl', 'dark:hover:bg-gray-700'
                                            ])}
                                        >
                                            <div
                                                className={clsx(['flex', 'gap-2', 'items-center'])}
                                            >
                                                <MdBookmark
                                                    size={24}
                                                    className={clsx(['text-gray-300'])}
                                                />
                                                <Link
                                                    href={routeMap.blog.posts.postById(b.post!.id)}
                                                    className={clsx(['dark:text-gray-100'])}
                                                    onClick={onClose}
                                                >
                                                    {b.post!.title}
                                                </Link>
                                            </div>
                                            <MdDelete
                                                size={24}
                                                className={clsx([
                                                    'hidden', 'text-red-400',
                                                    'hover:text-red-600',
                                                    'group-hover:inline-block'
                                                ])}
                                                onClick={() => handleDeleteBookmark(b.id)}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }}
                />
            </div>
        </Modal>
    )
}