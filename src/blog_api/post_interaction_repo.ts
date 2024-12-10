import { blogApi } from "@/lib/axios"
import { routes } from "."
import sanitizeHtml from 'sanitize-html'

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

    const response = await blogApi.get(routes.getGuestPostInteraction, {
        params: { type, postId, guestId }
    })
    
    return response.data as GuestPostInteraction[]
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

    const response = await blogApi.get(routes.getUserPostInteraction, {
        params: { type, postId, userId }
    })

    return response.data as UserPostInteraction[]
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
    
    await blogApi.post(routes.addGuestPostInteraction, data)
}

/**
 * Creates a post interaction made by users in backend.
 * @param data CreateUserPostInteraction
 * @returns Promise < void >
 */
export async function addUserPostInteraction(data: CreateUserPostInteraction) : Promise<void> {
    data = {
        type: sanitizeHtml(data.type, {allowedTags: []}) as PostInteractionType,
        postId: sanitizeHtml(data.postId, {allowedTags: []}),
        userId: sanitizeHtml(data.userId, {allowedTags: []}),
    }
    
    await blogApi.post(routes.addUserPostInteraction, data)
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