import clsx from "clsx"
import { BsDatabaseFillSlash } from "react-icons/bs"

interface Props {
    iconSize?: number
    text: string
}

export default function NoData({ iconSize, text } : Props) {
    return (
        <div
            className={clsx([
                "flex", "flex-col", "justify-center", "items-center", "gap-2",
                "dark:text-gray-100"
            ])}
        >
            <BsDatabaseFillSlash
                size={iconSize ?? 36}
                className={clsx(['dark:text-gray-100', 'animate-pulse'])}
            />
            <p>{text}</p>
        </div>
    )
}