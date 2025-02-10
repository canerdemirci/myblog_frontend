type CreateNote = {
    content: string
    images: string[]
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