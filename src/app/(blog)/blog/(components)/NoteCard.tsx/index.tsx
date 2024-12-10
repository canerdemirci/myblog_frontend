import { MdEventNote } from 'react-icons/md'
import { leagueSpartan } from '@/app/fonts'

interface Props {
    note: Note
    onClick: (note: Note) => void
}

export default function NoteCard({ note, onClick } : Props) {
    return (
        <div className="group flex flex-col justify-center items-center gap-4 border-4 border-gray-200 rounded-lg p-4 dark:border-gray-700 dark:hover:border-orange-400 hover:border-gray-700 cursor-pointer note-anim-cover" onClick={() => onClick(note)}>
            <div className="note-anim shadow-2xl md:w-36 md:h-36 rounded-full dark:group-hover:bg-orange-400 group-hover:bg-none group-hover:bg-gray-700 flex justify-center items-center min-[320px]:w-24 max-[768px]:w-24 min-[320px]:h-24 max-[768px]:h-24">
                <div className="md:w-[8.25rem] md:h-[8.25rem] bg-gray-100 dark:bg-gray-700 rounded-full flex flex-col items-center justify-center min-[320px]:w-[5.25rem] max-[768px]:w-[5.25rem] min-[320px]:h-[5.25rem] max-[768px]:h-[5.25rem]">
                    <MdEventNote size={52} className='text-gray-700 dark:text-gray-100' />
                </div>
            </div>
            <span className={`${leagueSpartan.className} text-2xl md:text-4xl text-gray-700 dark:text-gray-700 dark:group-hover:text-orange-400`}>{`${note.createdAt}`}</span>
        </div>
    )
}