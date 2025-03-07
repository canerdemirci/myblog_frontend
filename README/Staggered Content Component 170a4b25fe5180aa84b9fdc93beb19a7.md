# Staggered Content Component

I'm using this versatile component to display my page's content under various conditions such as loading, error, content not found, empty content, and the main content.

## Component code

```tsx
/**
 * This component is used to display content in a staggered manner.
 * It handles loading, error, not found and empty states.
 */
interface Props {
    loading: {
        status: boolean,
        content: React.ReactNode
    },
    error: {
        status: boolean,
        content: React.ReactNode
    },
    content: {
        empty?: boolean,
        emptyContent?: React.ReactNode
        notFound?: boolean,
        notFoundContent?: React.ReactNode,
        content: React.ReactNode,
    },
}

export default function StaggeredContent({loading, error, content} : Props) {
    if (loading.status === true && error.status === false) {
        return loading.content
    }

    if (error.status === true && loading.status === false) {
        return error.content
    }

    if (content.notFound) {
        return content.notFoundContent
    } else if (content.empty) {
        return content.emptyContent
    } else {
        return content.content
    }
}
```

## Example Using

```tsx
<StaggeredContent
  loading={{
    status: notesLoading,
    content: <UISkeleton format={1} />,
  }}
  error={{
    status: notesFetchError !== null,
    content: <ErrorElement />,
  }}
  content={{
    empty: notes.length === 0,
    emptyContent: <NoData />,
    content: NotesTable(),
  }}
/>;
```