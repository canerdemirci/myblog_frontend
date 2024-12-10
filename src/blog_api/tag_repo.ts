import { blogApi } from "@/lib/axios"
import { routes } from "."
import sanitizeHtml from 'sanitize-html'

/**
 * Fetches all tags from backend.
 * @returns Promise <Tag[] | never>
 */
export async function getTags() : Promise<Tag[] | never> {
    const response = await blogApi.get(routes.allTags)
    
    return response.data as Tag[]
}

/**
 * Fetches a tag from backend by id.
 * @param id string
 * @returns Promise <Tag | never>
 */
export async function getTag(id: string) : Promise<Tag | never> {
    const response = await blogApi.get(routes.tagById(
        sanitizeHtml(id, {allowedTags: []})
    ))

    return response.data as Tag
}

/**
 * Creates a tag in the backend.
 * @param data CreateTag
 * @returns Promise < Tag >
*/
export async function createTag(data: CreateTag) : Promise<Tag> {
    // Sanitize the given data
    data = {
        name: sanitizeHtml(data.name, {allowedTags: []}),
    }
    
    const response = await blogApi.post(routes.createTag, data)
    
    return response.data as Tag
}

/**
 * Deletes a tag from backend by id.
 * @param id string
 * @returns Promise void
 */
export async function deleteTag(id: string) : Promise<void> {
    await blogApi.delete(routes.deleteTagById(
        sanitizeHtml(id, {allowedTags: []})
    ))
}