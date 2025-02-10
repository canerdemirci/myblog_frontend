'use client'

import SearchModal from '../../../SearchModal'
import { MdOutlineSearch } from 'react-icons/md'
import { useState } from 'react'
import { clsx } from 'clsx'

export default function SearchButton() {
    const [open, setOpen] = useState<boolean>(false)

    function handleClose() {
        setOpen(false)
    }

    return (
        <div>
            <MdOutlineSearch
                size={36}
                className={clsx(['dark:text-white', 'cursor-pointer', 'hover:text-gray-600'])}
                onClick={() => setOpen(true)}
            />
            {open && <SearchModal onClose={handleClose} />}
        </div>
    )
}