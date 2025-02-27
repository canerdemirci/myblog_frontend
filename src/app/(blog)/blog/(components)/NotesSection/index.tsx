import { getNotes } from "@/blog_api_actions/note_repo"
import NoteCard from "../NoteCard"
import Slider from "./Slider"
import clsx from "clsx"
import { Suspense } from "react"

function Skeleton() {
  return (
    <section className={clsx([
      'flex', 'gap-4', 'm-4', 'my-8', 'overflow-x-auto'
    ])}>
      {new Array(30).fill('x', 0, 29).map((_, i) => (
        <div key={i} className={clsx([
          'bg-gray-300', 'rounded-md', 'w-40', 'h-48', 'flex', 'shrink-0',
          'flex-col', 'justify-center', 'items-center', 'gap-8', 'animate-pulse'
        ])}>
          <div className={clsx(['rounded-full', 'bg-gray-100', 'w-20', 'h-20'])}></div>
          <div className={clsx(['w-3/4', 'h-2', 'bg-gray-100', 'rounded-md'])}></div>
        </div>
      ))}
    </section>
  )
}

/**
 * This component fetches notes from the API and renders them in a slider.
 * If there is an error while fetching notes, it shows an error message.
 */
async function Notes() {
  try {
    const notes = await getNotes(50)

    return (
      <Slider>
        {/* Note Cards */}
        {notes.map(n => (<NoteCard key={n.id} note={n} />))}
      </Slider>
    )
  } catch (error: any) {
    return (
      <section
        className={clsx([
          'text-red-500', 'font-bold', 'text-xl', 'text-center', 'm-8'
        ])}
      >
        Notlar yüklenirken bir hata oluştu.
      </section>
    )
  }
}

export default async function NotesSection() {
  return (
    <Suspense fallback={Skeleton()}>
      <Notes />
    </Suspense>
  )
}