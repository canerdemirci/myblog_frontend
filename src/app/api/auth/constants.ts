export const ACCESS_TOKEN_NAME = 'accessToken'
export const REFRESH_TOKEN_NAME = 'refreshToken'
export const ADMIN_ACCESS_TOKEN_PAYLOAD: Readonly<any> = { role: 'admin' }
export const ADMIN_ACCESS_TOKEN_EXPIRE: Readonly<string> = '1h'
export const ADMIN_REFRESH_TOKEN_EXPIRE: Readonly<string> = '7d'
export const ADMIN_ACCESS_COOKIE_CONFIG: Readonly<any> = 
    { maxAge: 3600, path: '/' }
export const ADMIN_REFRESH_COOKIE_CONFIG: Readonly<any> = 
    { maxAge: 7 * 24 * 60 * 60, path: '/' }