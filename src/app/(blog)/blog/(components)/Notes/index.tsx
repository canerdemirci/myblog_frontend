import NoteCard from '../NoteCard.tsx'

interface Props {
    notes: Note[]
    onOpen: (note: Note) => void
}

export default function Notes({ notes, onOpen } : Props) {
    return (
        <div className="w-full p-4 my-4 overflow-x-auto flex items-center gap-8">
            {notes.map(n => (<NoteCard key={n.id} note={n} onClick={(note) => onOpen(note)} />))}
        </div>
    )
}