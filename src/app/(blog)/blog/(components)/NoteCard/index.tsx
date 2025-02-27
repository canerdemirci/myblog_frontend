'use client'

import { leagueSpartan } from '@/app/fonts'
import { MdEventNote } from 'react-icons/md'
import { clsx } from 'clsx'
import { useState } from 'react'
import { ApiError } from '@/lib/custom_fetch'
import { useSession } from 'next-auth/react'
import { guestId } from '@/lib/sharedFunctions'

import { getNote } from '@/blog_api_actions/note_repo'
import {
    addGuestNoteInteraction,
    addUserNoteInteraction,
    isGuestLikedNote,
    isUserLikedNote
} from '@/blog_api_actions/note_interaction_repo'

import StaggeredContent from '@/app/(components)/StaggeredContent'
import Pending from '../Pending'
import AlertModal from '@/app/(admin)/admin/(components)/AlertModal'
import NoteModal from '../NoteModal'

interface Props {
    note: Note
}

export default function NoteCard({ note }: Props) {
    const { data: session } = useSession()

    const [openedNoteLoading, setOpenedNoteLoading] = useState<boolean>(false)
    const [openedNoteError, setOpenedNoteError] = useState<ApiError | null>(null)
    const [openedNote, setOpenedNote] = useState<Note & { isLiked: boolean } | undefined>(undefined)

    async function handleClick() {
        try {
            // Get note and check if user or guest liked it
            setOpenedNoteLoading(true)
            const opNote = await getNote(note.id)
            const liked = session?.user
                ? await isUserLikedNote(note.id, session.user.id)
                : await isGuestLikedNote(note.id, guestId())
            setOpenedNote({
                ...opNote,
                isLiked: liked,
            })
            setOpenedNoteLoading(false)

            // Add view interaction
            if (session?.user) {
                addUserNoteInteraction({
                    type: 'VIEW',
                    noteId: note.id,
                    userId: session.user.id
                }, { userId: session.user.id, email: session.user.email })
            } else {
                addGuestNoteInteraction({
                    type: 'VIEW',
                    noteId: note.id,
                    guestId: guestId()
                })
            }
        } catch (error: any) {
            setOpenedNoteError(error)
            setOpenedNoteLoading(false)
        }
    }

    return (
        <>
            {/* Note Modal */}
            <StaggeredContent
                loading={{
                    status: openedNoteLoading,
                    content: (<Pending />)
                }}
                error={{
                    status: openedNoteError !== null,
                    content: (
                        <AlertModal
                            title='Hata'
                            contentText='Sistem hatası.'
                            open={true}
                            onClose={() => setOpenedNoteError(null)}
                        />
                    )
                }}
                content={{
                    content: (
                        openedNote && <NoteModal
                            user={session?.user}
                            note={openedNote!}
                            isLiked={openedNote!.isLiked}
                            onClose={() => {
                                setOpenedNote(undefined)
                            }}
                        />
                    )
                }}
            />
            <div
                className={clsx([
                    "group", "flex", "flex-col", "justify-center", "items-center", "gap-4",
                    "border-4", "border-gray-200", "rounded-lg", "p-4",  "cursor-pointer",
                    "note-anim-cover", "bg-gradient-to-b", "from-gray-50", "to-white",
                    // hover
                    "hover:border-gray-700",
                    // dark
                    "dark:border-gray-700", "dark:hover:border-orange-400", "dark:to-black",
                    "dark:from-gray-900",
                ])}
                onClick={handleClick}
            >
                <div
                    className={clsx([
                        "note-anim", "shadow-2xl", "rounded-full", "flex", "justify-center", 
                        "items-center",
                        // md
                        "md:w-28", "md:h-28",   
                        // min-[320px] max-[768px]
                        "min-[320px]:w-24", "max-[768px]:w-24",
                        "min-[320px]:h-24", "max-[768px]:h-24",
                        // group-hover
                        "group-hover:bg-none", "group-hover:bg-gray-700",
                        // dark
                        "dark:group-hover:bg-orange-400",
                    ])}
                >
                    <div
                        className={clsx([
                            "bg-gray-100", "flex", "flex-col", "items-center", "justify-center",
                            "rounded-full",
                            // md
                            "md:w-[6.25rem]", "md:h-[6.25rem]",  
                            // min-[320px] max-[768px] 
                            "min-[320px]:w-[5.25rem]", "max-[768px]:w-[5.25rem]",
                            "min-[320px]:h-[5.25rem]", "max-[768px]:h-[5.25rem]",
                            // dark
                            "dark:bg-gray-700",
                        ])}
                    >
                        <MdEventNote
                            size={42}
                            className={clsx(['text-gray-700', 'dark:text-gray-100'])}
                        />
                    </div>
                </div>
                <span
                    className={clsx([
                        leagueSpartan.className, 'text-2xl', 'text-gray-700',
                        'dark:text-gray-700', 'dark:group-hover:text-orange-400'
                    ])}
                >
                    {`${note.createdAt}`}
                </span>
            </div>
        </>
    )
}