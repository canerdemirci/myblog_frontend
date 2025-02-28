"use client"

import clsx from "clsx"
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from "next-intl"
import { GrLanguage } from "react-icons/gr"

export default function LanguageSwitcher() {
    const pathName = usePathname()
    const router = useRouter()
    const locale = useLocale()

    return (
        <div className={clsx(['cursor-pointer', 'group', 'relative'])}>
            <GrLanguage size={28} className={clsx(['text-gray-800', 'dark:text-gray-100'])} />
            {/* Menu */}
            <div
                className={clsx([
                    'absolute', 'hidden', 'left-[-2px]', 'top-[28px]', 'bg-gray-300', 'shadow-xl', 'rounded-md', 'flex-col',
                    'group-hover:flex',
                ])}
            >
                <Link
                    href={pathName}
                    locale="tr"
                    className={clsx([
                        locale === 'tr' ? 'bg-red-500' : 'bg-gray-300',
                        'p-2', 'cursor-pointer', 'rounded-md',
                        'hover:bg-gray-400',
                    ])}
                >
                    <span>TR</span>
                </Link>
                <Link
                    href={pathName}
                    locale="en"
                    className={clsx([
                        locale === 'en' ? 'bg-red-500' : 'bg-gray-300',
                        'p-2', 'cursor-pointer', 'rounded-md',
                        'hover:bg-gray-400',
                    ])}
                >
                    <span>EN</span>
                </Link>
            </div>
        </div>
    )
}