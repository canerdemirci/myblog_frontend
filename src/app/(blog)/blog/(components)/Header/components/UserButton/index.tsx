'use client'

import { useSession } from 'next-auth/react'
import { routeMap } from '@/app/(admin)/routeMap'
import Image from 'next/image'
import Link from 'next/link'
import { MdAccountCircle, MdAppRegistration, MdLogin, MdLogout } from "react-icons/md"
import { IoPersonCircle } from "react-icons/io5"

export default function UserButton() {
    const { data: session } = useSession()

    return (
        <div className='relative group'>
            {
                session?.user?.image
                    ? <Image
                        width={36}
                        height={36}
                        src={session.user.image}
                        alt="Profil foto"
                        className='rounded-full border-gray-400 border cursor-pointer'
                    />
                    : <IoPersonCircle size={36} className={'dark:text-white'} />
            }
            <div className='absolute hidden w-28 left-[-7rem] top-[-2px] flex-col group-hover:flex bg-gray-300 shadow-xl rounded-md'>
                {!session?.user && <Link
                    href="/api/auth/signin"
                    className='flex justify-between items-center gap-2 p-2 hover:bg-gray-400 cursor-pointer rounded-md'>
                    <span>Giriş Yap</span>
                    <MdLogin />
                </Link>}
                {!session?.user && <Link
                    href={routeMap.blog.users.register.root}
                    className='flex justify-between items-center gap-2 p-2 hover:bg-gray-400 cursor-pointer rounded-md'>
                    <span>Üye Ol</span>
                    <MdAppRegistration />
                </Link>}
                {session?.user && <Link
                    href={routeMap.blog.users.profile.root}
                    className='flex justify-between items-center gap-2 p-2 hover:bg-gray-400 cursor-pointer rounded-md'>
                    <span>Profil</span>
                    <MdAccountCircle />
                </Link>}
                {session?.user && <Link
                    href="/api/auth/signout"
                    className='flex justify-between items-center gap-2 p-2 hover:bg-gray-400 cursor-pointer rounded-md'>
                    <span>Çıkış Yap</span>
                    <MdLogout />
                </Link>}
            </div>
        </div>
    )
}