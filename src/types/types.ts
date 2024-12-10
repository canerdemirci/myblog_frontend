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

type CreateNote = {
    content: string
}

type Note = CreateNote & {
    id: string
    createdAt: Date
    updatedAt: Date
    shareCount: number
    likeCount: number
    viewCount: number
}

type NoteInteractionType = 'LIKE' | 'UNLIKE' | 'VIEW' | 'SHARE'
type PostInteractionType = 'LIKE' | 'UNLIKE' | 'VIEW' | 'SHARE'
type Role = 'GUEST' | 'USER'

type CreateGuestNoteInteraction = {
    type: NoteInteractionType
    noteId: string
    guestId: string
}

type CreateUserNoteInteraction = {
    type: NoteInteractionType
    noteId: string
    userId: string
}

type GuestNoteInteraction = CreateGuestNoteInteraction & {
    id: string
    role: Role
}

type UserNoteInteraction = CreateUserNoteInteraction & {
    id: string
    role: Role
}

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

type CreateUser = {
    email: string
    password: string
}
