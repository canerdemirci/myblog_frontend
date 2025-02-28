import { clsx } from 'clsx'

interface Props {
    children: Readonly<React.ReactNode>
    onClose: () => void
}

export default function Modal({ children, onClose } : Props) {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                onClose()
            }}
            className={clsx([
                "w-screen", "h-screen", "fixed", "top-0", "left-0", "z-50", "backdrop-blur-md"
            ])}
        >
            {children}
        </div>
    )
}