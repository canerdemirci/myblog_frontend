import type { User } from 'next-auth'

declare global {
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

    type Role = 'GUEST' | 'USER'
    
    type CreateUser = {
        email: string
        name?: string
        image?: string
        password?: string
        provider?: string
        providerId?: string
    }

    type UpdateUser = {
        id: string
        image?: string
        name?: string
    }

    type UserTokenInfo = {
        userId: string
        email: string
    }
}