'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from "@/lib/custom_fetch"
import { revalidateTag } from 'next/cache'
import { noteCacheTag } from '../constants'

/**
 * Creates a note in the backend.
 * @param data CreateNote
 * @returns Promise<Note | never>
 */
export async function createNote(data: CreateNote, adminToken?: string) : Promise<Note | never> {
    data = {
        content: sanitizeHtml(data.content, {allowedTags: []}),
        images: data.images.map(i => sanitizeHtml(i, {allowedTags: []}))
    }
    
    const response = await fetchBlogAPI(
        '/notes',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        adminToken
    )

    revalidateTag(noteCacheTag)

    return await response.json() as Note
}

/**
 * Fetches all notes from backend.
 * @param take number
 * @returns Promise<Note[] | never>
 */
export async function getNotes(take?: number) : Promise<Note[] | never> {
    const response = await fetchBlogAPI(
        take ? `/notes?take=${take}` : '/notes',
        { cache: 'force-cache', next: { tags: [noteCacheTag] } }
    )
    
    return await response.json() as Note[]
}

/**
 * Fetches a note from backend by id.
 * @param id string
 * @returns Promise<Note | never>
 */
export async function getNote(id: string) : Promise<Note | never> {
    const response = await fetchBlogAPI(
        `/notes/${sanitizeHtml(id, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [noteCacheTag] } }
    )
    
    return await response.json() as Note
}

/**
 * Deletes a note from backend by id.
 * @param id string
 * @returns Promise < void >
 */
export async function deleteNote(id: string, adminToken?: string) : Promise<void> {
    await fetchBlogAPI(`/notes/${sanitizeHtml(id, {allowedTags: []})}`,
        { method: 'DELETE' }, adminToken)
    revalidateTag(noteCacheTag)
}

/**
 * Fetches all unused note content images from backend
 * @returns Promise<string[] | never>
 */
export async function getUnusedNoteImages() : Promise<string[] | never>
{
    const response = await fetchBlogAPI(
        '/notes/maintenance/unused-images',
        { cache: 'no-store' }
    )
    
    return await response.json() as string[]
}