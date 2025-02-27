/**
 * Logout route for admin panel.
 * Deletes access and refresh tokens from cookies.
 */
import { NextResponse } from 'next/server'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants'

export async function GET() {
    try {
        const response = NextResponse.json({ message: 'Logged out.' }, { status: 200 })
        
        response.cookies.set(
            ACCESS_TOKEN_NAME,
            '',
            {
                maxAge: 0,
                path: '/',
                secure: process.env.NODE_ENV === 'production' ? true : false
            }
        )
        response.cookies.set(
            REFRESH_TOKEN_NAME,
            '',
            {
                maxAge: 0,
                path: '/',
                secure: process.env.NODE_ENV === 'production' ? true : false
            }
        )
    
        return response
    } catch (_) {
        return NextResponse.json({ message: 'Logout failed' }, { status: 500 })
    }
}