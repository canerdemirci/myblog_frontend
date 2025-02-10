type CreateGuestBookmark = {
    postId: string
    guestId: string
}

type CreateUserBookmark = {
    postId: string
    userId: string
}

type GuestBookmark = CreateGuestBookmark & {
    id: string
    post?: {
        id: string
        title: string
    }
}

type UserBookmark = CreateUserBookmark & {
    id: string
    post?: {
        id: string
        title: string
    }
}