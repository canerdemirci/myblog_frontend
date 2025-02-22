'use client'

import type { User } from "next-auth"

import { routeMap } from "@/utils/routeMap"
import { createComment, deleteComment, getCommentsByPostId, updateComment }
    from "@/blog_api_actions/comment_repo"
import { ApiError } from "@/lib/custom_fetch"
import ThreeDotsMenu from "@/app/(blog)/blog/(components)/ThreeDotsMenu"
import StaggeredContent from "@/app/(components)/StaggeredContent"
import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { IoPersonCircle } from "react-icons/io5"
import { clsx } from "clsx"

interface Props {
    user?: User
    postId: string
}

export default function CommentsSection({ user, postId }: Props) {
    // For creating comment
    const [comment, setComment] = useState<string>('')
    const [creatingEnd, setCreatingEnd] = useState<boolean>(true)
    // For fetching comments
    const [comments, setComments] = useState<PostComment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [fetchingError, setFetchingError] = useState<ApiError | null>(null)
    // For updating a comment
    const [updatingComment, setUpdatingComment] = useState<string>('')
    const [updatingId, setUpdatingId] = useState<string>('')
    const [updatingEnd, setUpdatingEnd] = useState<boolean>(true)
    // For UI
    const [commentBarOpen, setCommentBarOpen] = useState<boolean>(false)
    const [textareaRows, setTextareaRows] = useState<number>(1)
    const [deleteBtnDisabled, setDeleteBtnDisabled] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)

        getCommentsByPostId(postId)
            .then(c => setComments(c))
            .catch(e => setFetchingError(e))
            .finally(() => setLoading(false))
    }, [])

    function handleSaveComment(event: FormEvent) {
        event.preventDefault()

        setCreatingEnd(false)

        if (user) {
            createComment({
                text: comment,
                postId: postId,
                userId: user.id
            }, undefined, { userId: user.id, email: user.email })
                .then(c => setComments(prev => [c, ...prev]))
                .catch(_ => alert('Hata! Yorum kaydedilemedi!'))
                .finally(() => {
                    setCreatingEnd(true)
                    setComment('')
                })
        }
    }

    function handleUpdateComment(event: FormEvent) {
        event.preventDefault()

        setUpdatingEnd(false)

        if (user) {
            updateComment({
                id: updatingId,
                text: updatingComment
            }, undefined, { userId: user.id, email: user.email })
                .then(_ => setComments(prev =>
                    prev.map(c => c.id === updatingId ? {...c, text: updatingComment} : c))
                )
                .catch(_ => alert('Hata! Yorum güncellenemedi!'))
                .finally(() => {
                    setUpdatingEnd(true)
                    setUpdatingComment('')
                    setUpdatingId('')
                })
        }
    }

    function handleDeleteComment(id: string) {
        setDeleteBtnDisabled(true)

        if (user) {
            deleteComment(id, undefined, { userId: user.id, email: user.email })
                .then(_ => setComments([...comments.filter(c => c.id !== id)]))
                .catch(_ => alert('Bir hata oluştu!'))
                .finally(() => setDeleteBtnDisabled(false))
        }
    }

    function CommentBar() {
        return <div
            className={clsx([
                "p-2", "mb-6", "border", "border-gray-300",
                "rounded-xl", "flex", "items-center", "gap-2", "cursor-pointer"
            ])}
            onClick={() => setCommentBarOpen(true)}
        >
            {/* If there is no user photo display an icon */}
            {
                !user?.image &&
                    <IoPersonCircle
                        size={36}
                        className={clsx("dark:text-white")}
                    />
            }
            {/* If there is user photo show it */}
            {
                user?.image &&
                    <Image
                        width={36}
                        height={36}
                        src={user.image}
                        alt="Profil foto"
                        className={clsx([
                            'rounded-full', 'border-gray-400', 'border', 'cursor-pointer',
                            'aspect-square'
                        ])}
                    />
            }
            <span
                className={clsx(["text-gray-500", "dark:text-gray-100"])}
            >
                Düşüncelerinizi paylaşın, siz de bir yorum bırakın...
            </span>
        </div>
    }

    function CommentBarNoUser() {
        return  <div
            className={clsx([
                "p-2", "my-6", "border", "border-gray-300",
                "rounded-xl", "flex", "items-center", "gap-2", "cursor-pointer"
            ])}
        >
            <Link
                href={routeMap.blog.users.signin}
                className={clsx(['dark:text-white'])}
            >
                Yorum bırakmak için üye olabilirsiniz.
            </Link>
        </div>
    }

    function CommentForum() {
        return <form onSubmit={handleSaveComment}>
            <div className={clsx(["relative", "my-6"])}>
                <textarea
                    placeholder="Düşüncelerinizi paylaşın, siz de bir yorum bırakın..."
                    className={clsx([
                        'w-full', 'mt-2 ', 'p-4', 'rounded-xl', 'border',
                        'border-gray-400', 'dark:bg-gray-900',
                        'dark:border-gray-700', 'dark:text-gray-100'
                    ])}
                    rows={textareaRows}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onFocus={() => setTextareaRows(8)}
                />
                <div className={clsx(["flex", "flex-row-reverse", "gap-2", "mt-1"])}>
                    {/* Save Button */}
                    <button
                        type="submit"
                        className={clsx([
                            "p-2", "w-40", "rounded-xl", "bg-blue-500", "cursor-pointer", "text-white", "hover:bg-blue-700", "disabled:bg-gray-300"
                        ])}
                        disabled={creatingEnd === false || comment.trim() === ''}
                    >
                        Kaydet
                    </button>
                    {/* Cancel Button */}
                    <button
                        type="reset"
                        className={clsx([
                            "p-2", "w-28", "rounded-xl", "bg-red-400", "cursor-pointer", "text-white", "hover:bg-red-600", "disabled:bg-gray-300"
                        ])}
                        onClick={() => {
                            setComment('')
                            setCommentBarOpen(false)
                        }}
                        disabled={creatingEnd === false}
                    >
                        İptal
                    </button>
                </div>
            </div>
        </form>
    }

    function UpdatingForm() {
        return <div className={clsx(["relative", "my-2"])}>
            <form onSubmit={handleUpdateComment}>
                <textarea
                    className={clsx([
                        'w-full', 'p-4', 'rounded-xl', 'border', 'border-gray-400',
                        'dark:bg-gray-900', 'dark:border-gray-700', 'dark:text-gray-100'
                    ])}
                    rows={3}
                    value={updatingComment}
                    onChange={(e) => setUpdatingComment(e.target.value)}
                />
                <div className={clsx(["flex", "flex-row-reverse", "gap-2", "mt-1"])}>
                    {/* Update button */}
                    <button
                        type="submit"
                        className={clsx([
                            "p-2", "w-40", "rounded-xl", "bg-blue-500", "cursor-pointer", "text-white", "hover:bg-blue-700", "disabled:bg-gray-300"
                        ])}
                        disabled={updatingEnd === false || updatingComment.trim() === ''}
                    >
                        Güncelle
                    </button>
                    {/* Cancel button */}
                    <button
                        type="reset"
                        className={clsx([
                            "p-2", "w-28", "rounded-xl", "bg-red-400", "cursor-pointer", "text-white", "hover:bg-red-600", "disabled:bg-gray-300"
                        ])}
                        onClick={() => {
                            setUpdatingComment('')
                            setUpdatingId('')
                        }}
                        disabled={updatingEnd === false}
                    >
                        Vazgeç
                    </button>
                </div>
            </form>
        </div>
    }

    function Comments() {
        return <div
            className={clsx([
                "flex", "flex-col", "gap-6", "mt-4", "max-h-[500px]", "overflow-y-auto",
                "min-h-[120px]"
            ])}
        >
            {
                comments.map(c => (
                    <div
                        key={c.id}
                        className={clsx(["flex", "gap-2"])}
                    >
                        {/* Comment first row. Avatar, Name or Email, Date, Menu Button */}
                        {/* Avatar */}
                        <div className={clsx("w-10")}>
                            {/* If there is no user photo show Icon */}
                            {!c.user?.image && <IoPersonCircle
                                size={36}
                                className={clsx("dark:text-white")}
                                />}
                            {/* If there is a user photo show it */}
                            {c.user?.image && <Image
                                width={36}
                                height={36}
                                src={c.user.image}
                                alt="Profil foto"
                                className={clsx([
                                    'rounded-full', 'border-gray-400', 'border', 'aspect-square'
                                ])}
                            />}
                        </div>
                        {/* Name or Email, Date, Menu Button */}
                        <div className={clsx(["w-full", "flex", "flex-col", "gap-2"])}>
                            <div className={clsx([
                                'flex', 'justify-between', 'items-center'
                            ])}
                        >
                            {/* Name or Email, Date */}
                            <div className={clsx(["flex", "items-center", "gap-2"])}>
                                <span
                                    className={clsx([
                                        "text-gray-600", "dark:text-gray-100",
                                        "font-bold"
                                    ])}
                                >
                                    {c?.user?.name || c?.user?.email}
                                </span>
                                <span
                                    className={clsx([
                                        "text-gray-400", "dark:text-gray-300"
                                    ])}
                                >
                                    -
                                </span>
                                <span
                                    className={clsx([
                                        "text-gray-400", "dark:text-gray-300"
                                    ])}
                                >
                                    {`${c.createdAt}`}
                                </span>
                            </div>
                            {/* If there user who was signed in show comment menu */}
                            {
                                user && c.userId === user.id &&
                                <ThreeDotsMenu
                                    items={[
                                        {
                                            caption: 'Sil',
                                            disabled: deleteBtnDisabled ||
                                                updatingId !== '',
                                            onClick: () => handleDeleteComment(c.id)
                                        },
                                        {
                                            caption: 'Düzenle',
                                            disabled: updatingId !== '',
                                            onClick: () => {
                                                setUpdatingId(c.id)
                                                setUpdatingComment(c.text)
                                            }
                                        },
                                    ]}
                                />
                            }
                        </div>
                        {/* Updating form or comment text */}
                        {
                            (updatingId === c.id) ?
                                UpdatingForm() :
                                <p
                                    className={clsx([
                                        "text-gray-500", "dark:text-gray-300"
                                    ])}
                                >
                                    {c.text}
                                </p>
                        }
                    </div>
                </div>
            ))}
        </div>
    }

    return (
        <section id="comments-section" className="my-16">
            {/* Comment bar when there is a user */}
            {(!commentBarOpen && user) && CommentBar()}
            {/* Comment bar when there is no user */}
            {(!commentBarOpen && !user) && CommentBarNoUser()}
            {/* Comment forum if user clicled to bar and opened */}
            {commentBarOpen && CommentForum()}
            {/* Show error, loading, empty content, comments */}
            <StaggeredContent
                error={{
                    status: fetchingError !== null,
                    content: (
                        <p className={clsx(['text-center', 'dark:text-white', 'text-red-500'])}>
                            Hata! Yorumlar gösterilemiyor. Sayfayı yenilemeyi deneyebilirsiniz.
                        </p>
                    )
                }}
                loading={{
                    status: loading,
                    content: (
                        <p className={clsx(['text-center', 'dark:text-white'])}>
                            Yorumlar yükleniyor...
                        </p>
                    )
                }}
                content={{
                    empty: comments.length < 1,
                    emptyContent: (
                        <p className={clsx(['text-center', 'dark:text-white'])}>
                            Henüz hiç yorum yok.
                        </p>
                    ),
                    content: Comments()
                }}
            />
        </section>
    )
}