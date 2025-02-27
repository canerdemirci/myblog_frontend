import clsx from "clsx"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

interface Props {
    tags: Tag[]
    selectedTagId: string
    onClick: (tagId: string) => void
}

export default function TagButtonsSection({ tags, selectedTagId, onClick }: Props) {
    let scrollInterval: NodeJS.Timeout

    const startScrolling = (direction: 'left' | 'right') => {
        const tagButtonsSection = document.getElementById("tag-button-section")
        if (!tagButtonsSection) return

        scrollInterval = setInterval(() => {
            tagButtonsSection.scrollBy({
                left: direction === 'left' ? -10 : 10,
                behavior: 'smooth'
            })
        }, 50)
    }

    const stopScrolling = () => {
        clearInterval(scrollInterval)
    }

    if (tags.length > 0) return (
        <div
            id="tag-button-section"
            className={clsx([
                'flex', 'sticky', 'top-0', 'items-center', 'gap-4', 'select-none',
                'overflow-x-auto', 'bg-gray-50', 'no-scrollbar', 'my-8', 'mx-4',
                // dark
                'dark:bg-black'
            ])}
            onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft
                const clientWidth = e.currentTarget.clientWidth
                const scrollWidth = e.currentTarget.scrollWidth

                document.getElementById('left-fade')!.style.left = `${scrollLeft}px`
                document.getElementById('right-fade')!.style.right = `${-scrollLeft}px`
                document.getElementById('tag-prevbtn')!.style.left = `${scrollLeft + 5}px`
                document.getElementById('tag-nextbtn')!.style.right = `${-scrollLeft + 5}px`

                // Left fade effect show
                if (scrollLeft <= 10) {
                    document.getElementById('left-fade')!.style.display = 'none'
                } else {
                    document.getElementById('left-fade')!.style.display = 'block'
                }

                // Right fade effect show
                if (scrollLeft + clientWidth <= scrollWidth - 10) {
                    document.getElementById('right-fade')!.style.display = 'block'
                } else {
                    document.getElementById('right-fade')!.style.display = 'none'
                }

                // Prev button show
                if (scrollLeft >= 10 && clientWidth >= 640) {
                    document.getElementById('tag-prevbtn')!.style.display = 'block'
                } else {
                    document.getElementById('tag-prevbtn')!.style.display = 'none'
                }

                // Next button show
                if (scrollLeft + clientWidth <= scrollWidth - 10 && clientWidth >= 640) {
                    document.getElementById('tag-nextbtn')!.style.display = 'block'
                } else {
                    document.getElementById('tag-nextbtn')!.style.display = 'none'
                }
            }}
        >
            {/* Left and right fade effects */}
            <div
                id="left-fade"
                className={clsx([
                    'hidden', 'absolute', 'top-0', 'left-0', 'w-14', 'h-full',
                    'bg-gradient-to-r', 'from-white', 'cursor-pointer',
                    // sm
                    'sm:left-[50px]',
                    // dark
                    'dark:from-black'
                ])}
                onClick={() => onClick('0')}></div>
            <div
                id="right-fade"
                className={clsx([
                    'absolute', 'top-0', 'right-0', 'w-14', 'h-full', 'bg-gradient-to-l',
                    'from-white', 'cursor-pointer', 'dark:from-black'
                ])}
                onClick={() => onClick(tags[tags.length-1].id)}></div>
            {/* Left scroll button */}
            <div
                id="tag-prevbtn"
                className={clsx([
                    'hidden', 'absolute', 'top-[10%]', 'left-0',
                    'bg-gray-300', 'rounded-full', 'cursor-pointer', 'p-2',
                    'hover:bg-gray-400'
                ])}
                onMouseDown={() => startScrolling('left')}
                onMouseUp={stopScrolling}
                onMouseLeave={stopScrolling}
            ><FaAngleLeft /></div>
            {/* Right scroll button */}
            <div
                id="tag-nextbtn"
                className={clsx([
                    'hidden', 'absolute', 'top-[10%]', 'right-0', 'bg-gray-300',
                    'rounded-full', 'cursor-pointer', 'p-2',
                    'hover:bg-gray-400',
                    // sm
                    'sm:block'
                ])}
                onMouseDown={() => startScrolling('right')}
                onMouseUp={stopScrolling}
                onMouseLeave={stopScrolling}
            ><FaAngleRight /></div>
            {/* Tag buttons */}
            {tags.map(t => (
                <button
                    key={t.id}
                    className={clsx([
                        'p-2', 'flex-shrink-0', 'rounded-md', 'cursor-pointer', 'font-bold', 
                        selectedTagId === t.id
                            ? ['bg-red-500', 'text-white']
                            : [
                                'bg-gray-200', 'text-gray-600',
                                // hover
                                'hover:bg-gray-400', 'hover:text-gray-800',
                                // dark
                                'dark:bg-gray-800', 'dark:text-gray-100',
                                // dark-hover
                                'dark:hover:bg-gray-700', 'dark:hover:text-green-300'
                            ]
                    ])}
                    onClick={() => onClick(t.id)}
                >
                    {t.name}
                </button>
            ))}
        </div>
    )
}