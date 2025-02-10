import { Suspense } from "react"
import AdminPanelPage from "./(components)/AdminPanelPage"
import type { Metadata } from 'next'
import UISkeleton from "./(components)/UISkeleton"
import Statistics from "./(components)/DashboardComponents/Statistics"

export const metadata: Metadata = {
    title: 'Yönetici Paneli - Anasayfa'
}

export default async function AdminHomePage() {
    return (
        <AdminPanelPage pageName="Ana Panel">
            <Suspense fallback={<UISkeleton format={3} />}>
                <Statistics />
            </Suspense>
        </AdminPanelPage>
    )
}