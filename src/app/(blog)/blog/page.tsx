'use client'

import { useState, useEffect } from 'react'
import {
  addGuestNoteInteraction,
  addUserNoteInteraction,
  isGuestLikedNote,
  isUserLikedNote,
} from '@/blog_api/note_interaction_repo'
import { getNote, getNotes } from '@/blog_api/note_repo'
import { getPosts } from '@/blog_api/post_repo'
import PostCard from './(components)/PostCard'
import { routeMap } from '@/app/(admin)/routeMap'
import Link from 'next/link'
import Notes from './(components)/Notes'
import NoteModal from './(components)/NoteModal'
import StaggeredContent from '@/app/(components)/StaggeredContent'
import { guestId } from '@/lib/sharedFunctions'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  
  const [posts, setPosts] = useState<Post[]>([])
  const [postsIsLoading, setPostsIsLoading] = useState<boolean>(true)
  const [postsError, setPostsError] = useState<Error | null>(null)

  const [notes, setNotes] = useState<Note[]>([])
  const [notesError, setNotesError] = useState<Error | null>(null)
  const [notesLoading, setNotesLoading] = useState<boolean>(true)

  const [openedNote, setOpenedNote] =
    useState<Note & { isLiked: boolean } | undefined>(undefined)
  const [showNote, setShowNote] = useState<boolean>(false)

  useEffect(() => {
    getNotes()
      .then(n => setNotes(n))
      .catch(e => setNotesError(e))
      .finally(() => setNotesLoading(false))

    getPosts()
      .then(p => setPosts(p))
      .catch(e => setPostsError(e))
      .finally(() => setPostsIsLoading(false))
  }, [])

  function handleNoteToggle() {
    setShowNote(prev => !prev)
  }

  function NotesSection() {
    return (
      <StaggeredContent
        loading={{
          status: notesLoading,
          content: (<h2>Notlar yükleniyor...</h2>)
        }}
        error={{
          status: notesError !== null,
          content: (<h2>Sunucu hatası! Lütfen daha sonra tekrar deneyiniz.</h2>)
        }}
        content={{
          content: (
            <Notes
              notes={notes}
              onOpen={async (note) => {
                const opNote = await getNote(note.id)

                handleNoteToggle()

                if (!session) {
                  const guestLiked = await isGuestLikedNote(note.id, guestId())

                  setOpenedNote({
                    ...opNote,
                    isLiked: guestLiked,
                  })

                  addGuestNoteInteraction({
                    type: 'VIEW',
                    noteId: note.id,
                    guestId: guestId()
                  })
                }

                if (session && session.user?.id) {
                  const userLiked = await isUserLikedNote(note.id, session.user.id)
                  
                  setOpenedNote({
                    ...opNote,
                    isLiked: userLiked,
                  })
                  
                  addUserNoteInteraction({
                    type: 'VIEW',
                    noteId: note.id,
                    userId: session.user.id
                  })
                }
              }}
            />
          )
        }}
      />
    )
  }

  function PostsSection() {
    return (
      <StaggeredContent
        loading={{
          status: postsIsLoading,
          content: (<h2>Makaleler yükleniyor...</h2>),
        }}
        error={{
          status: postsError !== null,
          content: (<h2>Sunucu hatası! Lütfen daha sonra tekrar deneyiniz.</h2>),
        }}
        content={{
          empty: posts.length === 0,
          emptyContent: (<h2>Sistemde gösterilecek makale yok.</h2>),
          content: (
            <div className='md:columns-2 md:m-4 lg:columns-3 gap-8'>
              {posts.map(p => (
                <Link key={p.id} href={routeMap.blog.posts.postById(p.id)} className='break-inside-avoid break-after-avoid-page inline-block w-full'>
                  <PostCard
                    title={p.title}
                    cover={p.cover}
                    date={`${p.updatedAt}`}
                    commentCount={1}
                    likeCount={p.likeCount}
                    readCount={p.viewCount}
                    shareCount={p.shareCount}
                    tags={p.tags?.map(t => t.name)}
                  />
                </Link>
              )
              )}
            </div>
          )
        }}
      />
    )
  }

  return (
    <div>
      {
        (showNote && openedNote !== undefined)
        &&
        <NoteModal
          user={session?.user}
          note={openedNote}
          isLiked={openedNote.isLiked}
          onClose={() => {
            handleNoteToggle()
            setOpenedNote(undefined)
          }}
        />
      }
      {NotesSection()}
      {PostsSection()}
    </div>
  );
}
