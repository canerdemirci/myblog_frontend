'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from "@/lib/custom_fetch"
import { noteCacheTag, noteInteractionCacheTag } from '../constants'
import { revalidateTag } from 'next/cache'

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

    const response = await fetchBlogAPI(
        `/notes/interactions/guest?type=${type}&noteId=${noteId}&guestId=${guestId}`,
        { cache: 'force-cache', next: { tags: [noteInteractionCacheTag] } }
    )
    
    return await response.json() as GuestNoteInteraction[]
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

    const response = await fetchBlogAPI(
        `/notes/interactions/user?type=${type}&noteId=${noteId}&userId=${userId}`,
        { cache: 'force-cache', next: { tags: [noteInteractionCacheTag] } }
    )

    return await response.json() as UserNoteInteraction[]
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
    
    await fetchBlogAPI(
        '/notes/interactions/guest',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    )
    
    revalidateTag(noteInteractionCacheTag)
    revalidateTag(noteCacheTag)
}

/**
 * Creates a note interaction made by users in backend.
 * @param data CreateUserNoteInteraction
 * @returns Promise < void >
 */
export async function addUserNoteInteraction(
    data: CreateUserNoteInteraction, userTokenInfo?: UserTokenInfo) : Promise<void>
{
    data = {
        type: sanitizeHtml(data.type, {allowedTags: []}) as PostInteractionType,
        noteId: sanitizeHtml(data.noteId, {allowedTags: []}),
        userId: sanitizeHtml(data.userId, {allowedTags: []}),
    }
    
    await fetchBlogAPI(
        '/notes/interactions/user',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        undefined,
        userTokenInfo
    )

    revalidateTag(noteInteractionCacheTag)
    revalidateTag(noteCacheTag)
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