type ApiErrorDetails = {
    status?: number
    code?: number
    message: string
}

type Cookie = {
    key: string
    value: string
    maxAge: number
}

type CreateTag = {
    name: string
}

type Tag = CreateTag & {
    id: string
    postCount: number
}

type CreatePost = {
    title: string
    content?: string
    cover?: string
    tags: string[]
}

type UpdatePost = CreatePost & { id: string }

type Post = Omit<CreatePost, 'tags'> & {
    id: string
    createdAt: Date
    updatedAt: Date
    tags: Tag[]
    shareCount: number
    likeCount: number
    viewCount: number
}