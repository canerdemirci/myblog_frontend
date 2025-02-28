import type { Metadata } from "next"

import "@/app/globals.css"

import Header from "./(components)/Header"
import Footer from "./(components)/Footer"
import SessionProvider from '@/app/(blog)/[locale]/blog/(components)/SessionProvider'
import PageTransition from "@/app/(components)/PageTransition"

import { getServerSession } from 'next-auth'
import { clsx } from 'clsx'

import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing} from '@/i18n/routing'

export async function generateMetadata(
  { params } : { params: { locale: string } }
) : Promise<Metadata> {
  const { locale } = params

  const metadata = {
    tr: {
      title: "Caner Demirci - Kişisel Blog",
      description:
        "Caner Demirci - Kişisel Blog. Yazılım, teknoloji, programlama ve daha fazlası" +
        "hakkında yazılar.",
      keywords:
        "Yazılım, kodlama, web, javascript, node js, typescript, next js, react js, " +
        "html, css, blog",
      authors: [{name: "Caner Demirci"}],
    },
    en: {
      title: "Caner Demirci's Personal Blog",
      description:
        "Caner Demirci's Personal Blog. " +
        "Articles about software, technology, programming and more.",
      keywords:
        "Software, coding, web, javascript, node js, typescript, next js, react js, " +
        "html, css, blog",
      authors: [{name: "Caner Demirci"}],
    },
  }

  return {
    title: metadata[locale as keyof typeof metadata].title,
    description: metadata[locale as keyof typeof metadata].description,
    keywords: metadata[locale as keyof typeof metadata].keywords,
    authors: [{ name: "Caner Demirci" }],
  }
}

export default async function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}>) {
  const session = await getServerSession()

  const { locale } = await params
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Fetch messages for the given locale
  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={clsx([
        "bg-no-repeat", "bg-[length:100%_200px]", "bg-gray-50",
        "bg-gradient-to-t", "from-gray-50", "to-white",
        // Dark
        "dark:bg-black", "dark:from-transparent", "dark:to-[#c9050530]",
      ])}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider session={session}>
            <PageTransition>
              <Header />
                {children}
              <Footer />
            </PageTransition>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
