'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { MdAccountCircle, MdAppRegistration, MdLogin, MdLogout } from "react-icons/md"
import { IoPersonCircle } from "react-icons/io5"
import { routeMap } from '@/utils/routeMap'
import { clsx } from 'clsx'

export default function UserButton() {
    const { data: session } = useSession()
console.log(session)
    return (
        <div className={clsx(['relative', 'group'])}>
            {/* User profile photo or Avatar icon */}
            {
                session?.user?.image
                    ? <Image
                        width={36}
                        height={36}
                        src={session.user.image}
                        alt="Profil foto"
                        className={clsx([
                            'rounded-full', 'border-gray-400', 'border', 'cursor-pointer'
                        ])}
                    />
                    : <IoPersonCircle size={36} className={clsx(['dark:text-white'])} />
            }
            {/* Menu */}
            <div
                className={clsx([
                    'absolute', 'hidden', 'w-28', 'left-[-7rem]', 'top-[-2px]', 'flex-col', 'group-hover:flex', 'bg-gray-300', 'shadow-xl', 'rounded-md'
                ])}
            >
                {/* Sign in */}
                {
                    !session?.user &&
                    <Link
                        href="/api/auth/signin"
                        className={clsx([
                            'flex', 'justify-between', 'items-center', 'gap-2', 'p-2', 'hover:bg-gray-400', 'cursor-pointer', 'rounded-md'
                        ])}
                    >
                        <span>Giriş Yap</span>
                        <MdLogin />
                    </Link>
                }
                {/* Sign up */}
                {
                    !session?.user && 
                    <Link
                        href={routeMap.blog.users.register.root}
                        className={clsx([
                            'flex', 'justify-between', 'items-center', 'gap-2', 'p-2', 'hover:bg-gray-400', 'cursor-pointer rounded-md'
                        ])}
                    >
                        <span>Üye Ol</span>
                        <MdAppRegistration />
                    </Link>
                }
                {/* Profile page */}
                {
                    session?.user &&
                    <Link
                        href={routeMap.blog.users.profile.root}
                        className={clsx([
                            'flex', 'justify-between', 'items-center', 'gap-2', 'p-2', 'hover:bg-gray-400', 'cursor-pointer rounded-md'
                        ])}
                    >
                        <span>Profil</span>
                        <MdAccountCircle />
                    </Link>
                }
                {/* Sign out */}
                {
                    session?.user &&
                    <Link
                        href="/api/auth/signout"
                        className={clsx([
                            'flex', 'justify-between', 'items-center', 'gap-2', 'p-2', 'hover:bg-gray-400', 'cursor-pointer', 'rounded-md'
                        ])}
                    >
                        <span>Çıkış Yap</span>
                        <MdLogout />
                    </Link>
                }
            </div>
        </div>
    )
}