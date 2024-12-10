import { sha256 } from '@/utils'
import { blogApi } from '@/lib/axios'
import sanitizeHtml from 'sanitize-html'

const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export class ApiError extends Error {
    protected _data: ApiErrorDetails

    get data() {
        return this._data
    }
    
    constructor(data: ApiErrorDetails) {
        super(data.message)
        this._data = data
    }
}

export const routes = {
    // Posts
    createPost: '/posts',
    updatePost: '/posts',
    allPosts: '/posts',
    postById: (id: string) => '/posts/' + id,
    deletePostById: (id: string) => '/posts/' + id,

    // Post interactions
    addGuestPostInteraction: '/posts/interactions/guest',
    addUserPostInteraction: '/posts/interactions/user',
    getGuestPostInteraction: '/posts/interactions/guest',
    getUserPostInteraction: '/posts/interactions/user',

    // Notes
    createNote: '/notes',
    allNotes: '/notes',
    noteById: (id: string) => '/notes/' + id,
    deleteNoteById: (id: string) => '/notes/' + id,

    // Note interactions
    addGuestNoteInteraction: '/notes/interactions/guest',
    addUserNoteInteraction: '/notes/interactions/user',
    getGuestNoteInteraction: '/notes/interactions/guest',
    getUserNoteInteraction: '/notes/interactions/user',

    // Tags
    createTag: '/tags',
    allTags: '/tags',
    tagById: (id: string) => '/tags/' + id,
    deleteTagById: (id: string) => '/tags/' + id,

    // Users
    createUser: '/users',
    allUsers: '/users',
    userById: (id: string) => '/users/search/' + id,
    userByEmailAndPassword: '/users/search',
    deleteUserById: (id: string) => '/users/' + id,

    // Upload, delete cover
    uploadCover: '/upload',
    deleteCover: (fileName: string) => '/delete-cover/' + fileName,
}

// Ensure the axios sends api key in header in each request
blogApi.interceptors.request.use(
    async (config) => {
        const hashedApiKey = await sha256(API_KEY!)
        config.headers['x-api-key'] = hashedApiKey
        return config
    },
    error => Promise.reject(error)
)

// Error handling. Unexpected errors are also an ApiError now.
blogApi.interceptors.response.use(
    response => response,
    error => {
        throw new ApiError({
            message: !error.response ? (error.message || 'Sunucu Hatası!')
                : error.response.message || 'Sunucu Hatası!',
            status: !error.response ? 500 : (error.response.status || 500)
        })
    }
)

/**
 * Uploads cover photos to backend storage with form data (file input).
 * @param data FormData
 * @returns Promise <string | never>
 */
export async function uploadCover(data: FormData) : Promise<string | never> {
    const response = await blogApi.post(routes.uploadCover, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data.fileName
}

/**
 * Deletes the post cover photo from backend storage.
 * @param fileName string
 * @returns Promise void
 */
export async function deleteCover(fileName: string) : Promise<void> {
    // Sanitize the file name
    fileName = sanitizeHtml(fileName, {allowedTags: []})
    await blogApi.delete(routes.deleteCover(fileName))
}