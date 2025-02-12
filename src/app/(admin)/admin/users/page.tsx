'use client'

// Material components
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import TableFooter from "@mui/material/TableFooter"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import Typography from "@mui/material/Typography"

// My components
import StaggeredContent from "@/app/(components)/StaggeredContent"
import UISkeleton from "../(components)/UISkeleton"
import ErrorElement from "../(components)/ErrorElement"
import NoData from "../(components)/NoData"
import { StyledTableCell, StyledTableRow } from "../(components)/StyledTableComponents"
import TablePaginationActions from "../(components)/TablePaginationActions"
import AdminPanelPage from "../(components)/AdminPanelPage"

import { useEffect, useState } from "react"
import Image from 'next/image'
import { IoPersonCircle } from "react-icons/io5"

import { paginationDataSliceIndexes } from "@/utils"
import { getUsers } from "@/blog_api_actions/user_repo"
import { ApiError } from "@/lib/custom_fetch"
import clsx from "clsx"
import type { User } from "next-auth"

export default function CommentsPage() {
    // For fetching users
    const [users, setUsers] = useState<User[]>([])
    const [usersFetchError, setUsersFetchError] = useState<ApiError | null>(null)
    const [usersLoading, setUsersLoading] = useState<boolean>(true)

    // For user table pagination
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(30);

    useEffect(() => {
        getUsers()
            .then(u => setUsers(u))
            .catch(e => setUsersFetchError(e))
            .finally(() => setUsersLoading(false))
    }, [])

    function handleChangePage(e: any, newPage: number) {
        setPage(newPage)
    }

    function handleChangeRowsPerPage(e: any) {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    function UsersTable() {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>Avatar</StyledTableCell>
                            <StyledTableCell>E-Posta</StyledTableCell>
                            <StyledTableCell>İsim</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users
                            .slice(...paginationDataSliceIndexes(page, rowsPerPage, users.length))
                            .map((u, i) => (
                                <StyledTableRow key={u.id}>
                                    <StyledTableCell width={20}>
                                        <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                            {i + 1 + (page * rowsPerPage)}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell width={100}>
                                        <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                            {
                                                !u.image ? 
                                                    <IoPersonCircle
                                                        size={72}
                                                        className={clsx(['dark:text-white'])}
                                                    />
                                                    : <Image
                                                        width={72}
                                                        height={72}
                                                        src={u.image}
                                                        alt="Profil foto"
                                                        className={clsx([
                                                            'rounded-full', 'border-gray-400', 'border'
                                                        ])}
                                                    />
                                            }
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell width={400}>
                                        <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                            {u.email}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        <Typography variant="body1" sx={{fontSize: '1rem'}}>
                                            {u.name ?? '-'}
                                        </Typography>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 30, { label: 'Hepsi', value: -1 }]}
                                colSpan={0}
                                count={users.length}
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
        <AdminPanelPage pageName="Üyeler">
            {/* Display skeleton, error element, no data element, table */}
            <StaggeredContent
                loading={{
                    status: usersLoading,
                    content: (<UISkeleton format={3} />)
                }}
                error={{
                    status: usersFetchError !== null,
                    content: (<ErrorElement />)
                }}
                content={{
                    empty: users.length === 0,
                    emptyContent: (<NoData />),
                    content: UsersTable()
                }}
            />
        </AdminPanelPage>
    )
}