'use server'

import sanitizeHtml from 'sanitize-html'
import { fetchBlogAPI } from '@/lib/custom_fetch'
import { BlogStatistics } from '@/types/statistics'

export async function getStatistics() : Promise<BlogStatistics | never> {
    const response = await fetchBlogAPI('/statistics', {
        cache: 'no-store'
    })

    return await response.json() as BlogStatistics
}

/**
 * Uploads cover photos to backend storage with form data (file input).
 * @param data FormData
 * @returns Promise <string | never>
 */
export async function uploadCover(data: FormData) : Promise<string | never> {
    const response = await fetchBlogAPI(
        '/upload',
        {
            method: 'POST',
            body: data
        }
    )

    const file = await response.json()

    return file.fileName
}

/**
 * Uploads post's images to backend storage with form data (file input).
 * @param data FormData
 * @returns Promise <string | never>
 */
export async function uploadPostImages(data: FormData) : Promise<string | never> {
    const response = await fetchBlogAPI(
        '/upload-post-images',
        {
            method: 'POST',
            body: data
        }
    )

    const file = await response.json()

    return file.fileName
}

/**
 * Deletes the post cover photo from backend storage.
 * @param fileName string
 * @returns Promise void
 */
export async function deleteCover(fileName: string) : Promise<void> {
    // Sanitize the file name
    fileName = sanitizeHtml(fileName, {allowedTags: []})
    await fetchBlogAPI(`/delete-cover/${fileName}`, {method: 'DELETE'})
}

/**
 * Deletes the post image from backend storage.
 * @param fileName string
 * @returns Promise void
 */
export async function deletePostImage(fileName: string) : Promise<void> {
    // Sanitize the file name
    fileName = sanitizeHtml(fileName, {allowedTags: []})
    await fetchBlogAPI(`/delete-postimage/${fileName}`, {method: 'DELETE'})
}

/**
 * Uploads note's images to backend storage with form data (file input).
 * @param data FormData
 * @returns Promise <string | never>
 */
export async function uploadNoteImages(data: FormData) : Promise<string | never> {
    const response = await fetchBlogAPI(
        '/upload-note-images',
        {
            method: 'POST',
            body: data
        }
    )

    const file = await response.json()

    return file.fileName
}

/**
 * Uploads user's avatar to backend storage with form data (file input).
 * @param data FormData
 * @returns Promise <string | never>
 */
export async function uploadUserAvatar(data: FormData) : Promise<string | never> {
    const response = await fetchBlogAPI(
        '/upload-user-avatar',
        {
            method: 'POST',
            body: data
        }
    )

    const file = await response.json()

    return file.fileName
}

/**
 * Deletes the note image from backend storage.
 * @param fileName string
 * @returns Promise void
 */
export async function deleteNoteImage(fileName: string) : Promise<void> {
    // Sanitize the file name
    fileName = sanitizeHtml(fileName, {allowedTags: []})
    await fetchBlogAPI(`/delete-noteimage/${fileName}`, {method: 'DELETE'})
}

/**
 * Deletes the user avatar from backend storage.
 * @param fileName string
 * @returns Promise void
 */
export async function deleteUserAvatar(fileName: string) : Promise<void> {
    // Sanitize the file name
    fileName = sanitizeHtml(fileName, {allowedTags: []})
    await fetchBlogAPI(`/delete-useravatar/${fileName}`, {method: 'DELETE'})
}