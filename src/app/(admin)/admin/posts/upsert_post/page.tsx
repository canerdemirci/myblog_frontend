'use client'

import { useEffect, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import Image from 'next/image'

import rehypeSanitize from "rehype-sanitize"

import { routeMap } from "@/app/(admin)/routeMap"
import { ApiError, createPost, deleteCover, getPost, getTags, updatePost, uploadCover } from "@/blog_api"
import { createPostJoiSchema } from "@/utils"

import styled from '@mui/material/styles/styled'

// My components
import Header from "../../(components)/Header"
import UIBreadcrumbs from "../../(components)/UIBreadcrumbs"
import AlertModal from "../../(components)/AlertModal"
import ErrorElement from "../../(components)/ErrorElement"
import CheckboxesTags from "../../(components)/CheckboxesTags"

// 3 party components
import MDEditor from "@uiw/react-md-editor"

// Material components
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Backdrop from "@mui/material/Backdrop"

// Material icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ImageIcon from "@mui/icons-material/Image"
import UISkeleton from "../../(components)/UISkeleton"

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type Mode = 'update' | 'insert'

export default function UpsertPostPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const mode: Mode = searchParams.get('id') !== null ? 'update' : 'insert'

    // For upserting post
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string | undefined>('# Makale İçeriği')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [postSavingEnd, setPostSavingEnd] = useState<boolean>(true)
    const [postSavingError, setPostSavingError] = useState<ApiError | null>(null)
    const [postValidationErrors, setPostValidationErrors] = useState<string[] | null>(null)

    // For fetching tags
    const [tags, setTags] = useState<Tag[]>([])
    const [tagError, setTagError] = useState<ApiError | null>(null)
    const [tagLoading, setTagLoading] = useState<boolean>(true)

    // For fetching post (upsert)
    const [postLoading, setPostLoading] = useState<boolean>(false)
    const [postError, setPostError] = useState<ApiError | null>(null)

    // For uploading cover image
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)
    const [uploadFormData, setUploadFormData] = useState<FormData | undefined>(undefined)

    const [originalCover, setOriginalCover] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (mode === 'update') {
            const postId = searchParams.get('id')
            setPostLoading(true)

            getPost(postId!)
                .then(p => {
                    setTitle(p.title)
                    setContent(p.content)
                    setSelectedTags(p.tags.map(t => t.name))
                    setOriginalCover(p.cover)
                })
                .catch(e => setPostError(e))
                .finally(() => setPostLoading(false))
        }

        getTags()
            .then(t => setTags(t))
            .catch(e => setTagError(e))
            .finally(() => setTagLoading(false))
    }, [])

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

        // This will be used for post's cover field
        let uploadRes: any = undefined

        try {
            if (uploadFormData) {
                uploadRes = await uploadCover(uploadFormData)
            }
        } catch (_) { } finally {
            const validation = createPostJoiSchema.validate({ title: title })

            if (validation.error) {
                setPostValidationErrors(validation.error.details.map(e => e.message + "\n"))
            } else {
                setPostSavingEnd(false)
                setPostValidationErrors(null)

                if (mode === 'insert') {
                    createPost({
                        title: title,
                        content: content,
                        cover: uploadRes,
                        tags: selectedTags
                    })
                        .then(_ => router.push(routeMap.admin.posts.root))
                        .catch(e => setPostSavingError(e))
                        .finally(() => setPostSavingEnd(true))
                } else {
                    updatePost({
                        id: searchParams.get('id')!,
                        title: title,
                        content: content,
                        cover: originalCover ?? uploadRes,
                        tags: selectedTags
                    })
                        .then(_ => {
                            if (originalCover && uploadRes) {
                                deleteCover(originalCover)
                            }

                            router.push(routeMap.admin.posts.root)
                        })
                        .catch(e => setPostSavingError(e))
                        .finally(() => setPostSavingEnd(true))
                }
            }
        }
    }

    function handleUploadCover(e: any) {
        const file = e.target.files[0]

        try {
            setSelectedImage(URL.createObjectURL(file))

            if (originalCover) {
                deleteCover(originalCover)
            }

            setOriginalCover(undefined)

            // This will be used for post's cover field when the creation process
            const formData = new FormData()
            formData.append('coverImage', file)
            setUploadFormData(formData)
        } catch (err) {
            setSelectedImage(undefined)
            setUploadFormData(undefined)
        }
    }

    return (
        <Box>
            {/* Alert modal for post fetching error for post update */}
            <AlertModal
                open={postError !== null}
                title="Uyarı"
                contentText=
                "Sistem hatası oluştu!"
                onClose={() => router.push(routeMap.admin.posts.root)}
            />
            {/* Alert modal for post creation error */}
            <AlertModal
                open={postSavingError !== null}
                title="Uyarı"
                contentText=
                "Sistem hatası oluştu! Girilen bilgileri kontrol edip tekrar deneyebilirsiniz."
                onClose={() => setPostSavingError(null)}
            />
            {/* Alert modal for post validation error */}
            <AlertModal
                open={postValidationErrors !== null}
                title="Uyarı"
                contentText={`${postValidationErrors}`}
                onClose={() => setPostValidationErrors(null)}
            />
            {/* Backdrop for post creation process */}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={!postSavingEnd}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Header />
            <UIBreadcrumbs
                pageName={`${mode === 'insert' ? 'Yeni Makale Oluştur' : 'Makaleyi Güncelle'}`} />
            {tagError !== null ? <Box sx={{ padding: '1rem' }}>
                <ErrorElement />
            </Box> : postLoading === true ? <UISkeleton format={3} /> : <Container maxWidth="lg">
                <Paper elevation={6} sx={{ padding: "1rem", margin: "2rem 0 2rem 0" }}>
                    <form className="w-full flex flex-col gap-8">
                        <Typography variant="h4">
                            {`${mode === 'insert' ? 'Yeni Makale Oluştur' : 'Makaleyi Güncelle'}`}
                        </Typography>
                        {/* Cover images select section */}
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid #eee",
                            borderRadius: "5px"
                        }}>
                            <Box className="w-[800px] h-[420px] flex items-center justify-center bg-slate-100 text-center relative">
                                {
                                    !selectedImage && !originalCover
                                        ? <Box>
                                            <ImageIcon fontSize="large" />
                                            <Typography variant="h6">KAPAK FOTOĞRAFI</Typography>
                                        </Box>
                                        : <Image
                                            src={
                                                selectedImage ??
                                                (originalCover ?
                                                    `http://localhost:8000/api/static/${originalCover}`
                                                    : '')
                                            }
                                            alt="Makale Kapağı"
                                            width={800}
                                            height={420}
                                            priority={true}
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                }
                            </Box>
                        </Box>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Kapak Fotoğrafı Yükle
                            <VisuallyHiddenInput
                                type="file"
                                name="coverImage"
                                alt="Makale kapak fotoğrafı seçin"
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                                onChange={handleUploadCover}
                            />
                        </Button>
                        <Typography variant="body1" color="warning">
                            * Jpeg, png, gif formatlarına izin verilir. 5 MB tan fazla dosya kabul edilmez. Boyut oranı: 40/21 (800x420, 1200x630 gibi)
                        </Typography>
                        {/* Post title input */}
                        <TextField
                            value={title}
                            label="Makale Başlığı"
                            onChange={(e) => setTitle(e.target.value)}
                            error={title.trim() === ''}
                            fullWidth
                        />
                        {/* Post content input */}
                        <MDEditor
                            value={content}
                            data-color-mode="light"
                            height={800}
                            onChange={(value) => setContent(value)}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]],
                            }}
                        />
                        {/* Post tags select */}
                        <CheckboxesTags
                            defaultValue={mode === 'update' ? selectedTags : undefined}
                            tagOptions={tags.map(t => t.name)}
                            onChange={(value) => setSelectedTags(value)}
                            disabled={tagLoading}
                        />
                        <Button type="submit" color="success"
                            variant="contained" onClick={handleSaveButton}>KAYDET</Button>
                    </form>
                </Paper>
            </Container>}
        </Box>
    )
}