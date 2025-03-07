# Dark Mode Implementation

```tsx
 * If there's a localstorage record use that mode
 * Else use device's mode
 * If user switches the mode then set it to localstorage and use it
```

1. **Custom Hook:**  /src/hooks/useDarkMode.ts
2. **Tailwind**
    1. In tailwind.config.ts added this line: darkMode: 'selector'
    2. Tailwind classes start **dark:** for dark mode
3. **For MDEditor**
    1. Added:
    
    ```jsx
    document.documentElement.setAttribute('data-color-mode', isDarkMode ? 'dark' : 'light')
    ```
    
4. **Local Storage**
    1. For ensuring user preference persistance
    
    ```jsx
    localStorage.setItem('dark-mode', isDarkMode.toString())
    ```
    
5. **ColorModeButton Component**

It uses the useDarkMode hook.

```jsx
'use client'

import useDarkMode from '@/hooks/useDarkMode'
import { MdLightMode, MdDarkMode } from 'react-icons/md'

export default function ColorModeButton() {
    const [isDarkMode, toggleDarkMode] = useDarkMode()

    return (
        <>
            {
                isDarkMode
                    ? <MdLightMode
                        size={36}
                        className='cursor-pointer hover:opacity-60'
                        onClick={toggleDarkMode}
                    />
                    : <MdDarkMode
                        size={36}
                        className='cursor-pointer hover:opacity-60'
                        onClick={toggleDarkMode}
                    />
            }
        </>
    )
}
```