'use client'

import { useEffect, useState } from "react"

import { ApiError, deleteCover, deletePost, getPosts } from "@/blog_api"
import { UIOperations } from "@/types/enums"
import { routeMap } from "../../routeMap"
import { paginationDataSliceIndexes } from "@/utils"

import Image from 'next/image'

// My components
import Header from "../(components)/Header"
import { StyledTableCell, StyledTableRow } from "../(components)/StyledTableComponents"
import ConfirmationDialog from "../(components)/ConfirmationDialog"
import UIBreadcrumbs from "../(components)/UIBreadcrumbs"
import UISkeleton from "../(components)/UISkeleton"
import ErrorElement from "../(components)/ErrorElement"
import NoData from "../(components)/NoData"
import TablePaginationActions from "../(components)/TablePaginationActions"
import AlertModal from "../(components)/AlertModal"

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
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
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

export default function PostsPage() {
    // For fetching posts
    const [posts, setPosts] = useState<Post[]>([])
    const [postsFetchError, setPostsFetchError] = useState<ApiError | null>(null)
    const [postsLoading, setPostsLoading] = useState<boolean>(true)

    // For deleting a post
    const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null)
    const [postDeletingError, setPostDeletingError] = useState<ApiError | null>(null)
    // For deleting post's cover image
    const [coverToDelete, setCoverToDelete] = useState<string | undefined>(undefined)

    // For UI operations (delete etc.)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
    const [uiOperation, setUiOperation] = useState<UIOperations | undefined>(undefined)

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
                        .catch(e => setPostDeletingError(e))
                }

                deletePost(postToDeleteId!)
                    .then(() => setPosts(prev => prev.filter(p => p.id !== postToDeleteId)))
                    .catch(e => setPostDeletingError(e))
                    .finally(() => setPostToDeleteId(null))
            }
        }

        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_POST) {
            setPostToDeleteId(null)
            setCoverToDelete(undefined)
        }
    }

    function handleConfirmationClose() {
        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_POST) {
            setPostToDeleteId(null)
            setCoverToDelete(undefined)
        }
    }

    function handlePostDeleteBtn(id: string, cover?: string) {
        setUiOperation(UIOperations.DELETE_POST)
        setConfirmationDialogOpen(true)
        setPostToDeleteId(id)
        setCoverToDelete(cover)
    }

    function handleChangePage(e: any, newPage: number) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(e: any) {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    function PostsTable() {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Yayın Tarihi & Kapak</StyledTableCell>
                            <StyledTableCell>Makale Başlığı</StyledTableCell>
                            <StyledTableCell><ShareIcon /></StyledTableCell>
                            <StyledTableCell><CommentIcon /></StyledTableCell>
                            <StyledTableCell><VisibilityIcon /></StyledTableCell>
                            <StyledTableCell><FavoriteIcon /></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts
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
                                                ? `http://localhost:8000/api/static/${p.cover}`
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
                                    <Typography variant="body2" color="textDisabled">
                                        {`${p.updatedAt}`}
                                    </Typography>
                                    {p.tags.map(t => (
                                        <Chip
                                            key={t.id}
                                            className="ml-0 m-2"
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
                                        3
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
                                        color="error"
                                        onClick={() => handlePostDeleteBtn(p.id, p.cover)}
                                        disabled={postToDeleteId === p.id}
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
                        ))}
                    </TableBody>
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
        <Box>
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
                open={postDeletingError !== null}
                title="Uyarı"
                contentText={postDeletingError?.data.message ?? ""}
                onClose={() => setPostDeletingError(null)}
            />
            <Header />
            <UIBreadcrumbs pageName="Makaleler" />
            <Container maxWidth="xl">
                <Box sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    {/* Display skeleton, error element, no data element, table */}
                    {
                        postsLoading
                            ? <UISkeleton format={1} />
                            : postsFetchError !== null
                                ? <ErrorElement />
                                : posts.length < 1
                                    ? <NoData />
                                    : PostsTable()
                    }
                </Box>
            </Container>
        </Box>
    )
}