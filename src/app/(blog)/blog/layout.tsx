import type { Metadata } from "next"
import "../../globals.css"
import Header from "./(components)/Header"
import Footer from "./(components)/Footer"
import { getServerSession } from 'next-auth'
import SessionProvider from '@/app/(blog)/blog/(components)/SessionProvider'
import { clsx } from 'clsx'
import PageTransition from "@/app/(components)/PageTransition"

export const metadata: Metadata = {
  title: "Caner Demirci - Kişisel Blog",
  description: "Caner Demirci - Kişisel Blog. Yazılım, teknoloji, programlama ve daha fazlası hakkında yazılar.",
  keywords: "Yazılım, kodlama, web, javascript, node js, typescript, next js, react js, html, css, blog",
  authors: [{name: "Caner Demirci"}],
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode,
}>) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={clsx([
        "dark:bg-black", "bg-gray-50", 
        "bg-gradient-to-t", "dark:from-transparent", "dark:to-[#c9050530]",
        "bg-[length:100%_200px]", "bg-no-repeat", 'from-gray-50', 'to-white'
      ])}>
        <SessionProvider session={session}>
          <PageTransition>
            <Header />
              {children}
            <Footer />
          </PageTransition>
        </SessionProvider>
      </body>
    </html>
  );
}
