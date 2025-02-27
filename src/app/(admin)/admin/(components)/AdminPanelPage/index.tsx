/**
 * Wrapper for admin panel pages
 */

'use client'

import Header from "@/app/(admin)/admin/(components)/Header"
import Box from "@mui/material/Box"
import UIBreadcrumbs from "../UIBreadcrumbs"
import Container from "@mui/material/Container"

interface Props {
    children: React.ReactNode
    pageName: string
}

export default function AdminPanelPage({ children, pageName } : Props) {
    return (
        <Box>
            <Header />
            <UIBreadcrumbs pageName={pageName} />
            <Container maxWidth="xl">
                <Box sx={{
                    marginTop: '9rem',
                    marginBottom: '1rem',
                    marginLeft: '4rem' }}
                >
                    {children}
                </Box>
            </Container>
        </Box>
    )
}