import { createUserToken } from "./sharedFunctions"

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

/**
 ** Custom fetch api function.
 ** set "x-api-key" header for blog api
 ** set "Authorization" header with user token (Bearer) for user authorization
 ** set "x-admin" header with admin token blog api for giving permission for some actions
 */
export async function fetchBlogAPI(
    input: string | URL | globalThis.Request,
    init?: RequestInit,
    adminToken?: string,
    userTokenInfo?: UserTokenInfo
) : Promise<Response> {
    const _headers = new Headers()

    const userToken = !userTokenInfo
        ? undefined
        : await createUserToken(userTokenInfo?.userId, userTokenInfo?.email)

    _headers.append("x-api-key", process.env.NEXT_PUBLIC_API_KEY!)

    if (adminToken) _headers.append("x-admin", adminToken)
    if (userToken) _headers.append("Authorization", `Bearer ${userToken}`)
    
    const prexif = process.env.NEXT_PUBLIC_BLOG_API_BASE_URL!

    if (typeof input === 'string') {
        input = prexif + input
    }

    if (input instanceof URL) {
        input = new URL(prexif + input.pathname)
    }

    if (input instanceof Request) {
        input = new Request(prexif + input.url)
    }

    const response = await fetch(input, {
        ...init,
        headers: {
            ...Object.fromEntries(_headers.entries()),
            ...init?.headers
        }
    })

    if (!response.ok) {
        const j = await response.json()

        throw new ApiError({
            message: j.message,
            status: response.status
        })
    }

    return response
}

/**
 * Custom fetch api function for next js internal api
 */
export async function fetchNextAPI(
    input: string | URL | globalThis.Request,
    init?: RequestInit
) : Promise<Response> {
    const response = await fetch(
        typeof input === 'string'
        ? process.env.NEXT_PUBLIC_BASE_URL! + '/api' + input
        : input instanceof URL
            ? new URL(process.env.NEXT_PUBLIC_BASE_URL! + '/api' + input.pathname)
            : new Request(process.env.NEXT_PUBLIC_BASE_URL! + '/api' + input.url,
                { ...input }), init)

    if (!response.ok) {
        const j = await response.json()

        throw new ApiError({
            message: j.message,
            status: response.status
        })
    }

    return response
}