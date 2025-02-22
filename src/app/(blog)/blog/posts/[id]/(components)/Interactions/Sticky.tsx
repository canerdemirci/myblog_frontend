'use client'

import clsx from "clsx"
import { useEffect, useRef } from "react"

export default function Sticky({ children } : { children: React.ReactNode }) {
    const elementRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        const scrollEvent = () => {
            if (elementRef.current) {
                const scrollY = window.scrollY
                const vh = window.innerHeight
                const offsetTop = elementRef.current.getBoundingClientRect().top + scrollY

                console.log(scrollY, vh, offsetTop)

                if (scrollY < 250 || scrollY + vh >= offsetTop) {
                    elementRef.current.style.position = 'static'
                } else {
                    elementRef.current.style.position = 'fixed'
                    elementRef.current.style.bottom = '25px'
                    elementRef.current.style.left = '0px'
                    elementRef.current.style.right = '0px'
                }
            }
        }

        window.addEventListener('scroll', scrollEvent)
        
        return () => {
            window.removeEventListener('scroll', scrollEvent)
        }
    }, [])
    
    return (
        <div className="z-40" ref={elementRef}>{children}</div>
    )
}