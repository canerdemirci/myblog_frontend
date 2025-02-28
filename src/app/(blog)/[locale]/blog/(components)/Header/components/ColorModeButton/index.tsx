'use client'

import useDarkMode from '@/hooks/useDarkMode'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { clsx } from 'clsx'

export default function ColorModeButton() {
    const [isDarkMode, toggleDarkMode] = useDarkMode()

    return (
        <>
            {
                isDarkMode
                    ? <MdLightMode
                        size={36}
                        className={clsx([
                            'cursor-pointer', 'text-yellow-500', 'hover:text-gray-600'
                        ])}
                        onClick={toggleDarkMode}
                    />
                    : <MdDarkMode
                        size={36}
                        className={clsx([
                            'cursor-pointer', 'text-gray-600', 'hover:text-black'
                        ])}
                        onClick={toggleDarkMode}
                    />
            }
        </>
    )
}