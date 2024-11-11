'use client'

import { useEffect, useState } from "react"

import { ApiError, createTag, deleteTag, getTags } from "@/blog_api"
import { UIOperations } from "@/types/enums"
import { createTagJoiSchema, paginationDataSliceIndexes, sortTags } from "@/utils"

// My components
import Header from "../(components)/Header"
import UIBreadcrumbs from "../(components)/UIBreadcrumbs"
import ConfirmationDialog from "../(components)/ConfirmationDialog"
import ErrorElement from "../(components)/ErrorElement"
import UISkeleton from "../(components)/UISkeleton"
import NoData from "../(components)/NoData"
import TagCreator from "../(components)/TagCreator"
import AlertModal from "../(components)/AlertModal"
import TablePaginationActions from "../(components)/TablePaginationActions"
import { StyledTableCell, StyledTableRow } from "../(components)/StyledTableComponents"

// Material components
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableFooter from "@mui/material/TableFooter"
import TablePagination from "@mui/material/TablePagination"

// Material icons
import DeleteIcon from "@mui/icons-material/Delete"

export default function TagsPage() {
    // For fetching tags
    const [tags, setTags] = useState<Tag[]>([])
    const [tagsFetchError, setTagsFetchError] = useState<ApiError | null>(null)
    const [tagsLoading, setTagsLoading] = useState<boolean>(true)

    // For UI operations (delete etc.)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<boolean>(false)
    const [uiOperation, setUiOperation] = useState<UIOperations | undefined>(undefined)

    // For deleting a tag
    const [tagToDeleteId, setTagToDeleteId] = useState<string | null>(null)
    const [tagDeletingError, setTagDeletingError] = useState<ApiError | null>(null)

    // For creating a tag
    const [tagInputText, setTagInputText] = useState<string>('')
    const [tagCreationEnd, setTagCreationEnd] = useState<boolean>(true)
    const [tagCreationError, setTagCreationError] = useState<ApiError | null>(null)

    // For tag table pagination
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    useEffect(() => {
        getTags()
            .then(t => setTags(t))
            .catch(e => setTagsFetchError(e))
            .finally(() => setTagsLoading(false))
    }, [])

    function handleConfirmationDecision(decision: boolean) {
        // If decision is yes
        if (decision) {
            if (uiOperation === UIOperations.DELETE_TAG) {
                deleteTag(tagToDeleteId!)
                    .then(() => setTags(prev => prev.filter(t => t.id !== tagToDeleteId)))
                    .catch(e => setTagDeletingError(e))
                    .finally(() => setTagToDeleteId(null))
            }
        }

        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_TAG) {
            setTagToDeleteId(null)
        }
    }

    function handleConfirmationClose() {
        setConfirmationDialogOpen(false)

        if (uiOperation === UIOperations.DELETE_TAG) {
            setTagToDeleteId(null)
        }
    }

    function handleCreateTagEvent() {
        setTagCreationEnd(false)

        const validation = createTagJoiSchema.validate({ name: tagInputText.trim() })

        if (!validation.error) {
            createTag({ name: validation.value.name })
                .then(t => {
                    setTags(prev => [...prev, t as Tag].sort(sortTags))
                    setTagInputText('')
                })
                .catch(e => setTagCreationError(e))
                .finally(() => setTagCreationEnd(true))
        }
    }

    function handleTagDeleteBtn(id: string) {
        setUiOperation(UIOperations.DELETE_TAG)
        setConfirmationDialogOpen(true)
        setTagToDeleteId(id)
    }

    function handleChangePage(e: any, newPage: number) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(e: any) {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    function TagsTable() {
        return (
            <TableContainer component={Paper} style={{ display: "inline-block", width: "auto" }}>
                <Table
                    size="small"
                    style={{ tableLayout: "auto", width: "auto", minWidth: "100%" }}
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Etiket Adı</StyledTableCell>
                            <StyledTableCell>Makale Sayısı</StyledTableCell>
                            <StyledTableCell>Sil</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tags
                            .slice(...paginationDataSliceIndexes(page, rowsPerPage, tags.length))
                            .map((t, i) => (
                                <StyledTableRow key={t.id}>
                                    <StyledTableCell>
                                        <Typography variant="body1">
                                            {i + 1 + (page * rowsPerPage)}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography variant="body1">{t.name}</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Typography variant="body1">{t.postCount}</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleTagDeleteBtn(t.id)}
                                            disabled={tagToDeleteId === t.id}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'Hepsi', value: -1 }]}
                                colSpan={0}
                                count={tags.length}
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
            {/* Dialog for tag operations like delete */}
            <ConfirmationDialog
                open={confirmationDialogOpen}
                title="Uyarı"
                contentText={uiOperation === UIOperations.DELETE_TAG ? "Etiketi silmek istediğinizden emin misiniz?" : ""}
                onDecision={(decision) => handleConfirmationDecision(decision)}
                onClose={handleConfirmationClose}
            />
            {/* Alert modal for tag deleting error */}
            <AlertModal
                open={tagDeletingError !== null}
                title="Uyarı"
                contentText={tagDeletingError?.data.message ?? ""}
                onClose={() => setTagDeletingError(null)}
            />
            {/* Alert modal for tag creation error */}
            <AlertModal
                open={tagCreationError !== null}
                title="Uyarı"
                contentText={tagCreationError?.data.message ?? ""}
                onClose={() => setTagCreationError(null)}
            />
            <Header />
            <UIBreadcrumbs pageName="Etiketler" />
            <Container maxWidth="xl">
                <Box sx={{
                    marginTop: '1rem', marginBottom: '1rem', display: 'flex',
                    flexDirection: 'column', gap: '1.5rem'
                }}>
                    <TagCreator
                        error={
                            tagCreationError !== null ? 'server'
                            : tagInputText === '' ? 'validation' : null
                        }
                        disabled={!tagCreationEnd}
                        value={tagInputText}
                        onChange={(e) => setTagInputText(e.target.value)}
                        onSubmit={() => handleCreateTagEvent()}
                    />
                    {/* Display skeleton, error element, no data element, table */}
                    {
                        tagsLoading
                            ? <UISkeleton format={2} />
                            : tagsFetchError !== null
                                ? <ErrorElement />
                                : tags.length < 1
                                    ? <NoData />
                                    : TagsTable()
                    }
                </Box>
            </Container>
        </Box>
    )
}