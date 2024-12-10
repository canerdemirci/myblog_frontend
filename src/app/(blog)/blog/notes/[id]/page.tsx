'use client'

import NoteModal from "../../(components)/NoteModal";
import {
    addGuestNoteInteraction,
    addUserNoteInteraction,
    isGuestLikedNote,
    isUserLikedNote,
} from "@/blog_api/note_interaction_repo";
import { getNote } from "@/blog_api/note_repo";
import { ApiError } from "@/blog_api/index"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { routeMap } from "@/app/(admin)/routeMap";
import { guestId } from "@/lib/sharedFunctions";
import { useSession } from "next-auth/react";

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
            })
                .then((_) => {
                    isUserLikedNote(note.id, session?.user?.id!)
                        .then(r => setIsLiked(r))
                        .finally(() => setComplete(true))
                })
        }
    }, [session, note])
    
    return (
        <div>
            {
                noteError !== null ? <h1>Sunucu Hatası! Lütfen daha sonra tekrar deneyiniz.</h1>
                : complete && <NoteModal
                    user={session?.user}
                    note={note!}
                    isLiked={isLiked}
                    onClose={() => router.push(routeMap.blog.root)}
                />
            }
        </div>
    )
}