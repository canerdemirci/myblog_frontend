import AdminPanelPage from "./(components)/AdminPanelPage"
import type { Metadata } from 'next'
import Statistics from "./(components)/DashboardComponents/Statistics"

export const metadata: Metadata = {
    title: 'Yönetici Paneli - Anasayfa'
}

export default function AdminHomePage() {
    return (
        <AdminPanelPage pageName="Ana Panel">
            <Statistics />
        </AdminPanelPage>
    )
}