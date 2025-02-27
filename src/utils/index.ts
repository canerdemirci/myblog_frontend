import Joi from "joi"
import { JWTPayload, SignJWT, jwtVerify } from "jose"

/**
 * Creates link and downloads the file.
 * @param file string
 */
export function downloadLink(file: string) {
    try {
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = file
        a.click()
        a.remove()
    } catch (_) {
        alert('Bir hata oluştu!')
    }
}

/**
 * Sorts tags by name.
 * @param a Tag
 * @param b Tag
 * @returns 0 | 1 | -1
 */
export const sortTags = (a: Tag, b: Tag) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1 }
    if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1 }
    return 0
}

/**
 * This function is used to slice the data according to the current
 * page and the number of rows per page.
 * @param currentPage number
 * @param rowsPerPage number
 * @param totalItem number
 * @returns [number, number]
 */
export function paginationDataSliceIndexes(
    currentPage: number,
    rowsPerPage: number,
    totalItem: number
) : [number, number]
{
    const start = currentPage === 0 ? 0 : currentPage * rowsPerPage
    const end = (start + rowsPerPage) > totalItem ? totalItem : (start + rowsPerPage)

    return [start, end]
}

/**
 * Produces a random string that has 10 characters.
 * @returns string
 */
export function shortKey() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

/**
 * Produces a sha256 hash from the input string.
 * @param input string
 * @returns Promise < string >
 */
export async function sha256(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

    return hashHex
}

/**
 * Generates a key from the input string with HMAC algorithm for JWT.
 * @param secret string
 * @returns Promise < CryptoKey >
 */
export async function generateKey(secret: string): Promise<CryptoKey> {
    const enc = new TextEncoder()
    const keyData = enc.encode(secret)
    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        {
            name: 'HMAC',
            hash: 'SHA-256'
        }, 
        true,
        ['sign', 'verify']
    )
    
    return key
}

/**
 * Creates a JWT token with the given payload and secret.
 * @param payload JWTPayload
 * @param secret string
 * @param expIn string
 * @returns Promise < string >
 */
export async function signJWT(
    payload: JWTPayload,
    secret: string,
    expIn: string
): Promise<string>
{
    const key = await generateKey(secret)

    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expIn)
        .sign(key)
    
    return jwt
}

/**
 * Verifies the JWT token with the given secret.
 * @param token string
 * @param secret string
 * @returns Promise < JWTPayload | false >
 */
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

/**
 * Retrieves a cookie value by name.
 * @param name The name of the cookie.
 * @returns The value of the cookie, or null if not found.
 */
export function getCookie(name: string): string | null {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

// Joi schemas
export const createPostJoiSchema = Joi.object({
    title: Joi.string().trim().required().max(255).messages({
        'string.required': 'Makale başlığı gereklidir.',
        'string.empty': 'Makale başlığı gereklidir.',
        'string.max': 'Makale başlığı en fazla 255 karakter olabilir.'
    }),
    images: Joi.array().items(Joi.string().optional()).required().messages({
        'array.required': 'Makale içerik resim dizisi boşta olsa gereklidir.',
    }),
    content: Joi.string().optional().allow(null, ''),
    description: Joi.string().optional().allow(null, '').max(160),
    cover: Joi.string().optional(),
    tags: Joi.array().items(Joi.string().optional()).required().messages({
        'array.required': 'Makale etiket dizisi boşta olsa gereklidir.'
    })
})

export const createTagJoiSchema = Joi.object({
    name: Joi.string().trim().required().max(100).messages({
        'string.required': 'Etiket adı boş bırakılamaz.',
        'string.empty': 'Etiket adı boş bırakılamaz.',
        'string.max': 'Etiket adı en fazla 100 karakter olabilir.'
    })
})

export const createNoteJoiSchema = Joi.object({
    content: Joi.string().trim().required().messages({
        'string.required': 'Not içeriği boş bırakılamaz.',
        'string.empty': 'Not içeriği boş bırakılamaz.',
    }),
    images: Joi.array().items(Joi.string().optional()).required().messages({
        'array.required': 'Not içerik resim dizisi boşta olsa gereklidir.',
    })
})

export const createUserJoiSchema = Joi.object({
    email: Joi.string().required().max(320).email({tlds: false}).messages({
        'string.required': 'Email boş bırakılamaz.',
        'string.empty': 'Email boş bırakılamaz.',
        'string.max': 'Email en fazla 320 karakter uzunluğunda olabilir.',
        'string.email': 'Email formatı yanlış.'
    }),
    password: Joi.string().trim().required().min(10).max(50).messages({
        'string.required': 'Parola boş bırakılamaz.',
        'string.empty': 'Parola boş bırakılamaz.',
        'string.max': 'Parola en az 10, en fazla 50 karakter olmalıdır.',
        'string.min': 'Parola en az 10, en fazla 50 karakter olmalıdır.'
    }),
    password2: Joi.string().trim().required().min(10).max(50).messages({
        'string.required': 'Parola boş bırakılamaz.',
        'string.empty': 'Parola boş bırakılamaz.',
        'string.max': 'Parola en az 10, en fazla 50 karakter olmalıdır.',
        'string.min': 'Parola en az 10, en fazla 50 karakter olmalıdır.'
    }),
})

export const updateUserJoiSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.required': 'Id gereklidir',
        'string.empty': 'Id gereklidir',
    }),
    name: Joi.string().optional().allow(null, '').max(100).min(3).messages({
        'string.max': 'Kullanıcı adı en fazla 100 karakter olabilir.',
        'string.min': 'Kullanıcı adı en az 3 karakter olmalıdır.'
    }),
})