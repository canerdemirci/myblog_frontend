'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from "@/lib/custom_fetch"
import { tagCacheTag } from '../constants'
import { revalidateTag } from 'next/cache'

/**
 * Fetches all tags from backend.
 * @returns Promise <Tag[] | never>
 */
export async function getTags() : Promise<Tag[] | never> {
    const response = await fetchBlogAPI(
        '/tags',
        { cache: 'force-cache', next: { tags: [tagCacheTag] } }
    )
    
    return await response.json() as Tag[]
}

/**
 * Fetches a tag from backend by id.
 * @param id string
 * @returns Promise <Tag | never>
 */
export async function getTag(id: string) : Promise<Tag | never> {
    const response = await fetchBlogAPI(
        `/tags/${sanitizeHtml(id, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [tagCacheTag] } }
    )

    return await response.json() as Tag
}

/**
 * Creates a tag in the backend.
 * @param data CreateTag
 * @returns Promise < Tag >
*/
export async function createTag(data: CreateTag, adminToken?: string) : Promise<Tag> {
    // Sanitize the given data
    data = {
        name: sanitizeHtml(data.name, {allowedTags: []}),
    }
    
    const response = await fetchBlogAPI(
        '/tags',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        adminToken
    )

    revalidateTag(tagCacheTag)
    
    return await response.json() as Tag
}

/**
 * Deletes a tag from backend by id.
 * @param id string
 * @returns Promise void
 */
export async function deleteTag(id: string, adminToken?: string) : Promise<void> {
    await fetchBlogAPI(`/tags/${sanitizeHtml(id, {allowedTags: []})}`,
        { method: 'DELETE' }, adminToken)
    revalidateTag(tagCacheTag)
}