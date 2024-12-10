import { blogApi } from "@/lib/axios"
import { routes } from "."
import sanitizeHtml from 'sanitize-html'
import { User } from "next-auth"

/**
 * Fetches all users from backend.
 * @returns Promise <User[] | never>
 */
export async function getUsers() : Promise<User[] | never> {
    const response = await blogApi.get(routes.allUsers)
    
    return response.data as User[]
}

/**
 * Fetches an user from backend by id.
 * @param id string
 * @returns Promise <User | never>
 */
export async function getUser(id: string) : Promise<User | never> {
    const response = await blogApi.get(routes.userById(
        sanitizeHtml(id, {allowedTags: []}),
    ))

    return response.data as User
}

/**
 * Fetches an user from backend by email.
 * @param email string
 * @returns Promise <User | never>
 */
export async function getUserByEmailAndPassword(
    email: string, password: string) : Promise<User | never>
{
    const response = await blogApi.get(routes.userByEmailAndPassword, {
        params: {
            email: sanitizeHtml(email, {allowedTags: []}),
            password: sanitizeHtml(password, {allowedTags: []}),
        }
    })

    return response.data as User
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
        password: sanitizeHtml(data.password, {allowedTags: []}),
    }
    
    const response = await blogApi.post(routes.createUser, data)
    
    return response.data as User
}

/**
 * Deletes an user from backend by id.
 * @param id string
 * @returns Promise void
 */
export async function deleteUser(id: string) : Promise<void> {
    await blogApi.delete(routes.deleteUserById(
        sanitizeHtml(id, {allowedTags: []})
    ))
}