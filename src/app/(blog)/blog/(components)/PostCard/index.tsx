import { montserrat, robotoMono } from '@/app/fonts'
import { FaShareNodes, FaComment, FaEye, FaHeart } from 'react-icons/fa6'
import Image from 'next/image'

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
        <span className="flex items-center justify-between gap-1 dark:text-white">
            {icon} {count}
        </span>
    )
}

const postCardClasses = [
    // Always
    'bg-white rounded-md shadow-md transition-all',
    // Dark
    'dark:bg-gray-700 dark:hover:shadow-red-700 dark:hover:shadow-xl',
    // Hover
    'hover:shadow-lg hover:shadow-gray-400',
    // 320 - 768
    'min-[320px]:w-full max-[768px]:w-full',
    'min-[320px]:m-0 max-[768px]:m-0',
    'min-[320px]:mb-8 max-[768px]:mb-8',
].join(' ')

const postCardImageClasses = [
    'w-full aspect-[40/21]',
    'rounded-tl-md rounded-tr-md',
].join(' ')

export default function PostCard({
    date, title, cover, shareCount, commentCount, readCount, likeCount, tags }: Props) {
    return (
        <div className={`${postCardClasses}`}>
            <Image
                src={
                    cover
                        ? `http://localhost:8000/api/static/${cover}`
                        : '/images/no_cover.png'
                }
                width={400}
                height={210}
                priority={true}
                className={`${postCardImageClasses}`}
                alt="Makale Kapağı"
            />
            <div className='p-2'>
                <p className={`${montserrat.className} font-bold text-xl my-2 dark:text-white`}>{title}</p>
                <div className="flex items-center justify-between my-4">
                    <p className={`${montserrat.className} dark:text-white`}>{date}</p>
                    <div className="flex items-center justify-end gap-4">
                        {countsSectionButton(<FaShareNodes className='dark:text-white' />, shareCount)}
                        {countsSectionButton(<FaComment className='dark:text-white' />, commentCount)}
                        {countsSectionButton(<FaEye className='dark:text-white' />, readCount)}
                        {countsSectionButton(<FaHeart className='dark:text-white' />, likeCount)}
                    </div>
                </div>
                {tags && <div className="flex items-center justify-start flex-wrap">
                    {tags.map((t, i) => (
                        <span key={i} className={`${montserrat.className} text-xs p-2 mr-3 mb-3 rounded-lg bg-gray-200 border-gray-100 dark:bg-gray-800 dark:text-white`}>
                            # {t}
                        </span>
                    ))}
                </div>}
            </div>
        </div>
    )
}