'use client'

import { useEffect, useState } from "react"

import { ApiError } from "@/blog_api"
import { deleteNote, getNotes } from "@/blog_api/note_repo"
import { UIOperations } from "@/types/enums"
import { routeMap } from "../../routeMap"
import { paginationDataSliceIndexes } from "@/utils"

// My components
import StaggeredContent from "@/app/(components)/StaggeredContent"
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
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import TableFooter from "@mui/material/TableFooter"
import TablePagination from "@mui/material/TablePagination"

// Material icons
import DeleteIcon from "@mui/icons-material/Delete"
import OpenIcon from "@mui/icons-material/OpenInNew"
import ShareIcon from "@mui/icons-material/Share"
import CommentIcon from "@mui/icons-material/Comment"
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'

export default function NotesPage() {
    // For fetching notes
    const [notes, setNotes] = useState<Note[]>([])
    const [notesFetchError, setNotesFetchError] = useState<ApiError | null>(null)
    const [notesLoading, setNotesLoading] = useState<boolean>(true)

    // For deleting a note
    const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null)
    const [noteDeletingError, setNoteDeletingError] = useState<ApiError | null>(null)

    // For UI operations (delete etc.)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
    const [uiOperation, setUiOperation] = useState<UIOperations | undefined>(undefined)

    // For note table pagination
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    useEffect(() => {
        getNotes()
            .then(n => setNotes(n))
            .catch(e => setNotesFetchError(e))
            .finally(() => setNotesLoading(false))
    }, [])

    function handleConfirmationDecision(decision: boolean) {
        // If decision is yes
        if (decision) {
            if (uiOperation === UIOperations.DELETE_NOTE) {
                deleteNote(noteToDeleteId!)
                    .then(() => setNotes(prev => prev.filter(n => n.id !== noteToDeleteId)))
                    .catch(e => setNoteDeletingError(e))
                    .finally(() => setNoteToDeleteId(null))
            }
        }

        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_NOTE) {
            setNoteToDeleteId(null)
        }
    }

    function handleConfirmationClose() {
        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_NOTE) {
            setNoteToDeleteId(null)
        }
    }

    function handleNoteDeleteBtn(id: string) {
        setUiOperation(UIOperations.DELETE_NOTE)
        setConfirmationDialogOpen(true)
        setNoteToDeleteId(id)
    }

    function handleChangePage(e: any, newPage: number) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(e: any) {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    function NotesTable() {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Yayın Tarihi</StyledTableCell>
                            <StyledTableCell><ShareIcon /></StyledTableCell>
                            <StyledTableCell><VisibilityIcon /></StyledTableCell>
                            <StyledTableCell><FavoriteIcon /></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes
                            .slice(...paginationDataSliceIndexes(page, rowsPerPage, notes.length))
                            .map((n, i) => (
                            <StyledTableRow key={n.id}>
                                <StyledTableCell>
                                    <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                        {i + 1 + (page * rowsPerPage)}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Typography variant="body1" color="textDisabled">
                                        {`${n.createdAt}`}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                        {n.shareCount}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                        {n.viewCount}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Typography variant="body1" sx={{fontSize: '1.3rem'}}>
                                        {n.likeCount}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleNoteDeleteBtn(n.id)}
                                        disabled={noteToDeleteId === n.id}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Link
                                        href={routeMap.blog.notes.noteById(n.id)}
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
                                count={notes.length}
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
            {/* Dialog for note operations like delete */}
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Uyarı"
                contentText={
                    uiOperation === UIOperations.DELETE_NOTE
                        ? "Notu silmek istediğinizden emin misiniz?"
                        : ""
                }
                onDecision={(decision) => handleConfirmationDecision(decision)}
                onClose={handleConfirmationClose}
            />
            {/* Alert modal for note deleting error */}
            <AlertModal
                open={noteDeletingError !== null}
                title="Uyarı"
                contentText={noteDeletingError?.data.message ?? ""}
                onClose={() => setNoteDeletingError(null)}
            />
            <Header />
            <UIBreadcrumbs pageName="Notlar" />
            <Container maxWidth="xl">
                <Box sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    {/* Display skeleton, error element, no data element, table */}
                    <StaggeredContent
                        loading={{
                            status: notesLoading,
                            content: (<UISkeleton format={1} />)
                        }}
                        error={{
                            status: notesFetchError !== null,
                            content: (<ErrorElement />)
                        }}
                        content={{
                            empty: notes.length === 0,
                            emptyContent: (<NoData />),
                            content: NotesTable()
                        }}
                    />
                </Box>
            </Container>
        </Box>
    )
}