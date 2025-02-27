import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import { Roboto } from 'next/font/google'
import { clsx } from 'clsx'
import PageTransition from '@/app/(components)/PageTransition'
import type { Metadata } from "next"
import theme from '../theme'
import "../../globals.css"

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
})

export const metadata: Metadata = {
    title: "Blog Yönetici Paneli",
    description: "Admin Panel",
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={clsx(`${roboto.variable}`)}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
