import { FaHashnode, FaInstagram, FaYoutube, FaLinkedin, FaGithub } from 'react-icons/fa6'
import { leagueSpartan, caveat } from '@/app/fonts'
import Link from 'next/link'

import ColorModeButton from './components/ColorModeButton'
import UserButton from './components/UserButton'
import BookmarkButton from './components/BookmarkButton'
import SearchButton from './components/SearchButton'

import { routeMap } from '@/utils/routeMap'
import { clsx } from 'clsx'

export default function Header() {
    return (
        <header>
            <div
                className={clsx([
                    "flex", "justify-between", "items-center", "p-4"
                ])}
            >
                <div
                    className={clsx([
                        "flex", "justify-between", "items-center", "gap-4"
                    ])}
                >
                    <SearchButton />
                    <ColorModeButton />
                </div>
                <div
                    className={clsx([
                        "flex", "justify-between", "items-center", "gap-4"
                    ])}
                >
                    <BookmarkButton />
                    <UserButton />
                </div>
            </div>
            <Link href={routeMap.blog.root}>
                <h1
                    className={clsx([
                        leagueSpartan.className, "text-center", "text-4xl", "md:text-6xl",
                        "p-8", "text-gray-800", "dark:text-white"
                    ])}
                >
                    Caner Demirci
                </h1>
            </Link>
            <div className={clsx(["flex", "justify-center", "gap-4"])}>
                <Link
                    href="https://canerdemirciblog.hashnode.dev/"
                    target='_blank'
                    rel="noopener noreferrer"
                >
                    <FaHashnode
                        size={24}
                        className={clsx([
                            'dark:text-white', 'cursor-pointer', 'hover:text-blue-500'
                        ])}
                        aria-label='Hashnode Sayfam'
                    />
                </Link>
                <Link
                    href="https://www.instagram.com/cnrdmrcinst/"
                    target='_blank'
                    rel="noopener noreferrer"
                >
                    <FaInstagram
                        size={24}
                        className={clsx([
                            'dark:text-white', 'cursor-pointer', 'hover:text-orange-500'
                        ])}
                        aria-label='Instagramım'
                    />
                </Link>
                <Link
                    href="https://github.com/canerdemirci"
                    target='_blank'
                >
                    <FaGithub
                        size={24}
                        className={clsx([
                            'dark:text-white', 'cursor-pointer', 'hover:text-green-500'
                        ])}
                        aria-label='Githubım'
                    />
                </Link>
                <Link
                    href="https://www.linkedin.com/in/caner-demirci-12a587113/"
                    target='_blank'
                    rel="noopener noreferrer"
                >
                    <FaLinkedin
                        size={24}
                        className={clsx([
                            'dark:text-white', 'cursor-pointer', 'hover:text-blue-500'
                        ])}
                        aria-label='Linkedin sayfam'
                    />
                </Link>
                <Link
                    href="https://www.youtube.com/channel/UCPRYzHxfP8DWbxnxI4X2WeA"
                    target='_blank'
                    rel="noopener noreferrer"
                >
                    <FaYoutube
                        size={24}
                        className={clsx([
                            'dark:text-white', 'cursor-pointer', 'hover:text-red-500'
                        ])}
                        aria-label='Youtube Kanalım'
                    />
                </Link>
            </div>
            <div
                className={clsx([
                    "mt-9", "p-4"
                ])}
            >
                <p
                    className={clsx([
                        `${caveat.className}`, "text-5xl", "text-center",
                        "text-gray-800", "dark:text-white", "mb-4"
                    ])}
                >
                    A Developer Diary
                </p>
            </div>
        </header>
    )
}