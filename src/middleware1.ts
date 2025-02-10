import { NextRequest, NextResponse } from 'next/server'
import { fetchBlogAPI } from './lib/custom_fetch'

export async function middleware1(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || req.ip
    
    fetchBlogAPI('/statistics/addnewguestip/' + ip)

    return NextResponse.next()
}