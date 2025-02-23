import { getPost, getRelatedPosts } from '@/blog_api_actions/post_repo'
import { montserrat } from '@/app/fonts'
import Image from 'next/image'
import { clsx } from 'clsx'
import { IoMdEye } from 'react-icons/io'
import { routeMap } from '@/utils/routeMap'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth'
import CommentsSection from './(components)/CommentsSection'
import ArticleContent from './(components)/ArticleContent'
import Interactions from './(components)/Interactions'
import NotFound from '../../(components)/NotFound'
import ErrorElement from '../../(components)/ErrorElement'
import Tags from './(components)/Tags'
import Link from 'next/link'
import type { Metadata, ResolvingMetadata } from 'next'
import { cache, Suspense } from 'react'
import { MdImage } from 'react-icons/md'
import ErrorBoundary from '@/app/(components)/ErrorBoundary'
import UpButton from '../../(components)/UpButton'

type Props = {
    params: { id: string }
}

const fetchPost = cache(async (id: string) => await getPost(id))

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata)
    : Promise<Metadata> {
    try {
        const postId = params.id as string
        const post = await fetchPost(postId)

        return {
            title: post.title,
            keywords: post.tags.map(t => t.name),
            description: post.description,
            openGraph: {
                title: post.title,
                description: post.description,
                url: process.env.NEXT_PUBLIC_BASE_URL! + routeMap.blog.posts.postById(post.id),
                type: "article",
                publishedTime: `${post.createdAt}`,
                authors: ['Caner DEMİRCİ'],
                ...(post.cover && {
                    images: [
                        {
                            url: routeMap.static.root + '/' + post.cover,
                            alt: post.title,
                            width: 1200,
                            height: 630
                        }
                    ]
                })
            }
        }
    } catch (error) {
        return {
            title: "Hata"
        }
    }
}

export default async function PostPage({ params }: Props) {
    const session = await getServerSession(authOptions)
    const postId = params.id as string

    function PostCover(post: Post) {
        return (
            <Image
                src={
                    post.cover
                        ? `${routeMap.static.root}/${post.cover}`
                        : '/images/no_cover.png'
                }
                width={800}
                height={420}
                priority={true}
                alt='Makale Kapağı'
                className={clsx([
                    'aspect-[40/21]', 'w-full', 'md:rounded-tl-lg', 'md:rounded-tr-lg', 'mb-4'
                ])}
            />
        )
    }

    function RelatedPosts(relatedPosts: RelatedPost[]) {
        return (
            <section>
                <h2
                    className={clsx([
                        montserrat.className,
                        'text-center', 'font-bold', 'text-3xl', 'text-gray-800',
                        'mt-16', 'mb-8', 'dark:text-gray-100'
                    ])}
                >
                    İLGİNİZİ ÇEKEBİLECEK DİĞER MAKALELER
                </h2>
                <div className={clsx(['grid', 'sm:grid-cols-2', 'gap-8'])}>
                    {relatedPosts.map(rp => (
                        <Link
                            key={rp.id}
                            href={routeMap.blog.posts.postById(rp.id)}
                            className={clsx([
                                'break-inside-avoid', 'break-after-avoid-page',
                                'inline-block', 'w-full'
                            ])}
                        >
                            <div className={clsx(['flex', 'flex-col', 'gap-4'])}>
                                <Image
                                    src={
                                        rp.cover
                                            ? `${routeMap.static.root}/${rp.cover}`
                                            : '/images/no_cover.png'
                                    }
                                    width={400}
                                    height={210}
                                    priority={true}
                                    className={clsx([
                                        'w-full', 'aspect-[40/21]', 'sm:rounded-tl-md',
                                        'sm:rounded-tr-md'
                                    ])}
                                    alt="Makale Kapağı"
                                />
                                <div
                                    className={clsx([
                                        'flex', 'justify-between', 'gap-8'
                                    ])}
                                >
                                    <h3
                                        className={clsx([
                                            'font-bold', 'dark:text-gray-100', 'text-xl'
                                        ])}
                                    >
                                        {rp.title}
                                    </h3>
                                    <p
                                        className={clsx([
                                            'font-bold', 'text-gray-500', 'text-xl',
                                            'dark:text-gray-300',
                                        ])}
                                    >
                                        {`${rp.createdAt}`}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        )
    }

    async function Post() {
        try {
            const post = await fetchPost(postId)
            const relatedPosts = await getRelatedPosts(post.tags.map(t => t.name))

            return (
                <>
                    <UpButton />
                    <main
                        className={clsx([
                            'w-full', 'md:w-[85%]', 'lg:w-[75%]', 'xl:w-[65%]',
                            'md:m-auto', 'md:mb-16', 'bg-white',
                            'dark:bg-[#0d1116]', 'md:rounded-lg', 'md:drop-shadow-xl',
                            'md:border', 'dark:border-gray-800', 'border-gray-300'
                        ])}
                    >
                        {PostCover(post)}
                        <div>
                            {/* Post Title */}
                            <h1
                                className={clsx([
                                    montserrat.className, 'p-4', 'text-4xl', 'md:text-5xl',
                                    'font-bold', 'dark:text-gray-100', 'text-gray-700'
                                ])}
                            >
                                {post.title}
                            </h1>
                            <div className={clsx('p-4')}>
                                <div
                                    className={clsx([
                                        montserrat.className, 'text-xl', 'dark:text-white'
                                    ])}
                                >
                                    {/* Some info about post */}
                                    <div className={clsx([
                                        'flex', 'mb-4', 'items-center', 'gap-2'
                                    ])}>
                                        {`${post.createdAt}`} <IoMdEye /> {post.viewCount}
                                    </div>
                                </div>
                                <ArticleContent content={post.content} />
                                <Interactions post={post} user={session?.user} />
                                <Tags post={post} />
                                <CommentsSection
                                    user={session?.user}
                                    postId={post.id}
                                />
                                {relatedPosts.length > 0 && RelatedPosts(relatedPosts)}
                            </div>
                        </div>
                    </main>
                </>
            )
        } catch (error: any) {
            if (error?.data?.status === 404) {
                return (
                    <NotFound text="Makale bulunamadı." />
                )
            } else {
                throw error
            }
        }
    }

    return (
        <ErrorBoundary fallback={
            <div className={clsx('my-36')}>
                <ErrorElement
                    iconSize={180}
                    text={(
                        <p className={clsx(['xs:text-4xl', 'text-2xl'])}>Bir hata oluştu!</p>
                    )}
                />
            </div>
        }>
            <Suspense fallback={
                <main
                    className={clsx([
                        'relative', 'w-full', 'sm:w-[65%]',
                        'sm:mx-auto', 'mb-16', 'flex', 'flex-col', 'gap-4', 'animate-pulse'
                    ])}
                >
                    <div
                        className={clsx([
                            'md:rounded-md', 'bg-gray-300', 'w-full', 'aspect-[40/21]',
                            'flex', 'justify-center', 'items-center'
                        ])}
                    >
                        <MdImage size={120} className='text-gray-400' />
                    </div>
                    <div
                        className={clsx([
                            'w-[60%]', 'h-5', 'bg-gray-300'
                        ])}
                    ></div>
                    <div
                        className={clsx([
                            'w-[30%]', 'h-5', 'bg-gray-300'
                        ])}
                    ></div>
                </main>
            }>
                <Post />
            </Suspense>
        </ErrorBoundary>
    )
}