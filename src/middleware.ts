import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/utils'
import { routeMap } from './app/(admin)/routeMap'
import { nextApi } from '@/lib/axios'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from './app/api/auth/constants'

export async function middleware(req: NextRequest) {
    const accessToken = await verifyJWT(
        req.cookies.get(ACCESS_TOKEN_NAME)?.value ?? '',
        process.env.NEXT_PUBLIC_SECRET! as string
    )

    if (accessToken) { return NextResponse.next() }

    const refreshToken = await verifyJWT(
        req.cookies.get(REFRESH_TOKEN_NAME)?.value ?? '',
        process.env.NEXT_PUBLIC_SECRET! as string
    )

    if (refreshToken)
    {
        const res = await nextApi.post(
            process.env.NEXT_PUBLIC_ENV === 'dev'
                ? process.env.NEXT_PUBLIC_BASE_URL_DEV + '/api' + routeMap.api.refreshLogin.root
                : process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION + '/api' + routeMap.api.refreshLogin.root,
            { refreshToken }
        )

        const decoded = res.headers['set-cookie']!.toString().split(';')[0].split('=')[1]

        if (await verifyJWT(decoded, process.env.NEXT_PUBLIC_SECRET! as string)) {
            return NextResponse.next()
        }
    }

    return NextResponse.redirect(new URL(routeMap.admin.login.root, req.url))
}

// admin routes except login route
export const config = { matcher: ['/admin((?!/login).*)'] }