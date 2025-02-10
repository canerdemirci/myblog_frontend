import clsx from "clsx"
import Image from "next/image"
import { BiSolidError } from "react-icons/bi"

interface Props {
    text: React.ReactNode
    iconSize?: number
}

export default function ErrorElement({ text, iconSize } : Props) {
    return (
        <div
            className={clsx([
                "flex", "flex-col", "justify-center", "items-center", "gap-2",
                "dark:text-gray-100"
            ])}
        >
            <BiSolidError
                size={iconSize ?? 36}
                className={clsx(['dark:text-gray-100', 'animate-pulse'])}
            />
            {text}
        </div>
    )
}