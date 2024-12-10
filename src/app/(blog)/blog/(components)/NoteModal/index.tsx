'use client'

import { MdClose } from "react-icons/md"
import Modal from "../Modal"
import MDEditor from '@uiw/react-md-editor'
import { FaShareNodes, FaEye, FaHeart } from 'react-icons/fa6'
import { guestId } from "@/lib/sharedFunctions"
import { useState } from "react"
import { addGuestNoteInteraction, addUserNoteInteraction } from "@/blog_api/note_interaction_repo"
import { User } from "next-auth"

import { routeMap } from "@/app/(admin)/routeMap"
import ShareButtons from "../ShareButtons"

interface Props {
    user?: User | null
    note: Note
    isLiked: boolean
    onClose: () => void
}

function countsSectionButton(icon: React.ReactNode, count: number,
    disabled: boolean = false, onClick?: () => void)
{
    const classes = [
        'flex', 'items-center', 'justify-between', 'gap-2', 'dark:text-white', 
        disabled !== true ? 'cursor-pointer' : '',
        disabled !== true ? 'hover:scale-110' : '',
        'transition-transform'
    ].join(' ')

    return (
        <span className={classes} onClick={onClick}>
            {icon} {count}
        </span>
    )
}

export default function NoteModal({ user, note, isLiked, onClose } : Props) {
    const [like, setLike] = useState<boolean>(isLiked)
    const [likeCount, setLikeCount] = useState<number>(note.likeCount)

    function handleShare() {
        if (user) {
            addUserNoteInteraction({
                noteId: note.id,
                type: 'SHARE',
                userId: user.id
            })
        } else {
            addGuestNoteInteraction({
                noteId: note.id,
                type: 'SHARE',
                guestId: guestId()
            })
        }
    }

    return (
        <Modal onClose={onClose}>
            <div className='w-screen h-screen md:w-3/5 md:h-3/4 flex flex-col rounded-md bg-white m-auto md:mt-10 drop-shadow-2xl border-gray-300 border dark:bg-[#0d1116] dark:border-gray-800' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-tl-md rounded-tr-md'>
                    <h1 className='text-xl dark:text-green-200'>Not</h1>
                    <div className="w-40 flex justify-between items-center">
                        <div className="relative group">
                            {countsSectionButton(
                                        <FaShareNodes className='text-blue-400' />,
                                        note.shareCount
                            )}
                            <ShareButtons
                                url={process.env.NEXT_PUBLIC_ENV === 'dev' ? process.env.NEXT_PUBLIC_BASE_URL_DEV! : process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION! + routeMap.blog.notes.noteById(note.id)}
                                onShare={handleShare}
                            />
                        </div>
                        {countsSectionButton(
                            <FaHeart
                                className={like ? 'text-red-500' : 'text-gray-400'}
                            />,
                            likeCount,
                            false,
                            () => {
                                setLike(prev => !prev)
                                if (user) {
                                    addUserNoteInteraction({
                                        type: like ? 'UNLIKE' : 'LIKE',
                                        noteId: note.id,
                                        userId: user.id
                                    })
                                } else {
                                    addGuestNoteInteraction({
                                        type: like ? 'UNLIKE': 'LIKE',
                                        noteId: note.id,
                                        guestId: guestId()
                                    })
                                }
                                setLikeCount(prev => like ? prev - 1 : prev + 1)
                            }
                        )}
                        {countsSectionButton(
                            <FaEye className='text-green-400' />,
                            note.viewCount,
                            true
                        )}
                    </div>
                    <MdClose size={36} className='cursor-pointer text-red-400 dark:text-green-200' onClick={onClose} />
                </div>
                <div className='p-4 overflow-y-auto'>
                    <MDEditor.Markdown
                        source={note.content}
                        style={{ whiteSpace: 'normal' }}
                    />
                </div>
            </div>
        </Modal>
    )
}