import { blogApi } from "@/lib/axios"
import { routes } from "."
import sanitizeHtml from 'sanitize-html'

/**
 * Fetches not interactions made by guests, by type, noteId and guestId.
 * @param type NoteInteractionType
 * @param noteId string
 * @param guestId string
 * @returns Promise<GuestNoteInteraction[]>
 */
async function getGuestNoteInteractions(
    type: NoteInteractionType,
    noteId: string,
    guestId: string) : Promise<GuestNoteInteraction[]>
{
    type = sanitizeHtml(type, {allowedTags: []}) as NoteInteractionType,
    noteId = sanitizeHtml(noteId, {allowedTags: []}),
    guestId = sanitizeHtml(guestId, {allowedTags: []})

    const response = await blogApi.get(routes.getGuestNoteInteraction, {
        params: { type, noteId, guestId }
    })
    
    return response.data as GuestNoteInteraction[]
}

/**
 * Fetches not interactions made by users, by type, noteId and userId.
 * @param type NoteInteractionType
 * @param noteId string
 * @param userId string
 * @returns Promise<UserNoteInteraction[]>
 */
async function getUserNoteInteractions(
    type: NoteInteractionType,
    noteId: string,
    userId: string) : Promise<UserNoteInteraction[]>
{
    type = sanitizeHtml(type, {allowedTags: []}) as NoteInteractionType,
    noteId = sanitizeHtml(noteId, {allowedTags: []}),
    userId = sanitizeHtml(userId, {allowedTags: []})

    const response = await blogApi.get(routes.getUserNoteInteraction, {
        params: { type, noteId, userId }
    })

    return response.data as UserNoteInteraction[]
}

/**
 * Creates a note interaction made by guests in backend.
 * @param data CreateGuestNoteInteraction
 * @returns Promise < void >
 */
export async function addGuestNoteInteraction(data: CreateGuestNoteInteraction) : Promise<void> {
    data = {
        type: sanitizeHtml(data.type, {allowedTags: []}) as PostInteractionType,
        noteId: sanitizeHtml(data.noteId, {allowedTags: []}),
        guestId: sanitizeHtml(data.guestId, {allowedTags: []}),
    }
    
    await blogApi.post(routes.addGuestNoteInteraction, data)
}

/**
 * Creates a note interaction made by users in backend.
 * @param data CreateUserNoteInteraction
 * @returns Promise < void >
 */
export async function addUserNoteInteraction(data: CreateUserNoteInteraction) : Promise<void> {
    data = {
        type: sanitizeHtml(data.type, {allowedTags: []}) as PostInteractionType,
        noteId: sanitizeHtml(data.noteId, {allowedTags: []}),
        userId: sanitizeHtml(data.userId, {allowedTags: []}),
    }
    
    await blogApi.post(routes.addUserNoteInteraction, data)
}

/**
 * Fetches the result if the guest liked the note or not.
 * @param noteId string
 * @param guestId string
 * @returns Promise < boolean >
 */
export async function isGuestLikedNote(noteId: string, guestId: string) : Promise<boolean> {
    return (await getGuestNoteInteractions(
        'LIKE',
        sanitizeHtml(noteId, {allowedTags: []}),
        sanitizeHtml(guestId, {allowedTags: []}),
    ))
        .length > 0 ? true : false
}

/**
 * Fetches the result if the user liked the note or not.
 * @param noteId string
 * @param userId string
 * @returns Promise < boolean >
 */
export async function isUserLikedNote(noteId: string, userId: string) : Promise<boolean> {
    return (await getUserNoteInteractions(
        'LIKE',
        sanitizeHtml(noteId, {allowedTags: []}),
        sanitizeHtml(userId, {allowedTags: []}),
    ))
        .length > 0 ? true : false
}