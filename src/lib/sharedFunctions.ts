import { GUEST_ID_KEY } from "@/constants"
import { shortKey, signJWT } from "@/utils"

export function guestId() {
    let id = localStorage.getItem(GUEST_ID_KEY)

    if (!id) {
        const key = shortKey()
        localStorage.setItem(GUEST_ID_KEY, key)

        return key
    }

    return id
}

export function getAdminToken() {
    return document.cookie.split('; ').find(c => c.startsWith('refreshToken='))?.split('=')[1]
}

export async function createUserToken(userId: string, email: string) {
    return await signJWT({ userId, email }, process.env.SECRET!, '1 week')
}