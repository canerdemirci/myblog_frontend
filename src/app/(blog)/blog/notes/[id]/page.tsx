'use client'

import NoteModal from "../../(components)/NoteModal"
import {
    addGuestNoteInteraction,
    addUserNoteInteraction,
    isGuestLikedNote,
    isUserLikedNote,
} from "@/blog_api_actions/note_interaction_repo"
import { getNote } from "@/blog_api_actions/note_repo"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { routeMap } from "@/utils/routeMap"
import { guestId } from "@/lib/sharedFunctions"
import { useSession } from "next-auth/react"
import { ApiError } from "@/lib/custom_fetch"
import Pending from "../../(components)/Pending"
import ErrorElement from "../../(components)/ErrorElement"

export default function NotePage() {
    const { data: session } = useSession()

    const params = useParams()
    const router = useRouter()
    
    const [note, setNote] = useState<Note | null>(null)
    const [noteError, setNoteError] = useState<ApiError | null>(null)
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [complete, setComplete] = useState<boolean>(false)

    const id = params.id as string

    useEffect(() => {
        getNote(id)
            .then(n => setNote(n))
            .catch(e => setNoteError(e))
    }, [])

    useEffect(() => {
        if (!session && note) {
            addGuestNoteInteraction({
                type: 'VIEW',
                noteId: note.id,
                guestId: guestId()
            })
                .then((_) => {
                    isGuestLikedNote(note.id, guestId())
                        .then(r => setIsLiked(r))
                        .finally(() => setComplete(true))
                })
        }

        if (session && session.user?.id && note) {
            addUserNoteInteraction({
                type: 'VIEW',
                noteId: note.id,
                userId: session.user.id
            }, { userId: session.user.id, email: session.user.email })
                .then((_) => {
                    isUserLikedNote(note.id, session?.user?.id!)
                        .then(r => setIsLiked(r))
                        .finally(() => setComplete(true))
                })
        }
    }, [session, note])
    
    return (
        <main>
            {
                (!complete && noteError === null)
                    ? <Pending />
                    : noteError !== null
                        ? <ErrorElement text="Bir hata oluştu!" iconSize={52} />
                        : complete && <NoteModal
                            user={session?.user}
                            note={note!}
                            isLiked={isLiked}
                            onClose={() => router.push(routeMap.blog.root)}
                        />
            }
        </main>
    )
}