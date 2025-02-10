import clsx from "clsx"
import Image from "next/image"
import { FaDownload } from "react-icons/fa"

interface Props {
    iconSize?: number
    text: string
}

export default function Loading({ iconSize, text } : Props) {
    return (
        <div
            className={clsx([
                "flex", "flex-col", "justify-center", "items-center", "gap-2",
                "dark:text-gray-100"
            ])}
        >
            <FaDownload
                size={iconSize ?? 36}
                className={clsx(['animate-bounce', 'dark:text-gray-100'])}
            />
            <p>{text}</p>
        </div>
    )
}