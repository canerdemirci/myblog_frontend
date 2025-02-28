/**
 * Middleware for /blog and /admin routes.
 */
import { NextRequest, NextResponse } from 'next/server'
import { middleware2 } from './middleware2'
import { middleware1 } from './middleware1'
import createIntlMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(req: NextRequest) {
    // I want to implement multi language support for the blog pages.
    // So, I will run the next-intl middleware for the /blog routes.
    if (req.nextUrl.pathname.includes('/blog')) {
        // Run the next-intl middleware first
        const intlResponse = intlMiddleware(req)

        // If the next-intl middleware returns a response, return it
        if (intlResponse) {
            return intlResponse
        }

        const response1 = await middleware1(req)

        if (response1) {
            return response1
        }
    }

    // Protect /admin routes except /admin/login page.
    if (req.nextUrl.pathname.includes('/admin') && !req.nextUrl.pathname.includes('/admin/login')) {
        const response2 = await middleware2(req)

        if (response2) {
            return response2
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/(tr|en)/:path*', '/blog/:path*', '/admin/:path*']
}