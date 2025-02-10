type CreatePost = {
    title: string
    images: string[]
    content?: string
    description?: string
    cover?: string
    tags: string[]
}

type UpdatePost = CreatePost & { id: string }

// tags omitted because CreatePost and Post tags are different.
type Post = Omit<CreatePost, 'tags'> & {
    id: string
    createdAt: Date
    updatedAt: Date
    tags: Tag[]
    shareCount: number
    likeCount: number
    viewCount: number
    commentCount: number
}

type PostSearchResult = {
    id: string
    title: string
}

type RelatedPost = {
    id: string
    title: string
    createdAt: Date
    cover?: string
}

type PostOfTag = {
    id: string
    title: string
    createdAt: Date
    cover?: string
}

type PostInteractionType = 'LIKE' | 'UNLIKE' | 'VIEW' | 'SHARE'

type CreateGuestPostInteraction = {
    type: PostInteractionType
    postId: string
    guestId: string
}

type CreateUserPostInteraction = {
    type: PostInteractionType
    postId: string
    userId: string
}

type GuestPostInteraction = CreateGuestPostInteraction & {
    id: string
    role: Role
}

type UserPostInteraction = CreateUserPostInteraction & {
    id: string
    role: Role
}