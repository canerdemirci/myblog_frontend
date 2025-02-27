import clsx from "clsx"
import Image from "next/image"

export default function NotFound({ text } : { text: string }) {
    return (
        <div>
            <Image
                src={'/images/not-found.svg'}
                alt="Not found"
                width={500}
                height={300}
                className={clsx([
                    'm-auto', 'mt-8', 'w-[400px]', 'h-[175px]',
                    // xs
                    'xs:w-[500px]', 'xs:h-[300px]'
                ])}
                unoptimized
            />
            <p
                className={clsx([
                    'text-center', 'text-2xl', 'mb-16', 'dark:text-gray-100',
                    'xs:text-4xl'
                ])}
            >
                {text}
            </p>
        </div>
    )
}