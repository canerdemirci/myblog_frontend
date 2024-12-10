'use client'

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import rehypeSanitize from "rehype-sanitize"

import { routeMap } from "@/app/(admin)/routeMap"
import { ApiError, createNote } from "@/blog_api"
import { createNoteJoiSchema } from "@/utils"

// My components
import Header from "../../(components)/Header"
import UIBreadcrumbs from "../../(components)/UIBreadcrumbs"
import AlertModal from "../../(components)/AlertModal"

// 3 party components
import MDEditor from "@uiw/react-md-editor"

// Material components
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Backdrop from "@mui/material/Backdrop"

export default function CreateNotePage() {
    const router = useRouter()

    // For creating note
    const [content, setContent] = useState<string>('# Note İçeriği')
    const [noteSavingEnd, setNoteSavingEnd] = useState<boolean>(true)
    const [noteSavingError, setNoteSavingError] = useState<ApiError | null>(null)
    const [noteValidationErrors, setNoteValidationErrors] = useState<string[] | null>(null)

    // This effect used for system doesn't let the user leave from the page and lost changes.
    useEffect(() => {
        function beforeUnload(e: any) {
            e.preventDefault()
        }

        window.addEventListener('beforeunload', beforeUnload)
        window.addEventListener('close', beforeUnload)

        return () => {
            window.removeEventListener('beforeunload', beforeUnload)
            window.removeEventListener('close', beforeUnload)
        }
    }, [])

    // Post creation form submit event
    async function handleSaveButton(e: any) {
        e.preventDefault()

        const validation = createNoteJoiSchema.validate({ content: content })

        if (validation.error) {
            setNoteValidationErrors(validation.error.details.map(e => e.message + "\n"))
        } else {
            setNoteSavingEnd(false)
            setNoteValidationErrors(null)

            createNote({
                content: content,
            })
                .then(_ => router.push(routeMap.admin.notes.root))
                .catch(e => setNoteSavingError(e))
                .finally(() => setNoteSavingEnd(true))
        }
    }

    return (
        <Box>
            {/* Alert modal for note creation error */}
            <AlertModal
                open={noteSavingError !== null}
                title="Uyarı"
                contentText=
                "Sistem hatası oluştu! Girilen bilgileri kontrol edip tekrar deneyebilirsiniz."
                onClose={() => setNoteSavingError(null)}
            />
            {/* Alert modal for note validation error */}
            <AlertModal
                open={noteValidationErrors !== null}
                title="Uyarı"
                contentText={`${noteValidationErrors}`}
                onClose={() => setNoteValidationErrors(null)}
            />
            {/* Backdrop for post creation process */}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={!noteSavingEnd}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Header />
            <UIBreadcrumbs
                pageName='Yeni Not Oluştur' />
            {<Container maxWidth="lg">
                <Paper elevation={6} sx={{ padding: "1rem", margin: "2rem 0 2rem 0" }}>
                    <form className="w-full flex flex-col gap-8">
                        <Typography variant="h4">
                            Yeni Not Oluştur
                        </Typography>
                        {/* Note content input */}
                        <MDEditor
                            value={content}
                            data-color-mode="light"
                            height={800}
                            onChange={(value) => setContent(value ?? '')}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]],
                            }}
                        />
                        <Button type="submit" color="success"
                            variant="contained" onClick={handleSaveButton}>KAYDET</Button>
                    </form>
                </Paper>
            </Container>}
        </Box>
    )
}