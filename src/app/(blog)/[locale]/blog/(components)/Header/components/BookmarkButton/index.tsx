'use client'

import BookmarksModal from '../../../BookmarksModal'
import { MdBookmark } from 'react-icons/md'
import { useState } from 'react'
import { clsx } from 'clsx'

export default function BookmarkButton() {
    const [open, setOpen] = useState<boolean>(false)

    function handleClose() {
        setOpen(false)
    }

    return (
        <div>
            <MdBookmark
                size={36}
                className={clsx(['cursor-pointer', 'text-red-500'])}
                onClick={() => setOpen(prev => !prev)}
            />
            {open && <BookmarksModal onClose={handleClose} />}
        </div>
    )
}