'use client'

import { useEffect, useState } from "react"

import { deleteCover } from "@/blog_api_actions"
import { deletePost, getPosts } from "@/blog_api_actions/post_repo"
import { UIOperations } from "@/types/enums"
import { routeMap } from "../../../../utils/routeMap"
import { paginationDataSliceIndexes } from "@/utils"
import { getAdminToken } from "@/lib/sharedFunctions"
import { ApiError } from "@/lib/custom_fetch"

import Image from 'next/image'
import { clsx } from 'clsx'

// My components
import StaggeredContent from "@/app/(components)/StaggeredContent"
import { StyledTableCell, StyledTableRow } from "../(components)/StyledTableComponents"
import ConfirmationDialog from "../(components)/ConfirmationDialog"
import UISkeleton from "../(components)/UISkeleton"
import ErrorElement from "../(components)/ErrorElement"
import NoData from "../(components)/NoData"
import TablePaginationActions from "../(components)/TablePaginationActions"
import AlertModal from "../(components)/AlertModal"
import AdminPanelPage from "../(components)/AdminPanelPage"

// Material components
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import Paper from "@mui/material/Paper"
import Link from "@mui/material/Link"
import Chip from "@mui/material/Chip"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import TableFooter from "@mui/material/TableFooter"
import TablePagination from "@mui/material/TablePagination"

// Material icons
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import OpenIcon from "@mui/icons-material/OpenInNew"
import ShareIcon from "@mui/icons-material/Share"
import CommentIcon from "@mui/icons-material/Comment"
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'
import InfoIcon from '@mui/icons-material/InfoRounded'

