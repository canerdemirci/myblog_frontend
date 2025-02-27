/**
 * This component is heart of the article page. It renders the content of the article.
 * It uses the MDEditor.Markdown component to render the markdown content.
 */

'use client'

import MDEditor from "@uiw/react-md-editor"

export default function ArticleContent({ content } : { content: string | undefined }) {
    return (
        <MDEditor.Markdown
            source={content}
            style={{
                whiteSpace: 'normal',
                overflowX: 'auto',
                marginTop: '1rem',
                marginBottom: '4rem'
            }}
        />
    )
}