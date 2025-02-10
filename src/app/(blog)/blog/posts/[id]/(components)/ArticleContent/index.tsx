'use client'

import MDEditor from "@uiw/react-md-editor"

export default function ArticleContent({ content } : { content: string | undefined }) {
    return (
        <MDEditor.Markdown
            source={content}
            style={{
                whiteSpace: 'normal',
                marginTop: '1rem',
                marginBottom: '1rem'
            }}
        />
    )
}