import { blogApi } from '@/lib/axios'
import sanitizeHtml from 'sanitize-html'
import { routes } from '.'

/**
 * Creates a post in the backend.
 * Post content doesn't sanitize because MkEditor rhype plugin handles it.
 * @param data CreatePost
 * @returns Promise <Post | never>
 */
export async function createPost(data: CreatePost) : Promise<Post | never> {
    // Sanitize the given data
    data = {
        title: sanitizeHtml(data.title, {allowedTags: []}),
        content: data.content,
        cover: sanitizeHtml(data.cover ?? '', {allowedTags: []}),
        tags: data.tags.map(t => sanitizeHtml(t, {allowedTags: []}))
    }

    const response = await blogApi.post(routes.createPost, data)

    return response.data as Post
}

/**
 * Updates a post in the backend.
 * Post content doesn't sanitize because MkEditor rhype plugin handles it.
 * @param data UpdatePost
 * @returns Promise <Post | never>
 */
export async function updatePost(data: UpdatePost) : Promise<Post | never> {
    // Sanitize the given data
    data = {
        id: sanitizeHtml(data.id, {allowedTags: []}),
        title: sanitizeHtml(data.title, {allowedTags: []}),
        content: data.content,
        cover: sanitizeHtml(data.cover ?? '', {allowedTags: []}),
        tags: data.tags.map(t => sanitizeHtml(t, {allowedTags: []}))
    }

    const response = await blogApi.put(routes.updatePost, data)

    return response.data as Post
}

/**
 * Fetches all posts from backend.
 * @returns Promise<Post[] | never>
 */
export async function getPosts() : Promise<Post[] | never> {
    const response = await blogApi.get(routes.allPosts)
    
    return response.data as Post[]
}

/**
 * Fetches a post from backend by id.
 * @param id string
 * @returns Promise<Post | never>
 */
export async function getPost(id: string) : Promise<Post | never> {
    const response = await blogApi.get(routes.postById(
        sanitizeHtml(id, {allowedTags: []})
    ))

    return response.data as Post
}

/**
 * Deletes a post from backend by id.
 * @param id string
 * @returns Promise < void >
 */
export async function deletePost(id: string) : Promise<void> {
    await blogApi.delete(routes.deletePostById(id))
}