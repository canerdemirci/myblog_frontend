'use client'

import MDEditor from '@uiw/react-md-editor'
import { usePathname } from 'next/navigation'
import { getPost, ApiError } from '@/blog_api'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function PostPage() {
    const pathName = usePathname()
    const postId = pathName.split('/')[3]

    const [post, setPost] = useState<Post | null>(null)
    const [error, setError] = useState<ApiError | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        getPost(postId)
            .then(p => setPost(p))
            .catch(e => {
                setError(e)
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            {
                loading ? <h2>Makale yükleniyor...</h2>
                    : error !== null
                        ? <h2>Sunucu Hatası! Lütfen daha sonra tekrar deneyiniz.</h2>
                        : <div className='w-[800px] m-auto'>
                            <div className='w-[800px] h-[420px] relative m-auto my-8'>
                                <Image
                                    src={
                                        post?.cover
                                            ? `http://localhost:8000/api/static/${post?.cover}`
                                            : '/images/no_cover.png'
                                    }
                                    width={800}
                                    height={420}
                                    priority={true}
                                    alt='Makale Kapağı'
                                    style={{width: '100%', height: '100%'}}
                                    className='rounded-md'
                                />
                            </div>
                            <h1 className='text-2xl font-bold dark:text-white'>{post?.title}</h1>
                            <br />
                            <MDEditor.Markdown
                                source={post?.content}
                                style={{ whiteSpace: 'pre-wrap' }}
                            />
                            <br />
                        </div>
            }
        </div>
    )
}