/**
 * This middleware is used to check if the user has a valid access token.
 * If the access token is invalid, it will check if the user has a valid refresh token.
 * If the refresh token is valid, it will refresh the access token.
 * If the refresh token is invalid, it will redirect the user to the login page.
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/utils'
import { routeMap } from './utils/routeMap'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from './app/api/auth/constants'
import { fetchNextAPI } from './lib/custom_fetch'

export async function middleware2(req: NextRequest) {
    const accessToken = await verifyJWT(
        req.cookies.get(ACCESS_TOKEN_NAME)?.value ?? '',
        process.env.SECRET! as string
    )

    if (accessToken) { return NextResponse.next() }

    const refreshToken = await verifyJWT(
        req.cookies.get(REFRESH_TOKEN_NAME)?.value ?? '',
        process.env.SECRET! as string
    )

    if (refreshToken) {
        const res = await fetchNextAPI(
            routeMap.api.refreshLogin.root,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            }
        )

        const decoded = res.headers.getSetCookie().toString().split(';')[0].split('=')[1]

        if (await verifyJWT(decoded, process.env.SECRET! as string)) {
            return NextResponse.next()
        }
    }

    return NextResponse.redirect(new URL(routeMap.admin.login.root, req.url))
}