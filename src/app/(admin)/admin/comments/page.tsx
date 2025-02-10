'use client'

// Material components
import TableRow from "@mui/material/TableRow"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableFooter from "@mui/material/TableFooter"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import Typography from "@mui/material/Typography"

// Material Icons
import DeleteIcon from "@mui/icons-material/Delete"

// My components
import StaggeredContent from "@/app/(components)/StaggeredContent"
import UISkeleton from "../(components)/UISkeleton"
import ErrorElement from "../(components)/ErrorElement"
import NoData from "../(components)/NoData"
import { StyledTableCell, StyledTableRow } from "../(components)/StyledTableComponents"
import ConfirmationDialog from "../(components)/ConfirmationDialog"
import AlertModal from "../(components)/AlertModal"
import TablePaginationActions from "../(components)/TablePaginationActions"
import AdminPanelPage from "../(components)/AdminPanelPage"

import { useEffect, useState } from "react"

import { deleteComment, getAllComments } from "@/blog_api_actions/comment_repo"
import { ApiError } from "@/lib/custom_fetch"
import { getAdminToken } from "@/lib/sharedFunctions"

import { paginationDataSliceIndexes } from "@/utils"
import { UIOperations } from "@/types/enums"

export default function CommentsPage() {
    // For fetching comments
    const [comments, setComments] = useState<PostComment[]>([])
    const [commentsFetchError, setCommentsFetchError] = useState<ApiError | null>(null)
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true)

    // For comment table pagination
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(30);

    // For deleting a comment
    const [delCommentId, setDelCommentId] = useState<string>('')
    const [commentDelError, setCommentDelError] = useState<ApiError | null>(null)

    // For UI operations (delete etc.)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
    const [uiOperation, setUiOperation] = useState<UIOperations | undefined>(undefined)

    useEffect(() => {
        getAllComments()
            .then(c => setComments(c))
            .catch(e => setCommentsFetchError(e))
            .finally(() => setCommentsLoading(false))
    }, [])

    function handleCommentDeleteBtn(id: string) {
        setUiOperation(UIOperations.DELETE_COMMENT)
        setConfirmationDialogOpen(true)
        setDelCommentId(id)
    }

    function handleChangePage(e: any, newPage: number) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(e: any) {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    function handleConfirmationDecision(decision: boolean) {
        // If decision is yes
        if (decision) {
            if (uiOperation === UIOperations.DELETE_COMMENT) {
                deleteComment(delCommentId!, getAdminToken())
                    .then(() => setComments(prev => prev.filter(c => c.id !== delCommentId)))
                    .catch(e => setCommentDelError(e))
                    .finally(() => setDelCommentId(''))
            }
        }

        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_COMMENT) {
            setDelCommentId('')
        }
    }

    function handleConfirmationClose() {
        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_COMMENT) {
            setDelCommentId('')
        }
    }

    function CommentsTableBody() {
        return (
            comments
                .slice(...paginationDataSliceIndexes(page, rowsPerPage, comments.length))
                .map((c, i) => (
                    <StyledTableRow key={c.id}>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                {i + 1 + (page * rowsPerPage)}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" color="textDisabled">
                                {`${c.createdAt}`}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                {c.user?.email}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                {c.post?.title}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                {c.text}
                            </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                            <IconButton
                                color="error"
                                onClick={() => handleCommentDeleteBtn(c.id)}
                                disabled={delCommentId === c.id}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </StyledTableCell>
                    </StyledTableRow>
            ))
        )
    }

    function CommentsTable() {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Tarih</StyledTableCell>
                            <StyledTableCell>E-Posta</StyledTableCell>
                            <StyledTableCell>Makale</StyledTableCell>
                            <StyledTableCell>Yorum</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{CommentsTableBody()}</TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 30, { label: 'Hepsi', value: -1 }]}
                                colSpan={0}
                                count={comments.length}
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
        <AdminPanelPage pageName="Yorumlar">
            {/* Dialog for comment operations like delete */}
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Uyarı"
                contentText={
                    uiOperation === UIOperations.DELETE_COMMENT
                        ? "Yorumu kaldırmak istediğinizden emin misiniz?"
                        : ""
                }
                onDecision={(decision) => handleConfirmationDecision(decision)}
                onClose={handleConfirmationClose}
            />
            {/* Alert modal for comment deleting error */}
            <AlertModal
                open={commentDelError !== null}
                title="Uyarı"
                contentText={"Bir hata oluştu!"}
                onClose={() => setCommentDelError(null)}
            />
            {/* Display skeleton, error element, no data element, table */}
            <StaggeredContent
                loading={{
                    status: commentsLoading,
                    content: (<UISkeleton format={3} />)
                }}
                error={{
                    status: commentsFetchError !== null,
                    content: (<ErrorElement />)
                }}
                content={{
                    empty: comments.length === 0,
                    emptyContent: (<NoData />),
                    content: CommentsTable()
                }}
            />
        </AdminPanelPage>
    )
}