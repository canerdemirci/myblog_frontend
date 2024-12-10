import { GUEST_ID_KEY, USER_KEY } from "@/constants"
import { shortKey } from "@/utils"
import { User } from "next-auth"

export function guestId() {
    let id = localStorage.getItem(GUEST_ID_KEY)

    if (!id) {
        const key = shortKey()
        localStorage.setItem(GUEST_ID_KEY, key)

        return key
    }

    return id
}

// TODO: Bu üçü silinebilir
export function getUserLocalStorage() : User | null {
    const _user = localStorage.getItem(USER_KEY)

    if (!_user) return null

    return JSON.parse(_user) as User
}

export function setUserLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUserLocalStorage() {
    localStorage.removeItem(USER_KEY)
}