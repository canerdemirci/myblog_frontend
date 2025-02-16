'use client'

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { clsx } from "clsx"

import rehypeSanitize from "rehype-sanitize"

import { routeMap } from "@/utils/routeMap"
import { createNote } from "@/blog_api_actions/note_repo"
import { createNoteJoiSchema } from "@/utils"
import { getAdminToken } from "@/lib/sharedFunctions"
import { ApiError } from "@/lib/custom_fetch"

// My components
import AlertModal from "../../(components)/AlertModal"
import AdminPanelPage from "../../(components)/AdminPanelPage"

// 3 party components
import MDEditor from "@uiw/react-md-editor"

// Material components
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Backdrop from "@mui/material/Backdrop"
import ImageUploader from "../../(components)/ImageUploader"
import { deleteNoteImage, uploadNoteImages } from "@/blog_api_actions"

export default function CreateNotePage() {
    const router = useRouter()

    // For creating note
    const [content, setContent] = useState<string>('# Note İçeriği')
    const [noteImages, setNoteImages] = useState<string[]>([])
    const [noteContentImageUplading, setNoteContentImageUplading] = useState<boolean>(false)
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

    async function handleSaveButton(e: any) {
        e.preventDefault()

        const validation = createNoteJoiSchema.validate({ content: content, images: noteImages })

        if (validation.error) {
            setNoteValidationErrors(validation.error.details.map(e => e.message + "\n"))
        } else {
            setNoteSavingEnd(false)
            setNoteValidationErrors(null)

            createNote({
                content: content,
                images: noteImages,
            }, getAdminToken())
                .then(_ => router.push(routeMap.admin.notes.root))
                .catch(e => setNoteSavingError(e))
                .finally(() => setNoteSavingEnd(true))
        }
    }

    function handleUploadNoteImage(e: any) {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('noteImages', file)

        setNoteContentImageUplading(true)

        uploadNoteImages(formData)
            .then(res => setNoteImages([...noteImages, res]))
            .catch(e => alert('Bir hata oluştu.'))
            .finally(() => setNoteContentImageUplading(false))
    }

    function handleRemoveImage(fileName: string) {
        setNoteContentImageUplading(true)
        deleteNoteImage(fileName)
            .then(() => setNoteImages(noteImages.filter(pi => pi !== fileName)))
            .catch(e => alert('Bir hata oluştu.'))
            .finally(() => setNoteContentImageUplading(false))
    }

    function NoteForm() {
        return (
            <Paper
                elevation={6}
                sx={{ padding: "1rem", margin: "2rem auto", width: "90%" }}
            >
                <form
                    className={clsx(["w-full", "flex", "flex-col", "gap-8"])}
                >
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
                    {/* Note images upload section */}
                    <ImageUploader
                        title="Not için resimler yükleyin"
                        subFolder="images_of_notes"
                        images={noteImages}
                        handleRemoveImage={handleRemoveImage}
                        handleUploadImage={handleUploadNoteImage}
                    />
                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                        onClick={handleSaveButton}
                    >
                        KAYDET
                    </Button>
                </form>
            </Paper>
        )
    }

    return (
        <AdminPanelPage pageName="Yeni Not Yaz">
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
            {/* Backdrop for note creation process */}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={!noteSavingEnd}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Backdrop for note content images uploading process */}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={noteContentImageUplading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {NoteForm()}
        </AdminPanelPage>
    )
}