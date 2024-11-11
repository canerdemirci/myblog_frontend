import { sha256 } from '@/utils'
import { blogApi } from '@/lib/axios'
import sanitizeHtml from 'sanitize-html'

const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const routes = {
    // Posts
    createPost: '/posts',
    updatePost: '/posts',
    allPosts: '/posts',
    postById: (id: string) => '/posts/' + id,
    deletePostById: (id: string) => '/posts/' + id,
    // Tags
    createTag: '/tags',
    allTags: '/tags',
    tagById: (id: string) => '/tags/' + id,
    deleteTagById: (id: string) => '/tags/' + id,
    // Upload, delete cover
    uploadCover: '/upload',
    deleteCover: (fileName: string) => '/delete-cover/' + fileName,
}

// Ensure the axios sends api key in header in each request
blogApi.interceptors.request.use(async (config) => {
    const hashedApiKey = await sha256(API_KEY!)
    config.headers['x-api-key'] = hashedApiKey
    return config
}, (error) => {
    return Promise.reject(error)
})

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

export async function createPost(data: CreatePost) : Promise<Post | never> {
    try {
        // Sanitize the given data
        data = {
            title: sanitizeHtml(data.title, {allowedTags: []}),
            content: data.content,
            cover: sanitizeHtml(data.cover ?? '', {allowedTags: []}),
            tags: data.tags.map(t => sanitizeHtml(t, {allowedTags: []}))
        }

        const response = await blogApi.post(routes.createPost, data)

        if (response.status !== 201) {
            throw new ApiError({
                status: response.status,
                message: 'Sunucu Hatası!'
            })
        }

        return response.data as Post
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function updatePost(data: UpdatePost) : Promise<Post | never> {
    try {
        // Sanitize the given data
        data = {
            id: sanitizeHtml(data.id, {allowedTags: []}),
            title: sanitizeHtml(data.title, {allowedTags: []}),
            content: data.content,
            cover: sanitizeHtml(data.cover ?? '', {allowedTags: []}),
            tags: data.tags.map(t => sanitizeHtml(t, {allowedTags: []}))
        }

        const response = await blogApi.put(routes.updatePost, data)

        if (response.status !== 204) {
            throw new ApiError({
                status: response.status,
                message: 'Sunucu Hatası!'
            })
        }

        return response.data as Post
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function getPosts() : Promise<Post[] | never> {
    try {
        const response = await blogApi.get(routes.allPosts)
        
        if (response.status !== 200) {
            throw new ApiError({ message: 'Sunucu Hatası!', status: response.status })
        }

        return response.data as Post[]
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function getPost(id: string) : Promise<Post | never> {
    try {
        const response = await blogApi.get(routes.postById(id))

        if (response.status !== 200) {
            throw new ApiError({ message: 'Sunucu Hatası!', status: response.status })
        }

        return response.data as Post
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function deletePost(id: string) : Promise<void> {
    try {
        const response = await blogApi.delete(routes.deletePostById(id))

        if (response.status !== 204) {
            throw new ApiError({
                message: 'Sunucu Hatası! Makale silinemedi.',
                status: response.status
            })
        }
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function getTags() : Promise<Tag[] | never> {
    try {
        const response = await blogApi.get(routes.allTags)
        
        if (response.status !== 200) {
            throw new ApiError({message: 'Sunucu Hatası!', status: response.status })
        }

        return response.data as Tag[]
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function getTag(id: string) : Promise<Tag | never> {
    try {
        const response = await blogApi.get(routes.tagById(id))

        if (response.status !== 200) {
            throw new ApiError({ message: 'Sunucu Hatası!', status: response.status })
        }

        return response.data as Tag
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function deleteTag(id: string) : Promise<void> {
    try {
        const response = await blogApi.delete(routes.deleteTagById(id))

        if (response.status !== 204) {
            throw new ApiError({ message: 'Sunucu Hatası!', status: response.status })
        }
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function createTag(data: CreateTag) : Promise<Tag> {
    try {
        // Sanitize the given data
        data = {
            name: sanitizeHtml(data.name, {allowedTags: []}),
        }

        const response = await blogApi.post(routes.createTag, data)

        if (response.status !== 201) {
            throw new ApiError({ message: 'Sunucu Hatası!', status: response.status })
        }

        return response.data as Tag
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function uploadCover(data: FormData) : Promise<string | never> {
    try {
        const response = await blogApi.post(routes.uploadCover, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        if (response.status !== 200) {
            throw new ApiError({
                code: response.data.code,
                message: response.data.message,
                status: response.status
            })
        }

        return response.data.fileName
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}

export async function deleteCover(fileName: string) : Promise<void> {
    try {
        // Sanitize the file name
        fileName = sanitizeHtml(fileName, {allowedTags: []})

        const response = await blogApi.delete(routes.deleteCover(fileName))

        if (response.status !== 204) {
            throw new ApiError({
                status: response.status,
                message: 'Sunucu Hatası! Kapak resmi silinemedi.'
            })
        }
    } catch (error) {
        throw new ApiError({
            status: 500,
            message: 'Sunucu Hatası!'
        })
    }
}