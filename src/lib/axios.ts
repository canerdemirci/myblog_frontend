import axios from 'axios'

// axios instance for next js internal api
export const nextApi = axios.create({
    baseURL: '/api',
    withCredentials: true,
})
// axios instance for my blog api
export const blogApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ENV === 'dev'
        ? process.env.NEXT_PUBLIC_BLOG_API_BASE_URL_DEV
        : process.env.NEXT_PUBLIC_BLOG_API_BASE_URL_PRODUCTION,
})