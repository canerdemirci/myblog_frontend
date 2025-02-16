'use client'

import { Suspense, useEffect, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { clsx } from "clsx"

import Image from 'next/image'

import rehypeSanitize from "rehype-sanitize"
import { getAdminToken } from "@/lib/sharedFunctions"

import { routeMap } from "@/utils/routeMap"
import { uploadCover, deleteCover, uploadPostImages, deletePostImage } from "@/blog_api_actions"
import { createPost, getPost, updatePost } from "@/blog_api_actions/post_repo"
import { getTags } from "@/blog_api_actions/tag_repo"
import { suggest } from "@/blog_api_actions/gemini_repo"
import { createPostJoiSchema } from "@/utils"
import { ApiError } from "@/lib/custom_fetch"

import styled from '@mui/material/styles/styled'

// My components
import AlertModal from "../../(components)/AlertModal"
import ErrorElement from "../../(components)/ErrorElement"
import UISkeleton from "../../(components)/UISkeleton"
import TagSelector from "../../(components)/TagSelector"
import AdminPanelPage from "../../(components)/AdminPanelPage"
import ImageUploader from "../../(components)/ImageUploader"
import SuggestionModal from "./SuggestionModal"

// 3 party components
import MDEditor from "@uiw/react-md-editor"

// Material components
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Backdrop from "@mui/material/Backdrop"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"

// Material icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ImageIcon from "@mui/icons-material/Image"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import PendingIcon from '@mui/icons-material/Pending'

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

function UpsertPostPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const mode = !id ? 'insert' : 'update'

    // For upserting post
    const [title, setTitle] = useState<string>('')
    const [postImages, setPostImages] = useState<string[]>([])
    const [postContentImageUplading, setPostContentImageUplading] = useState<boolean>(false)
    const [content, setContent] = useState<string | undefined>('# Makale İçeriği')
    const [description, setDescription] = useState<string | undefined>(undefined)
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
    const [selectedCover, setSelectedCover] = useState<string | undefined>(undefined)
    const [uploadFormData, setUploadFormData] = useState<FormData | undefined>(undefined)
    
    // When updating
    const [originalCover, setOriginalCover] = useState<string | undefined>(undefined)

    // For ai suggestions
    const [aiDescPending, setAiDescPending] = useState<boolean>(false)
    const [aiTitlePending, setAiTitlePending] = useState<boolean>(false)
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
    const [showAiSuggestionsModal, setShowAiSuggestionsModal] = useState<boolean>(false)

    // If mode is update, fetch post and all tags
    useEffect(() => {
        if (mode === 'update') {
            setPostLoading(true)

            getPost(id!)
                .then(p => {
                    setTitle(p.title)
                    setPostImages(p.images)
                    setContent(p.content)
                    setDescription(p.description)
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

    async function handleSaveButton(e: any) {
        e.preventDefault()

        // This will be used for post's cover field
        let uploadRes: any = undefined

        // Try upload cover image. If an error occurs do nothing. Finally upsert post.
        try {
            if (uploadFormData) {
                uploadRes = await uploadCover(uploadFormData)
            }
        } catch (_) { } finally {
            const validation = createPostJoiSchema.validate({
                title: title,
                images: postImages,
                content, description,
                cover: uploadRes,
                tags: selectedTags
            })

            if (validation.error) {
                setPostValidationErrors(validation.error.details.map(e => e.message + "\n"))
            } else {
                setPostSavingEnd(false)
                setPostValidationErrors(null)

                if (mode === 'insert') {
                    createPost({
                        title: title,
                        images: postImages,
                        content: content,
                        description: description,
                        cover: uploadRes,
                        tags: selectedTags
                    }, getAdminToken())
                        .then(_ => router.push(routeMap.admin.posts.root))
                        .catch(e => setPostSavingError(e))
                        .finally(() => setPostSavingEnd(true))
                } else {
                    updatePost({
                        id: id!,
                        title: title,
                        images: postImages,
                        content: content,
                        description: description,
                        cover: originalCover ?? uploadRes,
                        tags: selectedTags
                    }, getAdminToken())
                        .then(_ => router.push(routeMap.admin.posts.root))
                        .catch(e => setPostSavingError(e))
                        .finally(() => setPostSavingEnd(true))
                }
            }
        }
    }

    function handleUploadCover(e: any) {
        const file = e.target.files[0]

        try {
            setSelectedCover(URL.createObjectURL(file))

            // If original cover changed then delete original one.
            if (originalCover) {
                deleteCover(originalCover)
            }

            setOriginalCover(undefined)

            // This will be used for post's cover field when the creation process
            const formData = new FormData()
            formData.append('coverImage', file)
            setUploadFormData(formData)
        } catch (err) {
            setSelectedCover(undefined)
            setUploadFormData(undefined)
        }
    }

    function handleUploadPostImage(e: any) {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('postImages', file)

        setPostContentImageUplading(true)

        uploadPostImages(formData)
            .then(res => setPostImages([...postImages, res]))
            .catch(e => alert('Bir hata oluştu.'))
            .finally(() => setPostContentImageUplading(false))
    }

    function handleRemovePostImage(fileName: string) {
        setPostContentImageUplading(true)

        deletePostImage(fileName)
            .then(() => setPostImages(postImages.filter(pi => pi !== fileName)))
            .catch(e => alert('Bir hata oluştu.'))
            .finally(() => setPostContentImageUplading(false))
    }

    function handleAIDescription() {
        setAiDescPending(true)
        if (content?.trim() !== '') {
            suggest(content!, false)
                .then(r => setDescription(r as string))
                .catch(e => alert('Yapay zeka hatası'))
                .finally(() => setAiDescPending(false))
        }
    }

    function handleAITitle() {
        setAiTitlePending(true)
        if (title.trim() !== '') {
            suggest(title, true)
                .then(r => {
                    setAiSuggestions(r as string[])
                    setShowAiSuggestionsModal(true)
                })
                .catch(e => alert('Yapay zeka hatası'))
                .finally(() => setAiTitlePending(false))
        }
    }

    function CoverSelect() {
        return (
            <>
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #eee",
                    borderRadius: "5px"
                }}>
                    <Box
                        className={clsx([
                            "w-[800px]", "h-[420px]", "flex", "items-center", "justify-center", "bg-slate-100", "text-center", "relative"
                        ])}
                    >
                        {
                            !selectedCover && !originalCover
                                ? <Box>
                                    <ImageIcon fontSize="large" />
                                    <Typography variant="h6">KAPAK FOTOĞRAFI</Typography>
                                </Box>
                                : <Image
                                    src={
                                        selectedCover ??
                                        (originalCover ?
                                            `${routeMap.static.root}/${originalCover}`
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
                {/* Cover upload button */}
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
            </>
        )
    }

    function PostForm() {
        if (tagError !== null) {
            return (
                <Box sx={{ padding: '1rem' }}>
                    <ErrorElement />
                </Box>
            )
        }

        if (postLoading) {
            return (<UISkeleton format={3} />)
        }

        return (
            <Paper
                elevation={6}
                sx={{ padding: "1rem", width: "90%", margin: "2rem auto"}}
            >
                <form className={clsx(["w-full", "flex", "flex-col", "gap-8"])}>
                    <Typography variant="h4">
                        {mode === 'insert' ? 'Yeni Makale Oluştur' : 'Makaleyi Güncelle'}
                    </Typography>
                    {/* Cover images select section */}
                    {CoverSelect()}
                    {/* Post title input */}
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-title">
                            Makale Başlığı
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-title"
                            type="text"
                            label="Makale Başlığı"
                            onChange={(e) => setTitle(e.target.value)}
                            error={title?.trim() === ''}
                            fullWidth
                            value={title}
                            endAdornment={
                            <InputAdornment position="end" sx={{marginRight: '.5rem'}}>
                                <IconButton
                                    onClick={handleAITitle}
                                    edge="end"
                                    disabled={aiTitlePending}
                                >
                                    {aiTitlePending ? <PendingIcon /> : <AutoAwesomeIcon />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
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
                    {/* Post images upload */}
                    <ImageUploader
                        title="Makale için resimler yükleyin"
                        subFolder="images_of_posts"
                        handleRemoveImage={handleRemovePostImage}
                        handleUploadImage={handleUploadPostImage}
                        images={postImages}
                    />
                    {/* Post tags select */}
                    <TagSelector
                        defaultValue={mode === 'update' ? selectedTags : undefined}
                        tagOptions={tags.map(t => t.name)}
                        onChange={(value) => setSelectedTags(value)}
                        disabled={tagLoading}
                    />
                    {/* Description */}
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-desc">SEO - Açıklama</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-desc"
                            type="text"
                            label="SEO - Açıklama"
                            value={description}
                            rows={5}
                            slotProps={{ input: { maxLength: 160 } }}
                            fullWidth
                            multiline
                            onChange={(e) => setDescription(e.target.value)}
                            endAdornment={
                            <InputAdornment position="end" sx={{marginRight: '.5rem'}}>
                                <IconButton
                                    onClick={handleAIDescription}
                                    edge="end"
                                    disabled={aiDescPending}
                                >
                                    {aiDescPending ? <PendingIcon /> : <AutoAwesomeIcon />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
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
        <AdminPanelPage pageName={mode === 'insert' ? "Yeni Makale Yaz" : "Makaleyi Güncelle"}>
            {/* Alert modal for post fetching error for post update */}
            <AlertModal
                open={postError !== null}
                title="Uyarı"
                contentText="Sistem hatası oluştu!"
                onClose={() => router.push(routeMap.admin.posts.root)}
            />
            {/* Alert modal for post creation or updating error */}
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
            {/* Suggestion select modal */}
            <SuggestionModal
                title="Öneriler"
                open={showAiSuggestionsModal}
                suggestions={aiSuggestions}
                onClose={() => {}}
                onSelect={(suggestion) => {
                    setTitle(suggestion)
                    setShowAiSuggestionsModal(false)
                }}
            />
            {/* Backdrop for post creation process */}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={!postSavingEnd}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Backdrop for post images uploading process */}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={postContentImageUplading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {PostForm()}
        </AdminPanelPage>
    )
}

export default function UpsertPostPageWithSuspenseWrapper() {
    return (
        <Suspense fallback={<UISkeleton format={3} />}>
            <UpsertPostPage />
        </Suspense>
    )
}