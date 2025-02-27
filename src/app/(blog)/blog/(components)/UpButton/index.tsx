'use client'

import clsx from "clsx"
import { useEffect, useState } from "react"
import { FaAngleUp } from "react-icons/fa"

export default function UpButton() {
    const [show, setShow] = useState<boolean>(false)
    
    useEffect(() => {
        const scrollEvent = () => {
            const scrollY = window.scrollY
            const viewportHeight = window.innerHeight
            
            if (scrollY > viewportHeight) {
                setShow(true)
            } else {
                setShow(false)
            }
        }

        window.addEventListener('scroll', scrollEvent)

        return () => {
            window.removeEventListener('scroll', scrollEvent)
        }
    }, [])
    
    return (
        <>
            {show && <div
                className={clsx([
                    'z-50', 'rounded-full', 'fixed', 'cursor-pointer', 'shadow-md', 'border',
                    'border-gray-400', 'p-4', 'bottom-4', 'right-4', 'bg-gray-300',
                    // sm
                    'sm:bottom-6', 'sm:right-6',
                    // hover
                    'hover:bg-gray-400', 'dark:hover:bg-gray-300',
                    // dark
                    'dark:border-gray-600', 'dark:bg-gray-200',
                ])}
                onClick={() => window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })}
            >
                <FaAngleUp className={clsx(['text-2xl', 'sm:text-3xl'])} />
            </div>}
        </>
    )
}