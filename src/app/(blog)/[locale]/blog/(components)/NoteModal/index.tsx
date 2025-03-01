'use client'

import MDEditor from '@uiw/react-md-editor'

import Modal from "../Modal"
import ShareButtons from "../ShareButtons"

import { MdClose } from "react-icons/md"
import { PiNotePencilBold } from "react-icons/pi"
import { FaShareNodes, FaEye, FaHeart } from 'react-icons/fa6'

import { guestId } from "@/lib/sharedFunctions"
import { routeMap } from "@/utils/routeMap"
import { clsx } from 'clsx'

import { useState } from "react"

import { addGuestNoteInteraction, addUserNoteInteraction }
    from "@/blog_api_actions/note_interaction_repo"

import type { User } from "next-auth"
import { useTranslations } from 'next-intl'

interface Props {
    user?: User
    note: Note
    isLiked: boolean
    onClose: () => void
}

function countsSectionButton(
    icon: React.ReactNode,
    count: number,
    disabled: boolean = false,
    onClick?: () => void
) {
    return (
        <span
            className={clsx([
                disabled !== true ? ['cursor-pointer', 'hover:scale-110'] : '',
                'flex', 'items-center', 'justify-between', 'gap-2', 'transition-transform',
                // dark
                'dark:text-white',
            ])}
            onClick={!disabled ? onClick : undefined}
        >
            {icon} {count}
        </span>
    )
}

export default function NoteModal({ user, note, isLiked, onClose } : Props) {
    const tErr = useTranslations('ErrorMessages')
    const t = useTranslations('NoteModal')
    
    const [like, setLike] = useState<boolean>(isLiked)
    const [likeProcess, setLikeProcess] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState<number>(note.likeCount)

    function handleShare() {
        if (user) {
            addUserNoteInteraction({
                noteId: note.id,
                type: 'SHARE',
                userId: user.id
            }, { userId: user.id, email: user.email })
                .catch(_ => alert(tErr('basic')))
        } else {
            addGuestNoteInteraction({
                noteId: note.id,
                type: 'SHARE',
                guestId: guestId()
            })
                .catch(_ => alert(tErr('basic')))
        }
    }

    function handleLike() {
        setLikeProcess(true)

        if (user) {
            addUserNoteInteraction({
                type: like ? 'UNLIKE' : 'LIKE',
                noteId: note.id,
                userId: user.id
            }, { userId: user.id, email: user.email })
                .then(_ => {
                    setLike(prev => !prev)
                    setLikeCount(prev => like ? prev - 1 : prev + 1)
                })
                .catch(_ => alert(tErr('basic')))
                .finally(() => setLikeProcess(false))
        } else {
            addGuestNoteInteraction({
                type: like ? 'UNLIKE': 'LIKE',
                noteId: note.id,
                guestId: guestId()
            })
                .then(_ => {
                    setLike(prev => !prev)
                    setLikeCount(prev => like ? prev - 1 : prev + 1)
                })
                .catch(_ => alert(tErr('basic')))
                .finally(() => setLikeProcess(false))
        }
    }

    return (
        <Modal onClose={onClose}>
            <div
                className={clsx([
                    'w-screen', 'h-screen', 'flex', 'flex-col', 'rounded-md', 'bg-white',
                    'm-auto', 'border-gray-300', 'border', 'no-scrollbar', 'drop-shadow-2xl',
                    // md
                    'md:w-3/5', 'md:h-3/4', 'md:mt-10',
                    // dark
                    'dark:bg-[#0d1116]', 'dark:border-gray-800',
                    
                ])}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={clsx([
                        'flex', 'justify-between', 'items-center', 'p-2', 'bg-gray-100',
                        'rounded-tl-md', 'rounded-tr-md', 'dark:bg-gray-800'
                    ])}
                >
                    <h1
                        className={clsx([
                            'text-xl', 'flex', 'justify-center', 'items-center', 'gap-2',
                            'font-bold', 'italic',
                            // dark
                            'dark:text-green-200'
                        ])}
                    >
                        <PiNotePencilBold color='red' /> {t('title')}
                    </h1>
                    {/* Interaction buttons */}
                    <div
                        className={clsx([
                            "w-40", "flex", "justify-between", "items-center"
                        ])}
                    >
                        {/* Share Button */}
                        <div
                            className={clsx(["relative", "group"])}
                        >
                            {countsSectionButton(
                                <FaShareNodes className={clsx('text-blue-400')} />,
                                note.shareCount
                            )}
                            <ShareButtons
                                title={t('title')}
                                url={
                                    process.env.NEXT_PUBLIC_BASE_URL!
                                        + routeMap.blog.notes.noteById(note.id)
                                }
                                onShare={handleShare}
                            />
                        </div>
                        {/* Like Button */}
                        {countsSectionButton(
                            <FaHeart
                                className={clsx([
                                    like ? 'text-red-500' : 'text-gray-400',
                                    likeProcess && ['text-yellow-400', 'animate-ping']
                                ])}
                            />,
                            likeCount,
                            likeProcess,
                            handleLike
                        )}
                        {/* View Count */}
                        {countsSectionButton(
                            <FaEye className={clsx('text-green-400')} />,
                            note.viewCount,
                            true
                        )}
                    </div>
                    {/* Modal close button */}
                    <MdClose
                        size={36}
                        className={clsx([
                            'cursor-pointer', 'text-red-400', 'dark:text-green-200'
                        ])}
                        onClick={onClose}
                    />
                </div>
                {/* Note content */}
                <main
                    className={clsx(['p-4', 'overflow-y-auto'])}>
                    <MDEditor.Markdown
                        source={note.content}
                        style={{ whiteSpace: 'normal' }}
                    />
                </main>
            </div>
        </Modal>
    )
}