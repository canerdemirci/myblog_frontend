import { clsx } from 'clsx'
import SocialButtons from '../SocialButtons'

export default function Footer() {
    return (
        <footer
            className={clsx([
                "flex", "flex-col", "gap-8", "justify-center", "items-center",
                "bg-gray-100", "p-20", "text-center", "border-t", "border-gray-300",
                // dark
                "dark:bg-gray-900", "dark:text-white", "dark:border-gray-800"
            ])}
        >
            © 2024 Caner Demirci - Kişisel Blog Sitem
            <SocialButtons />
        </footer>
    )
}