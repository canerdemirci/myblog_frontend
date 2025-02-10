type CreateTag = {
    name: string
}

type Tag = CreateTag & {
    id: string
    postCount: number
}