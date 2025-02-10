'use client'

import clsx from "clsx"

interface Props {
    caption: string
    num: number
    icon: React.ReactNode
}

export default function NumberCard({ caption, num, icon } : Props) {
    return (
        <div className={clsx([
            'rounded-md', 'drop-shadow-md', 'border', 'border-gray-300', 'p-4', 'flex',
            'flex-col', 'justify-center', 'items-center', 'gap-4', 'bg-white'
        ])}>
            {icon}
            <h3 className={clsx([
                'text-2xl', 'font-bold', 'text-gray-600', 'text-center'
            ])}>{caption}</h3>
            <p className={clsx([
                'text-gray-600', 'text-2xl', 'text-center'
            ])}>{num}</p>
        </div>
    )
}