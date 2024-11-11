import { NextRequest, NextResponse } from 'next/server'
import { signJWT } from '@/utils'
import {
    ACCESS_TOKEN_NAME,
    ADMIN_ACCESS_COOKIE_CONFIG,
    ADMIN_ACCESS_TOKEN_EXPIRE
} from '../constants'

export async function POST(req: NextRequest) {
    const { refreshToken } = await req.json()

    if (refreshToken) {
        try {
            const newAccessToken = await signJWT(
                { role: (refreshToken as any).role },
                process.env.NEXT_PUBLIC_SECRET! as string,
                ADMIN_ACCESS_TOKEN_EXPIRE
            )

            const response = NextResponse.json({ message: 'Token refreshed' }, { status: 200 })

            response.cookies.set(
                ACCESS_TOKEN_NAME,
                newAccessToken,
                ADMIN_ACCESS_COOKIE_CONFIG
            )

            return response
        } catch (_) {
            return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
        }
    } else {
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
    }
}