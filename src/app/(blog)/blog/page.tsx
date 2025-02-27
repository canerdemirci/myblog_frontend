/**
 * @module Blog Page
 * @description Blog main page
 */
import NotesSection from './(components)/NotesSection'
import PostsSection from './(components)/PostsSection'
import UpButton from './(components)/UpButton'

export default async function Home() {
  return (
    <>
      <UpButton />
      <main>
        <NotesSection />
        <PostsSection />
      </main>
    </>
  )
}