import type { Metadata } from "next"
import "../../globals.css"
import Header from "./(components)/Header"
import Footer from "./(components)/Footer"
import { getServerSession } from 'next-auth'
import SessionProvider from '@/app/(blog)/blog/(components)/SessionProvider'

export const metadata: Metadata = {
  title: "Caner Demirci - Kişisel Blog",
  description: "Caner Demirci - Kişisel Blog",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode,
}>) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className="dark:bg-black bg-gray-50">
        <SessionProvider session={session}>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
