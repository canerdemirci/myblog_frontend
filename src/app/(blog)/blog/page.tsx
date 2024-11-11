'use client'

import { useState, useEffect } from 'react';
import { getPosts } from '@/blog_api'
import PostCard from './(components)/PostCard';
import { routeMap } from '@/app/(admin)/routeMap';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [postsIsLoading, setPostsIsLoading] = useState<boolean>(true)
  const [postsError, setPostsError] = useState<Error | null>(null)

  useEffect(() => {
    getPosts()
      .then(p => setPosts(p))
      .catch(e => setPostsError(e))
      .finally(() => setPostsIsLoading(false))
  }, [])
  
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3">
      {postsIsLoading
        ? <h2>Makale yükleniyor...</h2>
        : postsError !== null
        ? <h2>Sunucu hatası! Lütfen daha sonra tekrar deneyiniz.</h2>
        : posts.map(p => (
            <Link key={p.id} href={routeMap.blog.posts.postById(p.id)}>
              <PostCard
                title={p.title}
                cover={p.cover}
                date={`${p.updatedAt}`}
                commentCount={1}
                likeCount={p.likeCount}
                readCount={p.viewCount}
                shareCount={p.shareCount}
                tags={p.tags?.map(t => t.name)}
              />
            </Link>
          )
        )
      }
    </div>
  );
}
