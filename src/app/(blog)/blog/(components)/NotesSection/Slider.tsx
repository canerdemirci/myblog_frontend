'use client'

import clsx from "clsx"

interface Props {
    children: React.ReactNode[]
}

export default function Slider({ children }: Props) {
    return (
        <section
            className={clsx([
                "relative", "m-4", "py-4", "overflow-x-auto", "flex", "items-center", "gap-8",
                "notes-scrollbar", "dark:notes-scrollbar-dark", "select-none"
            ])}
            onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft
                const clientWidth = e.currentTarget.clientWidth
                const scrollWidth = e.currentTarget.scrollWidth

                document.getElementById('note-left-fade')!.style.left = `${scrollLeft}px`
                document.getElementById('note-right-fade')!.style.right = `${-scrollLeft}px`

                // Left fade effect show
                if (scrollLeft <= 10) {
                    document.getElementById('note-left-fade')!.style.display = 'none'
                } else {
                    document.getElementById('note-left-fade')!.style.display = 'block'
                }

                // Right fade effect show
                if (scrollLeft + clientWidth <= scrollWidth - 10) {
                    document.getElementById('note-right-fade')!.style.display = 'block'
                } else {
                    document.getElementById('note-right-fade')!.style.display = 'none'
                }
            }}
        >
            {/* Left and right fade effects */}
            <div
                id="note-left-fade"
                className={clsx([
                    'hidden',
                    'absolute', 'top-0', 'left-0', 'w-14', 'h-full', 'bg-gradient-to-r',
                    'from-white', 'cursor-pointer', 'dark:from-black'
                ])}
            ></div>
            <div
                id="note-right-fade"
                className={clsx([
                    'hidden',
                    'absolute', 'top-0', 'right-0', 'w-14', 'h-full', 'bg-gradient-to-l',
                    'from-white', 'cursor-pointer', 'dark:from-black'
                ])}
            ></div>
            {children}
        </section>
    )
}