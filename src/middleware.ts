import { NextRequest, NextResponse } from 'next/server';
import { middleware2 } from './middleware2';
import { middleware1 } from './middleware1';
import { middleware3 } from '../middleware3';

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.includes('/api')) {
        const response3 = middleware3(req)

        if (response3) {
            return response3
        }
    }
    
    if (req.nextUrl.pathname.includes('/blog')) {
        const response1 = await middleware1(req)

        if (response1) {
            return response1
        }
    }

    if (req.nextUrl.pathname.includes('/admin') && !req.nextUrl.pathname.includes('/admin/login')) {
        const response2 = await middleware2(req)

        if (response2) {
            return response2
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/blog/:path*', '/admin/:path*', '/api/:path*']
}