'use client'

import { MdEventNote } from 'react-icons/md'
import { leagueSpartan } from '@/app/fonts'
import { clsx } from 'clsx'
import { useState } from 'react'
import { ApiError } from '@/lib/custom_fetch'
import { getNote } from '@/blog_api_actions/note_repo'
import { addGuestNoteInteraction, addUserNoteInteraction, isGuestLikedNote, isUserLikedNote }
    from '@/blog_api_actions/note_interaction_repo'
import { guestId } from '@/lib/sharedFunctions'
import StaggeredContent from '@/app/(components)/StaggeredContent'
import Pending from '../Pending'
import AlertModal from '@/app/(admin)/admin/(components)/AlertModal'
import NoteModal from '../NoteModal'
import { useSession } from 'next-auth/react'

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
                    "border-4", "border-gray-200", "rounded-lg", "p-4", "dark:border-gray-700",
                    "dark:hover:border-orange-400", "hover:border-gray-700", "cursor-pointer",
                    "note-anim-cover", "bg-gradient-to-b",
                    "dark:from-gray-900", "dark:to-black",
                    "from-gray-50", "to-white"
                ])}
                onClick={handleClick}
            >
                <div
                    className={clsx([
                        "note-anim", "shadow-2xl", "md:w-28", "md:h-28", "rounded-full", "dark:group-hover:bg-orange-400", "group-hover:bg-none",
                        "group-hover:bg-gray-700", "flex", "justify-center", "items-center",
                        "min-[320px]:w-24", "max-[768px]:w-24", "min-[320px]:h-24",
                        "max-[768px]:h-24"
                    ])}
                >
                    <div
                        className={clsx([
                            "md:w-[6.25rem]", "md:h-[6.25rem]", "bg-gray-100", "dark:bg-gray-700",
                            "rounded-full", "flex", "flex-col", "items-center", "justify-center",
                            "min-[320px]:w-[5.25rem]", "max-[768px]:w-[5.25rem]",
                            "min-[320px]:h-[5.25rem]", "max-[768px]:h-[5.25rem]"
                        ])}
                    >
                        <MdEventNote
                            size={42}
                            className={clsx([
                                'text-gray-700', 'dark:text-gray-100'
                            ])}
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