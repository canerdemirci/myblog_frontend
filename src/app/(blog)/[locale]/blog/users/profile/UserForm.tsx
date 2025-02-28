'use client'

import Image from "next/image"
import { useState } from "react"

import clsx from "clsx"
import { routeMap } from "@/utils/routeMap"
import { updateUserJoiSchema } from "@/utils"

import { IoPersonCircle } from "react-icons/io5"

import { deleteUserAvatar, uploadUserAvatar } from "@/blog_api_actions"
import { updateUser } from "@/blog_api_actions/user_repo"

import type { User } from "next-auth"
import { useTranslations } from "next-intl"

export default function UserForm({ user } : { user: User }) {
    const tErr = useTranslations('ErrorMessages')
    const t = useTranslations('ProfilePage')

    const [userImage, setUserImage] = useState<string | null | undefined>(user.image)
    const [userName, setUserName] = useState<string | undefined>(user.name)
    const [userImageFormData, setUserImageFormData] = useState<FormData | null>(null)
    const [formPending, setFormPending] = useState<boolean>(false)
    
    return (
        <form
            className={clsx(['flex', 'flex-col', 'items-center', 'gap-4', 'my-16'])}
            onSubmit={(e) => {
                e.preventDefault()

                const validation = updateUserJoiSchema.validate({ id: user.id, name: userName })

                if (validation.error) {
                    alert(
                        tErr('basic')
                        + validation.error.details.map(e => e.message + "\n")
                    )
                } else {
                    setFormPending(true)

                    if (userImageFormData) {
                        uploadUserAvatar(userImageFormData)
                            .then(fileName => {
                                updateUser({
                                    id: user.id,
                                    image: routeMap.static.root + '/user_avatars/' + fileName,
                                    ...(user.name !== userName && { name: userName })
                                }, { email: user.email, userId: user.id })
                                    .then(_ => alert(t('saveMessage')))
                                    .catch(_ => alert(tErr('basic')))
                                    .finally(() => setFormPending(false))
                            })
                            .catch(_ => alert(t('photoError')))
                            .finally(() => setFormPending(false))
                        
                        if (user.image?.includes('user_avatars')) {
                            deleteUserAvatar(user.image.substring(user.image.lastIndexOf('/') + 1))
                        }
                    } else {
                        if (user.name !== userName) {
                            updateUser({
                                id: user.id,
                                name: userName,
                            }, { email: user.email, userId: user.id })
                                .then(_ => alert(t('saveMessage')))
                                .catch(_ => alert(tErr('basic')))
                                .finally(() => setFormPending(false))
                        }
                    }
                }
            }}
        >
            <h1 className={clsx(['font-bold', 'text-3xl', 'dark:text-white'])}>
                {t('title')}
            </h1>
            <h3 className={clsx(['font-bold', 'text-2xl', 'dark:text-white'])}>
                {t('photoTitle')}
            </h3>
            {
                <div className={clsx([
                    'w-[250px]', 'h-[250px]', 'border', 'border-gray-300', 'rounded-full',
                    'flex', 'items-center', 'justify-center'
                ])}>
                    {
                        userImage
                            ? <Image
                                src={userImage}
                                width={250}
                                height={250}
                                alt="Profil foto"
                                className={clsx([
                                    'shadow-md', 'aspect-square', 'rounded-full'
                                ])}
                            />
                            : <IoPersonCircle
                                size={72}
                                className={clsx(['dark:text-white'])}
                            />
                    }
                </div>
            }
            <p className="text-red-700">{t('warning')}</p>
            <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                className={clsx([
                    'p-2', 'border', 'border-gray-300', 'rounded-md', 'dark:text-white'
                ])}
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                        const reader = new FileReader()
                        reader.onload = () => setUserImage(reader.result as string)
                        reader.readAsDataURL(file)

                        const formData = new FormData()
                        formData.append('userAvatar', file)
                        setUserImageFormData(formData)
                    }
                }}
            />
            <h3 className={clsx(['font-bold', 'text-2xl', 'dark:text-white'])}>{t('userName')}</h3>
            <input
                className={clsx([
                    'w-72', 'p-2', 'border', 'border-gray-300', 'rounded-md'
                ])}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t('namePlaceholder')}
            />
            <h3 className={clsx(['font-bold', 'text-2xl', 'dark:text-white'])}>{t('email')}</h3>
            <p className={clsx('dark:text-white')}>{user.email}</p>
            <button
                type="submit"
                className={clsx([
                    'p-4', 'rounded-md', 'bg-green-500', 'text-white', 'hover:bg-green-700'
                ])}
                disabled={formPending}
            >
                {formPending ? t('process') : t('save')}
            </button>
        </form>
    )
}