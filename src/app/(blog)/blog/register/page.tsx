'use client'

import { createUser } from "@/blog_api_actions/user_repo"
import { createUserJoiSchema } from "@/utils"
import { signIn } from "next-auth/react"
import { FormEvent, useState } from "react"
import { clsx } from "clsx"

export default function RegisterPage() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [password2, setPassword2] = useState<string>('')
    const [generalError, setGeneralError] = useState<string>('')
    const [process, setProcess] = useState<boolean>(false)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        
        if (password !== password2) {
            setGeneralError('Parolalar uyuşmuyor.')

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
            setGeneralError('Parolada en az 1 küçük, 1 büyük harf, 1 rakam ve 1 sembol bulunmalıdır ve en az 10 en fazla 50 karakter olmalıdır. Email doğru girilmelidir.')
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
                setGeneralError('Parolada en az 1 küçük, 1 büyük harf, 1 rakam ve 1 sembol bulunmalıdır ve en az 10 en fazla 50 karakter olmalıdır. Email doğru girilmelidir.')
            } finally {
                setProcess(false)
            }
        }
    }
    
    return (
        <div
            className={clsx([
                "w-[95%]", "md:w-[30rem]", "my-12", "m-auto", "flex", "flex-col"
            ])}
        >
            <h1
                className={clsx([
                    "font-bold", "text-2xl", "text-gray-700", "dark:text-gray-100"
                ])}
            >
                Yeni Üyelik
            </h1>
            <form
                className={clsx([
                    "w-full", "my-4", "mx-auto", "p-4", "rounded-md", "bg-gray-200",
                    "border", "border-gray-500", "flex", "flex-col", "items-center",
                    "gap-4", "dark:bg-gray-700", "dark:border-gray-800"
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
                        E-Posta
                    </label>
                    <input
                        className={clsx([
                            "bg-gray-50", "outline-none", "p-2", "border", "border-gray-400", "rounded-md", "hover:border-gray-700", "focus:border-gray-700", "focus:border-2", "dark:bg-gray-900", "dark:text-white", "dark:focus:border-green-600", "dark:focus:border-2", "dark:hover:border-green-400"
                        ])}
                        value={email}
                        id="email"
                        type="email"
                        placeholder="E-Posta"
                        onChange={(e) => setEmail(e.target.value.trim())}
                        autoFocus
                    />
                </div>
                <div className={clsx(["w-full", "flex", "flex-col", "gap-2"])}>
                    <label
                        htmlFor="password"
                        className={clsx(["font-bold", "text-gray-600", "dark:text-gray-100"])}
                    >
                        Parola
                    </label>
                    <input
                        className={clsx([
                            "bg-gray-50", "outline-none", "p-2", "border", "border-gray-400", "rounded-md", "hover:border-gray-700", "focus:border-gray-700", "focus:border-2", "dark:bg-gray-900", "dark:text-white", "dark:focus:border-green-600", "dark:focus:border-2", "dark:hover:border-green-400"
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
                        Parola Tekrarı
                    </label>
                    <input
                        className={clsx([
                            "bg-gray-50", "outline-none", "p-2", "border", "border-gray-400", "rounded-md", "hover:border-gray-700", "focus:border-gray-700", "focus:border-2", "dark:bg-gray-900", "dark:text-white", "dark:focus:border-green-600", "dark:focus:border-2", "dark:hover:border-green-400"
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
                        "text-gray-100", "hover:bg-gray-700", "dark:bg-green-400",
                        "dark:text-gray-700", "dark:hover:bg-green-600",
                        "dark:hover:text-white"
                    ])}
                    type="submit"
                    disabled={process}
                >
                    KAYDOL
                </button>
                {
                    generalError &&
                    <p className={clsx("text-red-600")}>{generalError}</p>
                }
            </form>
        </div>
    )
}