type CreatePostComment = {
    text: string
    postId: string
    userId: string
}

type UpdatePostComment = {
    id: string
    text: string
}

type PostComment = CreatePostComment & {
    id: string
    createdAt: Date
    updatedAt: Date
    user?: User
    post?: Post
}