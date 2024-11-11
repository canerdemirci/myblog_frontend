import Link from 'next/link'
import { robotoMono } from '@/app/fonts'
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

export default function PostCard({
    date, title, cover, shareCount, commentCount, readCount, likeCount, tags }: Props) {
    return (
        <div className='m-5 w-[400px]'>
            {/*<div className="bg-slate-400 h-48 w-full">cover image</div>*/}
            <Image
                src={
                    cover
                        ? `http://localhost:8000/api/static/${cover}`
                        : '/images/no_cover.png'
                }
                width={400}
                height={210}
                priority={true}
                style={{ width: '400px', height: '210px' }}
                className='rounded-md'
                alt="Makale Kapağı"
            />
            <p className={`${robotoMono.className} my-2 dark:text-white`}>{title}</p>
            <div className="flex items-center justify-between my-4">
                <p className='dark:text-white'>{date}</p>
                <div className="flex items-center justify-end gap-4">
                    {countsSectionButton(<FaShareNodes className='dark:text-white' />, shareCount)}
                    {countsSectionButton(<FaComment className='dark:text-white' />, commentCount)}
                    {countsSectionButton(<FaEye className='dark:text-white' />, readCount)}
                    {countsSectionButton(<FaHeart className='dark:text-white' />, likeCount)}
                </div>
            </div>
            {tags && <div className="flex items-center justify-start flex-wrap">
                {tags.map((t, i) => (
                    <span key={i} className={`${robotoMono.className} text-xs p-2 mr-3 mb-3 rounded-lg bg-gray-200 border-gray-100 dark:bg-gray-800 dark:text-white`}>
                        {t}
                    </span>
                ))}
            </div>}
        </div>
    )
}