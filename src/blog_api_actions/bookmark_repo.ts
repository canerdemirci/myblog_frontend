'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from '@/lib/custom_fetch'
import { bookmarkCacheTag } from '../constants'
import { revalidateTag } from 'next/cache'

/**
 * Fetches all user bookmarks belong to one user from backend.
 * @param userId string
 * @returns Promise <UserBookmark[] | never>
 */
export async function getUserBookmarks(userId: string, userTokenInfo: UserTokenInfo)
    : Promise<UserBookmark[] | never>
{
    const response = await fetchBlogAPI(
        `/bookmarks/user/${userId}`,
        {
            cache: 'force-cache',
            next: { tags: [bookmarkCacheTag] }
        },
        undefined,
        userTokenInfo
    )
    
    return await response.json() as UserBookmark[]
}

/**
 * Fetches all user bookmarks belong to one user from backend.
 * @param userId string
 * @returns Promise <UserBookmark[] | never>
 */
export async function getGuestBookmarks(guestId: string)
    : Promise<GuestBookmark[] | never>
{
    const response = await fetchBlogAPI(
        `/bookmarks/guest/${guestId}`,
        { cache: 'force-cache', next: { tags: [bookmarkCacheTag] } }
    )
    
    return await response.json() as GuestBookmark[]
}

/**
 * Fetches a guest bookmark from backend.
 * @param postId string
 * @param guestId string
 * @returns Promise <GuestBookmark | never>
 */
export async function getGuestBookmark(postId: string, guestId: string)
    : Promise<GuestBookmark | never>
{
    const response = await fetchBlogAPI(
        `/bookmarks/guest?postId=${postId}&guestId=${guestId}`,
        { cache: 'force-cache', next: { tags: [bookmarkCacheTag] } }
    )
    
    return await response.json() as GuestBookmark
}

/**
 * Fetches a user bookmark from backend.
 * @param postId string
 * @param userId string
 * @returns Promise <UserBookmark | never>
 */
export async function getUserBookmark(postId: string, userId: string, userTokenInfo: UserTokenInfo)
    : Promise<UserBookmark | never>
{
    const response = await fetchBlogAPI(
        `/bookmarks/user?postId=${postId}&userId=${userId}`,
        { cache: 'force-cache', next: { tags: [bookmarkCacheTag] } },
        undefined,
        userTokenInfo
    )
    
    return await response.json() as UserBookmark
}

/**
 * Creates a guest bookmark in the backend.
 * @param data CreateGuestBookmark
 * @returns Promise < GuestBookmark >
*/
export async function createGuestBookmark(data: CreateGuestBookmark)
    : Promise<GuestBookmark | never>
{
    // Sanitize the given data
    data = {
        postId: sanitizeHtml(data.postId, {allowedTags: []}),
        guestId: sanitizeHtml(data.guestId, {allowedTags: []}),
    }
    
    const response = await fetchBlogAPI(
        '/bookmarks/guest',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    )

    revalidateTag(bookmarkCacheTag)

    return await response.json() as GuestBookmark
}

/**
 * Creates a user bookmark in the backend.
 * @param data CreateUserBookmark
 * @returns Promise < UserBookmark >
*/
export async function createUserBookmark(data: CreateUserBookmark, userTokenInfo: UserTokenInfo)
    : Promise<UserBookmark | never>
{
    // Sanitize the given data
    data = {
        postId: sanitizeHtml(data.postId, {allowedTags: []}),
        userId: sanitizeHtml(data.userId, {allowedTags: []}),
    }
    
    const response = await fetchBlogAPI(
        '/bookmarks/user',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        undefined,
        userTokenInfo
    )

    revalidateTag(bookmarkCacheTag)

    return await response.json() as UserBookmark
}

/**
 * Deletes a bookmark from backend by id.
 * @param id string
 * @returns Promise void
 */
export async function deleteBookmark(id: string) : Promise<void> {
    await fetchBlogAPI(`/bookmarks/${sanitizeHtml(id, {allowedTags: []})}`, { method: 'DELETE' })
    revalidateTag(bookmarkCacheTag)
}