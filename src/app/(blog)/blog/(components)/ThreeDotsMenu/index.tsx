import { HiDotsVertical } from "react-icons/hi"
import { clsx } from "clsx"
import { useState } from "react"

interface Props {
    items: {
        caption: string
        disabled?: boolean
        onClick: () => void
    }[]
}

export default function ThreeDotsMenu({ items } : Props) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    function onClickDocument() {
        setMenuOpen(false)
        document.removeEventListener('click', onClickDocument)
    }
    
    return (
        <div
            className={clsx([
                'relative', 'cursor-pointer', 'p-2', 'ml-2',
                'hover:bg-gray-200', 'hover:rounded-full',
                'dark:hover:bg-gray-700'
            ])}
            onClick={() => {
                setMenuOpen(prev => !prev)
                
                if (!menuOpen) {
                    document.addEventListener('click', onClickDocument)
                }
            }}
        >
            <HiDotsVertical
                size={20}
                className={clsx('dark:text-gray-200')}
            />
            <div className={clsx([
                menuOpen ? 'block' : 'hidden',
                'cursor-pointer', 'absolute', 'top-10', 'right-0', 'rounded-md',
                'border', 'border-gray-300', 'z-50', 'bg-white', 'drop-shadow-md'
            ])}>
                {items.map((i, index) => (
                    <div
                        key={index}
                        className={clsx([
                            i.disabled ? 'text-gray-200' : 'text-gray-700',
                            'p-2', 'rounded-md', 'hover:bg-gray-200', 'text-sm'
                        ])}
                        onClick={i.disabled ? undefined : () => {
                            i.onClick()
                            setMenuOpen(false)
                        }}
                    >
                        {i.caption}
                    </div>
                ))}
            </div>
        </div>
    )
}