export default function PostsPage() {
    // For fetching posts
    const [posts, setPosts] = useState<Post[]>([])
    const [postsFetchError, setPostsFetchError] = useState<ApiError | null>(null)
    const [postsLoading, setPostsLoading] = useState<boolean>(true)

    // For deleting a post
    const [delPostId, setDelPostId] = useState<string>('')
    const [delPostError, setDelPostError] = useState<ApiError | null>(null)
    // For deleting post's cover image
    const [coverToDelete, setCoverToDelete] = useState<string | undefined>(undefined)

    // For UI operations (delete etc.)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
    const [uiOperation, setUiOperation] = useState<UIOperations | undefined>(undefined)
    const [seoInfos, setSeoInfos] = useState<string>('')

    // For post table pagination
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    useEffect(() => {
        getPosts()
            .then(p => setPosts(p))
            .catch(e => setPostsFetchError(e))
            .finally(() => setPostsLoading(false))
    }, [])

    function handleConfirmationDecision(decision: boolean) {
        // If decision is yes
        if (decision) {
            if (uiOperation === UIOperations.DELETE_POST) {
                // If post has a cover image to delete
                if (coverToDelete) {
                    deleteCover(coverToDelete)
                        .catch(e => setDelPostError(e))
                }

                deletePost(delPostId, getAdminToken())
                    .then(() => setPosts(prev => prev.filter(p => p.id !== delPostId)))
                    .catch(e => setDelPostError(e))
                    .finally(() => setDelPostId(''))
            }
        }

        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_POST) {
            setDelPostId('')
            setCoverToDelete(undefined)
        }
    }

    function handleConfirmationClose() {
        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_POST) {
            setDelPostId('')
            setCoverToDelete(undefined)
        }
    }

    function handlePostDeleteBtn(id: string, cover?: string) {
        setUiOperation(UIOperations.DELETE_POST)
        setConfirmationDialogOpen(true)
        setDelPostId(id)
        setCoverToDelete(cover)
    }

    function handlePostInfoBtn(
        seo: {
            description?: string,
            keywords: string[],
            title: string
        }
    ) {
        setSeoInfos(
            `Title: ${seo.title}\r\n` +
            `Description: ${seo.description ?? '-'}\r\n` +
            `Keywords: ${seo.keywords.length > 0 ? seo.keywords.join(',') : '-'}`
        )
    }

    function handleChangePage(e: any, newPage: number) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(e: any) {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    function PostsTableBody() {
        return (
            posts
                .slice(...paginationDataSliceIndexes(page, rowsPerPage, posts.length))
                .map((p, i) => (
                    <StyledTableRow key={p.id}>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                {i + 1 + (page * rowsPerPage)}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell width={230}>
                            <Image
                                src={
                                    p.cover
                                        ? `${routeMap.static.root + '/' + p.cover}`
                                        : '/images/no_cover.png'
                                }
                                width={200}
                                height={105}
                                style={{width: '200px', height: '105px'}}
                                alt="Makale Kapağı"
                            />
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="h5">{p.title}</Typography>
                            <Typography variant="body1" color="textDisabled">
                                {`${p.createdAt}`}
                            </Typography>
                            {p.tags.map(t => (
                                <Chip
                                    key={t.id}
                                    className={clsx(["ml-0", "m-2"])}
                                    avatar={<Avatar>#</Avatar>}
                                    label={t.name}
                                />
                            ))}
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                {p.shareCount}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                {p.commentCount}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                {p.viewCount}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                {p.likeCount}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <IconButton
                                color="info"
                                onClick={() => handlePostInfoBtn({
                                    description: p.description,
                                    keywords: p.tags.map(t => t.name),
                                    title: p.title
                                })}
                            >
                                <InfoIcon />
                            </IconButton>
                        </StyledTableCell>
                        <StyledTableCell>
                            <IconButton
                                color="error"
                                onClick={() => handlePostDeleteBtn(p.id, p.cover)}
                                disabled={delPostId === p.id}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Link href={`${routeMap.admin.posts.upsertPost(p.id)}`}>
                                <IconButton color="info">
                                    <EditIcon />
                                </IconButton>
                            </Link>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Link
                                href={routeMap.blog.posts.postById(p.id)}
                                target="_blank"
                            >
                                <IconButton color="secondary">
                                    <OpenIcon />
                                </IconButton>
                            </Link>
                        </StyledTableCell>
                    </StyledTableRow>
                )
            )
        )
    }

    function PostsTable() {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Kapak</StyledTableCell>
                            <StyledTableCell>Makale Başlığı & Yayın Tarihi</StyledTableCell>
                            <StyledTableCell><ShareIcon /></StyledTableCell>
                            <StyledTableCell><CommentIcon /></StyledTableCell>
                            <StyledTableCell><VisibilityIcon /></StyledTableCell>
                            <StyledTableCell><FavoriteIcon /></StyledTableCell>
                            <StyledTableCell><InfoIcon /></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{PostsTableBody()}</TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'Hepsi', value: -1 }]}
                                colSpan={0}
                                count={posts.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'Sayfa başına',
                                        },
                                        native: true,
                                    },
                                }}
                                labelRowsPerPage="Sayfa başına"
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        )
    }

    return (
        <AdminPanelPage pageName="Makaleler">
            {/* Dialog for post operations like delete */}
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Uyarı"
                contentText={
                    uiOperation === UIOperations.DELETE_POST
                        ? "Makaleyi silmek istediğinizden emin misiniz?"
                        : ""
                }
                onDecision={(decision) => handleConfirmationDecision(decision)}
                onClose={handleConfirmationClose}
            />
            {/* Alert modal for post deleting error */}
            <AlertModal
                open={delPostError !== null}
                title="Uyarı"
                contentText={"Bir hata oluştu!"}
                onClose={() => setDelPostError(null)}
            />
            {/* Alert modal for showing post seo infos */}
            <AlertModal
                open={seoInfos !== ''}
                title="Seo Bilgileri"
                contentText={seoInfos}
                onClose={() => setSeoInfos('') }
            />
            {/* Display skeleton, error element, no data element, table */}
            <StaggeredContent
                loading={{
                    status: postsLoading,
                    content: (<UISkeleton format={1} />)
                }}
                error={{
                    status: postsFetchError !== null,
                    content: (<ErrorElement />)
                }}
                content={{
                    empty: posts.length === 0,
                    emptyContent: (<NoData />),
                    content: PostsTable()
                }}
            />
        </AdminPanelPage>
    )
}