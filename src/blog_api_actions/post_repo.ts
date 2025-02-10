'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from '@/lib/custom_fetch'
import { revalidateTag } from 'next/cache'
import { postsCacheTag } from '../constants'

/**
 * Creates a post in the backend.
 * Post content doesn't sanitize because MkEditor rhype plugin handles it.
 * @param data CreatePost
 * @returns Promise <Post | never>
 */
export async function createPost(data: CreatePost, adminToken?: string) : Promise<Post | never> {
    // Sanitize the given data
    data = {
        title: sanitizeHtml(data.title, {allowedTags: []}),
        images: data.images.map(i => sanitizeHtml(i, {allowedTags: []})),
        content: data.content,
        description: sanitizeHtml(data.description ?? '', {allowedTags: []}),
        cover: sanitizeHtml(data.cover ?? '', {allowedTags: []}),
        tags: data.tags.map(t => sanitizeHtml(t, {allowedTags: []}))
    }
    
    const response = await fetchBlogAPI(
        '/posts',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        },
        adminToken
    )

    revalidateTag(postsCacheTag)

    return await response.json() as Post
}

/**
 * Updates a post in the backend.
 * Post content doesn't sanitize because MkEditor rhype plugin handles it.
 * @param data UpdatePost
 * @returns Promise <Post | never>
 */
export async function updatePost(data: UpdatePost, adminToken?: string) : Promise<void> {
    // Sanitize the given data
    data = {
        id: sanitizeHtml(data.id, {allowedTags: []}),
        title: sanitizeHtml(data.title, {allowedTags: []}),
        images: data.images.map(i => sanitizeHtml(i, {allowedTags: []})),
        content: data.content,
        description: sanitizeHtml(data.description ?? '', {allowedTags: []}),
        cover: sanitizeHtml(data.cover ?? '', {allowedTags: []}),
        tags: data.tags.map(t => sanitizeHtml(t, {allowedTags: []}))
    }

    const response = await fetchBlogAPI(
        '/posts',
        {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        adminToken
    )

    revalidateTag(postsCacheTag)
}

/**
 * Fetches all posts with optional tag and limitation from backend.
 * @params pagination { take: number, skip: number } | undefined
 * @returns Promise<Post[] | never>
 */
export async function getPosts(
    pagination?: { take: number, skip: number },
    tagId?: string
)
    : Promise<Post[] | never>
{
    const url = (): string => {
        const a = '/posts'
        const pag = (pagination?.take !== undefined && pagination?.skip !== undefined)
            ? ('?take=' + pagination.take + '&skip=' + pagination.skip) : ''
        const tag = tagId !== undefined ? ((!pag ? '?' : '&') + 'tagId=' + tagId) : ''

        return a + pag + tag
    }

    const response = await fetchBlogAPI(
        url(),
        { cache: 'force-cache', next: { tags: [postsCacheTag] } }
    )
    
    return await response.json() as Post[]
}

/**
 * Fetches a post from backend by id.
 * @param id string
 * @returns Promise<Post | never>
 */
export async function getPost(id: string) : Promise<Post | never> {
    const response = await fetchBlogAPI(
        `/posts/${sanitizeHtml(id, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [postsCacheTag] } }
    )

    return await response.json() as Post
}

/**
 * Fetches post search results from backend.
 * @param query string
 * @returns Promise<PostSearchResult[] | never>
 */
export async function getPostSearchResults(query: string) : Promise<PostSearchResult[] | never> {
    const response = await fetchBlogAPI(
        `/posts/search/${sanitizeHtml(query, {allowedTags: []})}`,
        { cache: 'no-store' }
    )

    return await response.json() as PostSearchResult[]
}

/**
 * Fetches related posts by tags from backend maximum 6 piece.
 * @param tags string[]
 * @returns Promise<RelatedPost[] | never>
 */
export async function getRelatedPosts(tags: string[]) : Promise<RelatedPost[] | never> {
    const response = await fetchBlogAPI(
        '/posts/related',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tags: tags.map(t => sanitizeHtml(t, {allowedTags: []})) }),
            cache: 'force-cache',
            next: { tags: [postsCacheTag] }
        },
    )

    return await response.json() as RelatedPost[]
}

/**
 * Fetches posts that belongs to a tag comes from backend.
 * @param tag string
 * @returns Promise<PostOfTag[] | never>
 */
export async function getPostsOfTag(tag: string) : Promise<PostOfTag[] | never> {
    const response = await fetchBlogAPI(
        `/posts/tag/${tag}`,
        {
            cache: 'force-cache',
            next: { tags: [postsCacheTag] }
        }
    )

    return await response.json() as PostOfTag[]
}

/**
 * Deletes a post from backend by id.
 * @param id string
 * @returns Promise < void >
 */
export async function deletePost(id: string, adminToken?: string) : Promise<void> {
    await fetchBlogAPI(
        `/posts/${id}`,
        { method: 'DELETE' },
        adminToken
    )

    revalidateTag(postsCacheTag)
}

/**
 * Fetches all unused post covers from backend
 * @returns Promise<string[] | never>
 */
export async function getUnusedPostCovers() : Promise<string[] | never>
{
    const response = await fetchBlogAPI(
        '/posts/maintenance/unused-covers',
        { cache: 'no-store' }
    )
    
    return await response.json() as string[]
}

/**
 * Fetches all unused post content images from backend
 * @returns Promise<string[] | never>
 */
export async function getUnusedPostImages() : Promise<string[] | never>
{
    const response = await fetchBlogAPI(
        '/posts/maintenance/unused-images',
        { cache: 'no-store' }
    )
    
    return await response.json() as string[]
}