'use client'

import { createUser } from "@/blog_api_actions/user_repo"
import { createUserJoiSchema } from "@/utils"
import { signIn } from "next-auth/react"
import { FormEvent, useState } from "react"
import { clsx } from "clsx"
import { useTranslations } from "next-intl"

export default function RegisterPage() {
    const t = useTranslations('RegisterPage')
    
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [generalError, setGeneralError] = useState<string>('')
    const [process, setProcess] = useState<boolean>(false)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        
        if (password !== password2) {
            setGeneralError(t('unmatchedPassError'))

            return
        } else {
            setGeneralError('')
        }

        const validation = createUserJoiSchema.validate({
            email: email,
            password: password,
            password2: password2,
        })

        if (validation.error) {
            setGeneralError(t('passwordRules'))
        } else {
            setGeneralError('')

            try {
                setProcess(true)

                const user = await createUser({
                    email: email,
                    password: password
                })

                if (user) {
                    await signIn('credentials')
                }
            } catch (_) {
                setGeneralError(t('passwordRules'))
            } finally {
                setProcess(false)
            }
        }
    }
    
    return (
        <div
            className={clsx([
                "w-[95%]", "my-12", "m-auto", "flex", "flex-col", "md:w-[30rem]"
            ])}
        >
            <h1
                className={clsx([
                    "font-bold", "text-2xl", "text-gray-700", "dark:text-gray-100"
                ])}
            >
                {t('newMembership')}
            </h1>
            <form
                className={clsx([
                    "w-full", "my-4", "mx-auto", "p-4", "rounded-md", "bg-gray-200",
                    "border", "border-gray-500", "flex", "flex-col", "items-center",
                    "gap-4",
                    // dark
                    "dark:bg-gray-700", "dark:border-gray-800"
                ])}
                onSubmit={handleSubmit}
            >
                <div className={clsx(["w-full", "flex", "flex-col", "gap-2"])}>
                    <label
                        htmlFor="email"
                        className={clsx([
                            "font-bold", "text-gray-600", "dark:text-gray-100"
                        ])}
                    >
                        {t('email')}
                    </label>
                    <input
                        className={clsx([
                            "bg-gray-50", "outline-none", "p-2", "border", "border-gray-400",
                            "rounded-md",
                            // dark
                            "dark:bg-gray-900",
                            "dark:text-white", "dark:focus:border-green-600",
                            "dark:focus:border-2", "dark:hover:border-green-400",
                            // focus
                            "focus:border-gray-700", "focus:border-2",
                            // hover
                            "hover:border-gray-700",
                        ])}
                        value={email}
                        id="email"
                        type="email"
                        placeholder={t('email')}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        autoFocus
                    />
                </div>
                <div className={clsx(["w-full", "flex", "flex-col", "gap-2"])}>
                    <label
                        htmlFor="password"
                        className={clsx(["font-bold", "text-gray-600", "dark:text-gray-100"])}
                    >
                        {t('password')}
                    </label>
                    <input
                        className={clsx([
                            "bg-gray-50", "outline-none", "p-2", "border", "border-gray-400",
                            "rounded-md",
                            // focus
                            "focus:border-2", "focus:border-gray-700",
                            // dark
                            "dark:bg-gray-900", "dark:text-white",
                            "dark:focus:border-green-600", "dark:focus:border-2",
                            "dark:hover:border-green-400",
                            // hover
                            "hover:border-gray-700",
                        ])}
                        value={password}
                        id="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value.trim())}
                    />
                </div>
                <div className={clsx(["w-full", "flex", "flex-col", "gap-2"])}>
                    <label
                        htmlFor="password2"
                        className={clsx(["font-bold", "text-gray-600", "dark:text-gray-100"])}
                    >
                        {t('password2')}
                    </label>
                    <input
                        className={clsx([
                            "bg-gray-50", "outline-none", "p-2", "border", "border-gray-400", "rounded-md",     
                            // dark
                            "dark:bg-gray-900", "dark:text-white",
                            "dark:hover:border-green-400", 
                            // focus
                            "focus:border-gray-700", "focus:border-2",
                            "dark:focus:border-green-600", "dark:focus:border-2",
                            // hover
                            "hover:border-gray-700",
                        ])}
                        value={password2}
                        id="password2"
                        type="password"
                        onChange={(e) => setPassword2(e.target.value.trim())}
                    />
                </div>
                <button
                    className={clsx([
                        "bg-gray-600", "p-2", "w-full", "rounded-md", "font-bold",
                        "text-gray-100",
                        // hover
                        "hover:bg-gray-700",
                        // dark
                        "dark:text-gray-700", "dark:bg-green-400",
                        "dark:hover:text-white", "dark:hover:bg-green-600",
                    ])}
                    type="submit"
                    disabled={process}
                >
                    {t('register')}
                </button>
                {
                    generalError &&
                    <p className={clsx("text-red-600")}>{generalError}</p>
                }
            </form>
        </div>
    )
}