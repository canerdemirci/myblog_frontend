import NotesSection from './(components)/NotesSection'
import PostsSection from './(components)/PostsSection'

export default async function Home() {
  return (
    <main>
      <NotesSection />
      <PostsSection />
    </main>
  )
}