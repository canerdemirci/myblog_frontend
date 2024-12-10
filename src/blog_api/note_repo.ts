import { blogApi } from "@/lib/axios"
import { routes } from "."
import sanitizeHtml from 'sanitize-html'

/**
 * Creates a note in the backend.
 * @param data CreateNote
 * @returns Promise<Note | never>
 */
export async function createNote(data: CreateNote) : Promise<Note | never> {
    data = {
        content: sanitizeHtml(data.content, {allowedTags: []})
    }
    
    const response = await blogApi.post(routes.createNote, data)

    return response.data as Note
}

/**
 * Fetches all notes from backend.
 * @returns Promise<Note[] | never>
 */
export async function getNotes() : Promise<Note[] | never> {
    const response = await blogApi.get(routes.allNotes)
    
    return response.data as Note[]
}

/**
 * Fetches a note from backend by id.
 * @param id string
 * @returns Promise<Note | never>
 */
export async function getNote(id: string) : Promise<Note | never> {
    const response = await blogApi.get(routes.noteById(
        sanitizeHtml(id, {allowedTags: []})
    ))

    return response.data as Note
}

/**
 * Deletes a note from backend by id.
 * @param id string
 * @returns Promise < void >
 */
export async function deleteNote(id: string) : Promise<void> {
    await blogApi.delete(routes.deleteNoteById(
        sanitizeHtml(id, {allowedTags: []})
    ))
}