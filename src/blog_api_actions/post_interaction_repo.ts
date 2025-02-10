'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from "@/lib/custom_fetch"
import { postInteractionCacheTag, postsCacheTag } from '../constants'
import { revalidateTag } from 'next/cache'

/**
 * Fetches post interactions made by guests, by type, postId and guestId.
 * @param type PostInteractionType
 * @param postId string
 * @param guestId string
 * @returns Promise<GuestPostInteraction[]>
 */
async function getGuestPostInteractions(
    type: PostInteractionType,
    postId: string,
    guestId: string) : Promise<GuestPostInteraction[]>
{
    type = sanitizeHtml(type, {allowedTags: []}) as PostInteractionType,
    postId = sanitizeHtml(postId, {allowedTags: []}),
    guestId = sanitizeHtml(guestId, {allowedTags: []})

    const response = await fetchBlogAPI(
        `/posts/interactions/guest?type=${type}&postId=${postId}&guestId=${guestId}`,
        { cache: 'force-cache', next: { tags: [postInteractionCacheTag] } }
    )
    
    return await response.json() as GuestPostInteraction[]
}

/**
 * Fetches post interactions made by users, by type, postId and userId.
 * @param type PostInteractionType
 * @param postId string
 * @param userId string
 * @returns Promise<UserPostInteraction[]>
 */
async function getUserPostInteractions(
    type: PostInteractionType,
    postId: string,
    userId: string) : Promise<UserPostInteraction[]>
{
    type = sanitizeHtml(type, {allowedTags: []}) as PostInteractionType,
    postId = sanitizeHtml(postId, {allowedTags: []}),
    userId = sanitizeHtml(userId, {allowedTags: []})

    const response = await fetchBlogAPI(
        `/posts/interactions/user?type=${type}&postId=${postId}&userId=${userId}`,
        { cache: 'force-cache', next: { tags: [postInteractionCacheTag] } }
    )

    return await response.json() as UserPostInteraction[]
}

/**
 * Creates a post interaction made by guests in backend.
 * @param data CreateGuestPostInteraction
 * @returns Promise < void >
 */
export async function addGuestPostInteraction(data: CreateGuestPostInteraction) : Promise<void> {
    data = {
        type: sanitizeHtml(data.type, {allowedTags: []}) as PostInteractionType,
        postId: sanitizeHtml(data.postId, {allowedTags: []}),
        guestId: sanitizeHtml(data.guestId, {allowedTags: []}),
    }
    
    await fetchBlogAPI(
        '/posts/interactions/guest',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    )

    revalidateTag(postInteractionCacheTag)
    revalidateTag(postsCacheTag)
}

/**
 * Creates a post interaction made by users in backend.
 * @param data CreateUserPostInteraction
 * @returns Promise < void >
 */
export async function addUserPostInteraction(
    data: CreateUserPostInteraction, userTokenInfo: UserTokenInfo) : Promise<void>
{
    data = {
        type: sanitizeHtml(data.type, {allowedTags: []}) as PostInteractionType,
        postId: sanitizeHtml(data.postId, {allowedTags: []}),
        userId: sanitizeHtml(data.userId, {allowedTags: []}),
    }
    
    await fetchBlogAPI(
        '/posts/interactions/user',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        undefined,
        userTokenInfo
    )

    revalidateTag(postInteractionCacheTag)
    revalidateTag(postsCacheTag)
}

/**
 * Fetches the result if the guest liked the post or not.
 * @param postId string
 * @param guestId string
 * @returns Promise < boolean >
 */
export async function isGuestLikedPost(postId: string, guestId: string) : Promise<boolean> {
    return (await getGuestPostInteractions(
        'LIKE',
        sanitizeHtml(postId, {allowedTags: []}),
        sanitizeHtml(guestId, {allowedTags: []}),
    ))
        .length > 0 ? true : false
}

/**
 * Fetches the result if the user liked the post or not.
 * @param postId string
 * @param userId string
 * @returns Promise < boolean >
 */
export async function isUserLikedPost(postId: string, userId: string) : Promise<boolean> {
    return (await getUserPostInteractions(
        'LIKE',
        sanitizeHtml(postId, {allowedTags: []}),
        sanitizeHtml(userId, {allowedTags: []}),
    ))
        .length > 0 ? true : false
}