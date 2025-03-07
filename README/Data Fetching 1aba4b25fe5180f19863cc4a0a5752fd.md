# Data Fetching

We use custom fetch method and server actions for data fetching, caching and next js revalidating functions.

## ./src/lib/custom_fetch.ts

```tsx
/**
 * Custom fetch utility functions for the blog external api and Next.js internal APIs.
 */
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
 ** Shared fetch utility function.
 ** Handles common fetch logic, error handling, and response parsing.
 */
async function fetchWithErrorHandling(
    input: string | URL | globalThis.Request,
    init?: RequestInit,
    baseUrl?: string,
    headers?: Headers
): Promise<Response> {
    try {
        // Construct the full URL if a base URL is provided
        let fullInput: string | URL | Request

        if (baseUrl) {
            if (typeof input === 'string') {
                fullInput = baseUrl + input
            } else if (input instanceof URL) {
                fullInput = new URL(baseUrl + input.pathname)
            } else if (input instanceof Request) {
                fullInput = new Request(baseUrl + input.url, input)
            } else {
                throw new ApiError({
                    message: "Invalid input type for fetch",
                    status: 400,
                })
            }
        } else {
            fullInput = input;
        }

        // Perform the fetch request
        const response = await fetch(fullInput, {
            ...init,
            headers: headers
                ? { ...Object.fromEntries(headers.entries()), ...init?.headers }
                : init?.headers,
        })

        // Handle non-OK responses
        if (!response.ok) {
            let errorMessage = `Sunucu hatası! Status: ${response.status}`

            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorMessage
            } catch (jsonError) {
                console.error("Failed to parse error response JSON:", jsonError)
            }

            throw new ApiError({
                message: errorMessage,
                status: response.status,
            })
        }

        return response
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        } else {
            console.error("Sunucu hatası:", error)

            throw new ApiError({
                message: "Sunucu hatası.",
                status: 500,
            })
        }
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
): Promise<Response> {
    const headers = new Headers()

    // Generate user token if userTokenInfo is provided
    const userToken = userTokenInfo
        ? await createUserToken(userTokenInfo.userId, userTokenInfo.email)
        : undefined

    // Set headers
    headers.append("x-api-key", process.env.NEXT_PUBLIC_API_KEY!)
    if (adminToken) headers.append("x-admin", adminToken)
    if (userToken) headers.append("Authorization", `Bearer ${userToken}`)

    // Use the shared fetch utility function
    return fetchWithErrorHandling(
        input,
        init,
        process.env.NEXT_PUBLIC_BLOG_API_BASE_URL!,
        headers
    )
}

/**
 ** Custom fetch API function for Next.js internal API.
 */
export async function fetchNextAPI(
    input: string | URL | globalThis.Request,
    init?: RequestInit
): Promise<Response> {
    // Use the shared fetch utility function
    return fetchWithErrorHandling(
        input,
        init,
        process.env.NEXT_PUBLIC_BASE_URL! + '/api'
    )
}
```

### Example of Using Custom Fetch Method in Server Action

We want to be cached response and give it a cache tag.

```tsx
/**
 * Fetches a post from backend by id.
 * @param id string
 * @returns Promise<Post | never>
 */
export async function getPost(id: string) : Promise<Post | never> {
    const response = await fetchBlogAPI(
        `/posts/${sanitizeHtml(id, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [postsCacheTag] } }
    )

    return await response.json() as Post
}
```

And here we revalidate post cache tag when a post created

```tsx
/**
 * Creates a post in the backend.
 * Post content doesn't sanitize because MkEditor rhype plugin handles it.
 * @param data CreatePost
 * @returns Promise <Post | never>
 */
export async function createPost(data: CreatePost, adminToken?: string) : Promise<Post | never> {
    // Sanitize the given data
    data = {
        title: sanitizeHtml(data.title, {allowedTags: []}),
        images: data.images.map(i => sanitizeHtml(i, {allowedTags: []})),
        content: data.content,
        description: sanitizeHtml(data.description ?? '', {allowedTags: []}),
        cover: sanitizeHtml(data.cover ?? '', {allowedTags: []}),
        tags: data.tags.map(t => sanitizeHtml(t, {allowedTags: []}))
    }
    
    const response = await fetchBlogAPI(
        '/posts',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        },
        adminToken
    )

    revalidateTag(postsCacheTag)
    revalidateTag(tagCacheTag)

    return await response.json() as Post
}
```