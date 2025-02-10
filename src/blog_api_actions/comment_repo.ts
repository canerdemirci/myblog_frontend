'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from "@/lib/custom_fetch"
import { commentCacheTag, postsCacheTag } from '../constants'
import { revalidateTag } from 'next/cache'

/**
 * Fetches all comments belong to a post from backend.
 * @param postId string
 * @returns Promise <PostComment[] | never>
 */
export async function getCommentsByPostId(postId: string) : Promise<PostComment[] | never> {
    const response = await fetchBlogAPI(
        `/comments/bypostid/${postId}`,
        { cache: 'force-cache', next: { tags: [commentCacheTag] } }
    )
    
    return await response.json() as PostComment[]
}

/**
 * Fetches all comments from backend.
 * @returns Promise <PostComment[] | never>
 */
export async function getAllComments() : Promise<PostComment[] | never> {
    const response = await fetchBlogAPI(
        '/comments/all',
        { cache: 'force-cache', next: { tags: [commentCacheTag] } }
    )
    
    return await response.json() as PostComment[]
}

/**
 * Fetches a comment from backend by id.
 * @param id string
 * @returns Promise <PostComment | never>
 */
export async function getComment(id: string) : Promise<PostComment | never> {
    const response = await fetchBlogAPI(
        `/comments/${sanitizeHtml(id, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [commentCacheTag] } }
    )

    return await response.json() as PostComment
}

/**
 * Creates a comment in the backend.
 * @param data CreatePostComment
 * @returns Promise < PostComment >
*/
export async function createComment(
    data: CreatePostComment, adminToken?: string, userTokenInfo?: UserTokenInfo)
    : Promise<PostComment | never>
{
    // Sanitize the given data
    data = {
        text: sanitizeHtml(data.text, {allowedTags: []}),
        postId: sanitizeHtml(data.postId, {allowedTags: []}),
        userId: sanitizeHtml(data.userId, {allowedTags: []}),
    }

    const response = await fetchBlogAPI(
        '/comments',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        adminToken,
        userTokenInfo
    )

    revalidateTag(commentCacheTag)
    revalidateTag(postsCacheTag)
    
    return await response.json() as PostComment
}

/**
 * Updates a comment.
 * @param data UpdatePostComment
 * @returns Promise < void >
*/
export async function updateComment(
    data: UpdatePostComment, adminToken?: string, userTokenInfo?: UserTokenInfo) : Promise<void> {
    // Sanitize the given data
    data = {
        id: sanitizeHtml(data.id, {allowedTags: []}),
        text: sanitizeHtml(data.text, {allowedTags: []}),
    }

    await fetchBlogAPI(
        '/comments',
        {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        adminToken,
        userTokenInfo
    )

    revalidateTag(commentCacheTag)
}

/**
 * Deletes a comment from backend by id.
 * @param id string
 * @returns Promise void
 */
export async function deleteComment(
    id: string, adminToken?: string, userTokenInfo?: UserTokenInfo) : Promise<void>
{
    await fetchBlogAPI(`/comments/${sanitizeHtml(id, {allowedTags: []})}`,
        { method: 'DELETE' }, adminToken, userTokenInfo)
    
    revalidateTag(commentCacheTag)
}