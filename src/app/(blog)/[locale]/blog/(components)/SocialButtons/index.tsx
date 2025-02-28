import clsx from "clsx"
import Link from "next/link"
import { FaGithub, FaHashnode, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6"

export default function SocialButtons() {
    return (
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
    )
}