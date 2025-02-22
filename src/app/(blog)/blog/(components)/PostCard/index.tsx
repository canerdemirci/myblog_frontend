import { montserrat } from '@/app/fonts'
import { FaShareNodes, FaComment, FaEye, FaHeart } from 'react-icons/fa6'
import Image from 'next/image'
import { clsx } from 'clsx'
import { routeMap } from '@/utils/routeMap'

interface Props {
    date: string
    title: string
    cover?: string
    shareCount: number
    commentCount: number
    readCount: number
    likeCount: number
    tags?: string[]
}

function countsSectionButton(icon: React.ReactNode, count: number) {
    return (
        <span
            className={clsx([
                "flex", "items-center", "justify-between", "gap-1", "dark:text-white"
            ])}
        >
            {icon} {count}
        </span>
    )
}

export default function PostCard({
    date,
    title,
    cover,
    shareCount,
    commentCount,
    readCount,
    likeCount,
    tags
} : Props
) {
    return (
        <div
            className={clsx([
                'bg-gradient-to-br', 'from-white', 'to-gray-50',
                // Always
                'bg-white', 'rounded-md', 'shadow-md', 'transition-all', 'border-2',
                'border-gray-300', 'dark:border-gray-700',
                // Dark
                'dark:from-gray-800', 'dark:to-gray-950',
                'dark:hover:shadow-gray-700 dark:hover:shadow-lg',
                // Hover
                'hover:shadow-lg hover:shadow-gray-400', 'dark:hover:border-gray-400',
                'hover:border-gray-500', 'dark:hover:brightness-110', 'sm:hover:scale-[1.02]',
                // 320 - 768
                'min-[320px]:w-full max-[768px]:w-full',
                'min-[320px]:m-0 max-[768px]:m-0',
                'min-[320px]:mb-8 max-[768px]:mb-8', 'p-2'
            ])}
        >
            <Image
                src={
                    cover
                        ? `${routeMap.static.root + '/' + cover}`
                        : '/images/no_cover.png'
                }
                width={400}
                height={210}
                priority={true}
                className={clsx([
                    'w-[100%]', 'aspect-[40/21]', 'rounded-md', 'mb-4'
                ])}
                alt="Makale Kapağı"
            />
            <div className={clsx('p-2')}>
                <p
                    className={clsx([
                        `${montserrat.className}`, 'font-bold', 'text-3xl', 'dark:text-white',
                        'text-gray-700'
                    ])}
                >
                    {title}
                </p>
                <div
                    className={clsx([
                        "flex", "items-center", "justify-between", "my-4"
                    ])}
                >
                    <p
                        className={clsx([`${montserrat.className}`, 'dark:text-white'])}
                    >
                        {date}
                    </p>
                    <div
                        className={clsx([
                            "flex", "items-center", "justify-end", "gap-4"
                        ])}
                    >
                        {countsSectionButton(
                            <FaShareNodes className={clsx('dark:text-white')} />,
                            shareCount
                        )}
                        {countsSectionButton(
                            <FaComment className={clsx('dark:text-white')} />,
                            commentCount
                        )}
                        {countsSectionButton(
                            <FaEye className={clsx('dark:text-white')} />,
                            readCount
                        )}
                        {countsSectionButton(
                            <FaHeart className={clsx('dark:text-white')} />,
                            likeCount
                        )}
                    </div>
                </div>
                {
                    tags &&
                    <div
                        className={clsx([
                            "flex", "items-center", "justify-start", "flex-wrap", "gap-2"
                        ])}
                    >
                        {tags.map((t, i) => (
                            <span
                                key={i}
                                className={clsx([
                                    `${montserrat.className}`, 'text-xs', 'p-2',
                                    'rounded-lg', 'bg-gray-200', 'border-gray-100',
                                    'dark:bg-gray-800', 'dark:text-white'
                                ])}
                            >
                                # {t}
                            </span>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}