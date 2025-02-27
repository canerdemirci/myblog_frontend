import clsx from "clsx"

export default function PostsSkeleton() {
    return (
        <section className={clsx([
            'md:grid', 'md:grid-cols-2', 'md:gap-8', 'lg:grid-cols-3', '2xl:grid-cols-4'
        ])}>
            {new Array(10).fill('x', 0, 9).map((_, i) => (
                <div key={i}>
                    <div className={clsx([
                        'bg-gray-300', 'h-80', 'rounded-xl', 'flex', 'shrink-0', 'flex-col',
                        'justify-center', 'items-center', 'gap-8', 'animate-pulse',
                        // 320 - 768
                        'min-[320px]:w-full max-[768px]:w-full',
                        'min-[320px]:m-0 max-[768px]:m-0',
                        'min-[320px]:mb-8 max-[768px]:mb-8',
                    ])}>
                        <div className={clsx([
                            'rounded-xl', 'bg-gray-200', 'w-[90%]', 'h-[40%]', 'mb-4'
                        ])}></div>
                        <div className={clsx([
                            'w-3/4', 'h-2', 'bg-gray-100', 'rounded-md'
                        ])}></div>
                        <div className={clsx([
                            'w-3/4', 'h-2', 'bg-gray-100', 'rounded-md'
                        ])}></div>
                        <div className={clsx([
                            'w-3/4', 'h-2', 'bg-gray-100', 'rounded-md'
                        ])}></div>
                    </div>
                </div>
            ))}
        </section>
    )
}