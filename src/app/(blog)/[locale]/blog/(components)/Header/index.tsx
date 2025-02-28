import ColorModeButton from './components/ColorModeButton'
import UserButton from './components/UserButton'
import BookmarkButton from './components/BookmarkButton'
import SearchButton from './components/SearchButton'
import SocialButtons from '../SocialButtons'
import LanguageSwitcher from './components/LanguageSwitcher'
import { routeMap } from '@/utils/routeMap'
import { clsx } from 'clsx'
import Link from 'next/link'
import { leagueSpartan, caveat } from '@/app/fonts'
import { useTranslations } from 'next-intl'

export default function Header() {
    const t = useTranslations('Header')

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
                    <LanguageSwitcher />
                    <BookmarkButton />
                    <UserButton />
                </div>
            </div>
            <Link href={routeMap.blog.root}>
                <h1
                    className={clsx([
                        leagueSpartan.className,
                        "text-center", "text-4xl", "p-8", "text-gray-800",
                        "md:text-6xl",
                        "dark:text-white"
                    ])}
                >
                    Caner Demirci
                </h1>
            </Link>
            <SocialButtons />
            <div
                className={clsx([
                    "mt-9", "p-4"
                ])}
            >
                <p
                    className={clsx([
                        `${caveat.className}`, "text-5xl", "text-center", "text-gray-800", "mb-4",
                        "dark:text-white"
                    ])}
                >
                    {t('catchWord')}
                </p>
            </div>
        </header>
    )
}