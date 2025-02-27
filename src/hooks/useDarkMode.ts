/*
 * If there's a localstorage record use that mode
 * Else use device's mode
 * If user switches the mode then set it to localstorage and use it
*/

import { useState, useEffect } from 'react'

export default function darkMode() {
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)

    useEffect(() => {
        // System mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        // Mode from local storage
        const modeFromLocal = localStorage.getItem('dark-mode')

        function handleChange(event: MediaQueryListEvent) {
            setIsDarkMode(event.matches)
        }

        if (modeFromLocal === null) {
            setIsDarkMode(mediaQuery.matches)
        } else {
            setIsDarkMode(modeFromLocal === 'true')
        }

        mediaQuery.addEventListener('change', handleChange)

        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    useEffect(() => {
        if (isDarkMode !== null) {
            localStorage.setItem('dark-mode', isDarkMode.toString())
            document.documentElement.classList.toggle('dark', isDarkMode)
            // For MdEditor
            document.documentElement.setAttribute('data-color-mode', isDarkMode ? 'dark' : 'light')
        }
    }, [isDarkMode])

    function toggleDarkMode() {
        setIsDarkMode(prev => !prev)
    }

    return [isDarkMode, toggleDarkMode] as const
}