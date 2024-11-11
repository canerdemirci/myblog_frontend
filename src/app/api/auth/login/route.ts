import { NextRequest, NextResponse } from 'next/server'
import { sha256, signJWT } from '@/utils'
import {
    ACCESS_TOKEN_NAME,
    REFRESH_TOKEN_NAME,
    ADMIN_ACCESS_TOKEN_PAYLOAD,
    ADMIN_ACCESS_TOKEN_EXPIRE,
    ADMIN_REFRESH_TOKEN_EXPIRE,
    ADMIN_ACCESS_COOKIE_CONFIG,
    ADMIN_REFRESH_COOKIE_CONFIG,
} from '../constants'

// Login next api route
export async function POST(req: NextRequest) {
    const { pin } = await req.json()

    const adminPin = process.env.NEXT_PUBLIC_ADMIN_PIN
    const hashedPin = await sha256(pin)

    if (hashedPin === adminPin) {
        try {
            const accessToken = await signJWT(
                ADMIN_ACCESS_TOKEN_PAYLOAD,
                process.env.NEXT_PUBLIC_SECRET! as string,
                ADMIN_ACCESS_TOKEN_EXPIRE
            )
            const refreshToken = await signJWT(
                ADMIN_ACCESS_TOKEN_PAYLOAD,
                process.env.NEXT_PUBLIC_SECRET! as string,
                ADMIN_REFRESH_TOKEN_EXPIRE
            )

            const response = NextResponse.json({ message: 'Authenticated' }, { status: 200 })

            response.cookies.set(
                ACCESS_TOKEN_NAME,
                accessToken,
                ADMIN_ACCESS_COOKIE_CONFIG
            )
            response.cookies.set(
                REFRESH_TOKEN_NAME,
                refreshToken,
                ADMIN_REFRESH_COOKIE_CONFIG
            )

            return response
        } catch (_) {
            return NextResponse.json({ message: 'Invalid PIN' }, { status: 401 })
        }
    } else {
        return NextResponse.json({ message: 'Invalid PIN' }, { status: 401 })
    }
}