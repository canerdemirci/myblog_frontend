'use client'
 
import clsx from 'clsx'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <main className={clsx([
        "flex", "h-full", "flex-col", "items-center", "justify-center", "mt-8"
    ])}>
      <h2 className={clsx(["text-center"])}>Bir hata oluştu!</h2>
      <button
        className={clsx([
            "mt-4", "rounded-md", "bg-blue-500", "px-4", "py-2", "text-sm",
            "text-white", "transition-colors", "hover:bg-blue-400"
        ])}
        onClick={
          () => reset()
        }
      >
        Tekrar Deneyin
      </button>
    </main>
  )
}