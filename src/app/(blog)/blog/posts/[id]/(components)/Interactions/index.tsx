'use client'

import clsx from "clsx"
import { useEffect, useState } from "react"
import { MdBookmark, MdShare, MdComment, MdFavorite } from 'react-icons/md'
import ShareButtons from "@/app/(blog)/blog/(components)/ShareButtons"
import { routeMap } from "@/utils/routeMap"
import { guestId } from "@/lib/sharedFunctions"
import { addGuestPostInteraction, addUserPostInteraction, isGuestLikedPost, isUserLikedPost }
    from "@/blog_api_actions/post_interaction_repo"
import {
    createGuestBookmark, createUserBookmark, deleteBookmark,
    getGuestBookmark, getUserBookmark
} from "@/blog_api_actions/bookmark_repo"
import type { User } from "next-auth"
import Link from "next/link"
import Sticky from "./Sticky"

interface Props {
    post: Post
    user?: User
}

export default function Interactions({ post, user }: Props) {
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [bookmark, setBookmark] = useState<GuestBookmark | UserBookmark | null>(null)
    const [bookmarkProcess, setBookmarkProcess] = useState<boolean>(false)
    const [likeProcess, setLikeProcess] = useState<boolean>(false)
    const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false)

    useEffect(() => {
        if (!user) {
            Promise.all([
                addGuestPostInteraction({
                    type: 'VIEW',
                    postId: post.id,
                    guestId: guestId()
                }),
                isGuestLikedPost(post.id, guestId()),
                getGuestBookmark(post.id, guestId())
            ]).then(([_, liked, bookmark]) => {
                setIsLiked(liked)
                setBookmark(bookmark)
            }).catch(_ => { }).finally(() => {
                setReadyToDisplay(true)
            })
        } else {
            Promise.all([
                addUserPostInteraction({
                    type: 'VIEW',
                    postId: post.id,
                    userId: user.id
                }, { userId: user.id, email: user.email }),
                isUserLikedPost(post.id, user.id),
                getUserBookmark(post.id, user.id, { userId: user.id, email: user.email })
            ]).then(([_, liked, bookmark]) => {
                setIsLiked(liked)
                setBookmark(bookmark)
            }).catch(_ => { }).finally(() => {
                setReadyToDisplay(true)
            })
        }
    }, [])

    function handleShare() {
        if (user) {
            addUserPostInteraction({
                postId: post.id,
                type: 'SHARE',
                userId: user.id
            }, { userId: user.id, email: user.email })
        } else {
            addGuestPostInteraction({
                postId: post.id,
                type: 'SHARE',
                guestId: guestId()
            })
        }
    }

    function handleBookmark() {
        if (bookmarkProcess) return

        setBookmarkProcess(true)

        if (!bookmark) {
            if (user) {
                createUserBookmark({
                    postId: post.id,
                    userId: user.id
                }, { userId: user.id, email: user.email })
                    .then(b => setBookmark(b))
                    .catch(_ => setBookmark(null))
                    .finally(() => setBookmarkProcess(false))
            } else {
                createGuestBookmark({
                    postId: post.id,
                    guestId: guestId()
                })
                    .then(b => setBookmark(b))
                    .catch(_ => setBookmark(null))
                    .finally(() => setBookmarkProcess(false))
            }
        } else {
            deleteBookmark(bookmark.id)
                .finally(() => {
                    setBookmarkProcess(false)
                    setBookmark(null)
                })
        }
    }

    function handleLike() {
        if (likeProcess) return

        setLikeProcess(true)

        if (user) {
            addUserPostInteraction({
                type: isLiked ? 'UNLIKE' : 'LIKE',
                postId: post.id,
                userId: user.id
            }, { userId: user.id, email: user.email })
                .then(_ => setIsLiked(prev => !prev))
                .finally(() => setLikeProcess(false))
        } else {
            addGuestPostInteraction({
                type: isLiked ? 'UNLIKE' : 'LIKE',
                postId: post.id,
                guestId: guestId()
            })
                .then(_ => setIsLiked(prev => !prev))
                .finally(() => setLikeProcess(false))
        }
    }

    return (
        readyToDisplay && <Sticky>
            <div
                className={clsx([
                    "w-60", "m-auto", "rounded-xl", "bg-white", "p-2", "flex", "justify-center", "items-center", "gap-4", "shadow-sm", "border", "border-gray-200", "dark:bg-gray-900", "dark:border-gray-950"
                ])}
            >
                <div
                    className={clsx([
                        "cursor-pointer", "p-2", "rounded-full", "hover:bg-gray-100",
                        "dark:hover:bg-gray-700"
                    ])}
                >
                    <MdFavorite
                        size={24}
                        className={clsx([
                            'cursor-pointer ',
                            likeProcess && ['animate-pulse', 'text-yellow-600'],
                            isLiked ? 'text-red-500' : 'text-gray-400'
                        ])}
                        onClick={handleLike}
                    />
                </div>
                {
                    user &&
                    <Link href="#comments-section">
                        <div
                            className={clsx([
                                'cursor-pointer', 'p-2', 'rounded-full', 'hover:bg-gray-100', 'dark:hover:bg-gray-700'
                            ])}
                        >
                            <MdComment
                                size={24}
                                className={clsx([
                                    'cursor-pointer', 'text-green-700', 'dark:text-green-500'
                                ])}
                            />
                        </div>
                    </Link>
                }
                <div
                    className={clsx([
                        'group', 'relative', 'cursor-pointer', 'p-2', 'rounded-full', 'hover:bg-gray-100', 'dark:hover:bg-gray-700'
                    ])}
                >
                    <MdShare
                        size={24}
                        className={clsx([
                            'cursor-pointer', 'text-blue-700', 'dark:text-blue-500'
                        ])}
                    />
                    <ShareButtons
                        title={post.title}
                        url={
                            process.env.NEXT_PUBLIC_BASE_URL! + routeMap.blog.posts.postById(post.id)
                        }
                        onShare={handleShare}
                    />
                </div>
                <div
                    className={clsx([
                        'cursor-pointer', 'p-2', 'rounded-full', 'hover:bg-gray-100', 'dark:hover:bg-gray-700'
                    ])}
                >
                    <MdBookmark
                        size={24}
                        className={clsx([
                            'cursor-pointer',
                            bookmarkProcess && ['animate-pulse', 'text-yellow-600'],
                            bookmark ? 'text-red-500' : 'text-gray-400'
                        ])}
                        onClick={handleBookmark}
                    />
                </div>
            </div>
        </Sticky>
    )
}