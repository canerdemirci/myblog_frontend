interface Props {
    children: Readonly<React.ReactNode>
    onClose: () => void
}

export default function Modal({ children, onClose } : Props) {
    return (
        <div
            onClick={(e) => {
                onClose()
            }}
            className="w-screen h-screen fixed top-0 left-0 z-50 backdrop-blur-sm">
            {children}
        </div>
    )
}