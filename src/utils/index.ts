import Joi from "joi"
import { JWTPayload, SignJWT, jwtVerify } from "jose"

export const sortTags = (a: Tag, b: Tag) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1 }
    if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1 }
    return 0
}

export function paginationDataSliceIndexes(
    currentPage: number, rowsPerPage: number, totalItem: number) {
    const start = currentPage === 0 ? 0 : currentPage * rowsPerPage
    const end = (start + rowsPerPage) > totalItem ? totalItem : (start + rowsPerPage)

    return [start, end]
}

export async function sha256(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

    return hashHex
}

export async function generateKey(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder()
    const keyData = enc.encode(secret)
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, 
        true,
        ['sign', 'verify']
    )
    
    return key
}

export async function signJWT(payload: JWTPayload, secret: string, expIn: string): Promise<string> {
    const key = await generateKey(secret)

    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expIn)
        .sign(key)
    
    return jwt
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | false> {
    const key = await generateKey(secret)

    try {
        const decoded = (await jwtVerify(token, key)).payload
        return decoded
    } catch (error) {
        console.error('JWT verification failed:', error)
        return false
    }
}

// Joi schemas
export const createPostJoiSchema = Joi.object({
    title: Joi.string().required().max(255).messages({
        'string.required': 'Makale başlığı gereklidir.',
        'string.empty': 'Makale başlığı gereklidir.',
        'string.max': 'Makale başlığı en fazla 255 karakter olabilir.'
    })
})

export const createTagJoiSchema = Joi.object({
    name: Joi.string().required().max(100).messages({
        'string.required': 'Etiket adı boş bırakılamaz.',
        'string.empty': 'Etiket adı boş bırakılamaz.',
        'string.max': 'Etiket adı en fazla 100 karakter olabilir.'
    })
})