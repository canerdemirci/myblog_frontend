import { clsx } from 'clsx'
import Link from 'next/link'
import { FaGithub, FaHashnode, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa6'

export default function Footer() {
    return (
        <footer
            className={clsx([
                "bg-slate-200", "p-20", "text-center", "dark:bg-gray-900",
                "dark:text-white", "flex", "flex-col", "gap-8", "justify-center", "items-center",
                "border-t", "dark:border-gray-800", "border-gray-300"
            ])}
        >
            © 2024 Caner Demirci - Kişisel Blog Sitem
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
                    rel="noopener noreferrer"
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
        </footer>
    )
}