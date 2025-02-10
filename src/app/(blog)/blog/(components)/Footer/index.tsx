import { clsx } from 'clsx'

export default function Footer() {
    return (
        <footer
            className={clsx([
                "bg-slate-200", "p-20", "text-center", "dark:bg-gray-900",
                "dark:text-white"
            ])}
        >
            © 2024 Caner Demirci - Kişisel Blog Sayfam
        </footer>
    )
}