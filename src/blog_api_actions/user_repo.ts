'use server'

import sanitizeHtml from 'sanitize-html'
import { User } from "next-auth"
import { fetchBlogAPI } from "@/lib/custom_fetch"
import { userCacheTag } from '../constants'
import { revalidateTag } from 'next/cache'

/**
 * Fetches all users from backend.
 * @returns Promise <User[] | never>
 */
export async function getUsers() : Promise<User[] | never> {
    const response = await fetchBlogAPI(
        '/users',
        { cache: 'force-cache', next: { tags: [userCacheTag] } }
    )
    
    return await response.json() as User[]
}

/**
 * Fetches an user from backend by id.
 * @param id string
 * @returns Promise <User | never>
 */
export async function getUser(id: string) : Promise<User | never> {
    const response = await fetchBlogAPI(
        `/users/search/${sanitizeHtml(id, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [userCacheTag] }}
    )

    return await response.json() as User
}

/**
 * Fetches an user from backend by email.
 * @param email string
 * @returns Promise <User | never>
 */
export async function getUserByEmail(email: string) : Promise<User | never> {
    const response = await fetchBlogAPI(
        `/users/search/byemail/${sanitizeHtml(email, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [userCacheTag] }}
    )

    return await response.json() as User
}

/**
 * Fetches an user from backend by providerId.
 * @param providerId string
 * @returns Promise <User | never>
 */
export async function getUserByProviderId(providerId: string) : Promise<User | never> {
    const response = await fetchBlogAPI(
        `/users/search/byprovider/${sanitizeHtml(providerId, {allowedTags: []})}`,
        { cache: 'force-cache', next: { tags: [userCacheTag] }}
    )

    return await response.json() as User
}

/**
 * Fetches an user from backend by email.
 * @param email string
 * @returns Promise <User | never>
 */
export async function getUserByEmailAndPassword(
    email: string, password: string) : Promise<User | never>
{
    const response = await fetchBlogAPI(
        `/users/search?email=${email}&password=${password}`,
        { cache: 'force-cache', next: { tags: [userCacheTag] }}
    )

    return await response.json() as User
}

/**
 * Creates an user in the backend.
 * @param data CreateUser
 * @returns Promise < User >
*/
export async function createUser(data: CreateUser) : Promise<User> {
    // Sanitize the given data
    data = {
        email: sanitizeHtml(data.email, {allowedTags: []}),
        name: !data.name ? undefined : sanitizeHtml(data.name, {allowedTags: []}),
        image: !data.image ? undefined : sanitizeHtml(data.image, {allowedTags: []}),
        password: !data.password ? undefined : sanitizeHtml(data.password, {allowedTags: []}),
        provider: !data.provider ? undefined : sanitizeHtml(data.provider, {allowedTags: []}),
        providerId: !data.providerId ? undefined : sanitizeHtml(data.providerId, {allowedTags: []}),
    }
    
    const response = await fetchBlogAPI(
        '/users',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    )

    revalidateTag(userCacheTag)
    
    return await response.json() as User
}

/**
 * Updates a user.
 * @param data UpdateUser
 * @returns Promise < User >
 */
export async function updateUser(data: UpdateUser, userTokenInfo: UserTokenInfo) : Promise<void> {
    // Sanitize the given data
    data = {
        id: sanitizeHtml(data.id, {allowedTags: []}),
        name: !data.name ? undefined : sanitizeHtml(data.name, {allowedTags: []}),
        image: !data.image ? undefined : sanitizeHtml(data.image, {allowedTags: []}),
    }

    const response = await fetchBlogAPI(
        '/users',
        {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        },
        undefined,
        userTokenInfo
    )

    revalidateTag(userCacheTag)
}

/**
 * Deletes an user from backend by id.
 * @param id string
 * @returns Promise void
 */
export async function deleteUser(id: string) : Promise<void> {
    await fetchBlogAPI(`/users/${sanitizeHtml(id, {allowedTags: []})}`)
    revalidateTag(userCacheTag)
}