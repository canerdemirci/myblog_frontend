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