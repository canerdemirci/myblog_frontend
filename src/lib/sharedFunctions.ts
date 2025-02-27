import { GUEST_ID_KEY } from "@/constants"
import { shortKey, signJWT } from "@/utils"

/**
 * Retrieves the guest id from local storage. If it doesn't exist, it creates a new one.
 * @returns string
 */
export function guestId() {
    let id = localStorage.getItem(GUEST_ID_KEY)

    if (!id) {
        const key = shortKey()
        localStorage.setItem(GUEST_ID_KEY, key)

        return key
    }

    return id
}

/**
 * Retrieves the admin refresh token from the client side cookie.
 * @returns string
 */
export function getAdminToken() {
    return document.cookie.split('; ').find(c => c.startsWith('refreshToken='))?.split('=')[1]
}

/**
 * Creates a new user token by signing a JWT with the user id and email.
 * @param userId string
 * @param email string
 * @returns Promise < string >
 */
export async function createUserToken(userId: string, email: string) {
    return await signJWT({ userId, email }, process.env.SECRET!, '1 week')
}