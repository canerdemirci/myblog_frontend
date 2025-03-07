# Internationalazation

**next-intl** package used for internationalazation.

We include all blog routes in **[locale]** folder.

Implementation guide: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing

### next.config.mjs

```tsx
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    ...
};

export default withNextIntl(nextConfig);
```

### ./messages Folder in Project Root

There are two json file: en.json and tr.json

```tsx
en.json
{
...
    "HomePage": {
        "title": "Caner Demirci's Personal Blog"
    },
    "Header": {
        "catchWord": "A Developer Diary"
    },
    "PostPage": {
        "relatedPostsTitle": "RELATED POSTS"
    }
...
}
```

### routing.ts in ./src/i18n folder

```tsx
import {defineRouting} from 'next-intl/routing'
import {createNavigation} from 'next-intl/navigation'

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['tr', 'en'],
   
    // Used when no locale matches
    defaultLocale: 'tr'
})
```

### navigation.ts in ./src/i18n folder

```tsx
import {createNavigation} from 'next-intl/navigation'
import {routing} from './routing'
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing)
```

### request.ts in ./src/i18n folder

```tsx
import {getRequestConfig} from 'next-intl/server'
import {routing} from './routing'
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
```

### Middleware

Internationalazation implemented for only /blog routes.

```tsx
/**
 * Middleware for /blog and /admin routes.
 */
import { NextRequest, NextResponse } from 'next/server'
import { middleware2 } from './middleware2'
import { middleware1 } from './middleware1'
import createIntlMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(req: NextRequest) {
    // I want to implement multi language support for the blog pages.
    // So, I will run the next-intl middleware for the /blog routes.
    if (req.nextUrl.pathname.includes('/blog')) {
        // Run the next-intl middleware first
        const intlResponse = intlMiddleware(req)

        // If the next-intl middleware returns a response, return it
        if (intlResponse) {
            return intlResponse
        }

        const response1 = await middleware1(req)

        if (response1) {
            return response1
        }
    }

    // Protect /admin routes except /admin/login page.
    if (req.nextUrl.pathname.includes('/admin') && !req.nextUrl.pathname.includes('/admin/login')) {
        const response2 = await middleware2(req)

        if (response2) {
            return response2
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/(tr|en)/:path*', '/blog/:path*', '/admin/:path*']
}
```

### Language Switcher Button

```tsx
"use client"

import clsx from "clsx"
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from "next-intl"
import { GrLanguage } from "react-icons/gr"

export default function LanguageSwitcher() {
    const pathName = usePathname()
    const router = useRouter()
    const locale = useLocale()

    return (
        <div className={clsx(['cursor-pointer', 'group', 'relative'])}>
            <GrLanguage size={28} className={clsx(['text-gray-800', 'dark:text-gray-100'])} />
            {/* Menu */}
            <div
                className={clsx([
                    'absolute', 'hidden', 'left-[-2px]', 'top-[28px]', 'bg-gray-300', 'shadow-xl', 'rounded-md', 'flex-col',
                    'group-hover:flex',
                ])}
            >
                <Link
                    href={pathName}
                    locale="tr"
                    className={clsx([
                        locale === 'tr' ? 'bg-red-500' : 'bg-gray-300',
                        'p-2', 'cursor-pointer', 'rounded-md',
                        'hover:bg-gray-400',
                    ])}
                >
                    <span>TR</span>
                </Link>
                <Link
                    href={pathName}
                    locale="en"
                    className={clsx([
                        locale === 'en' ? 'bg-red-500' : 'bg-gray-300',
                        'p-2', 'cursor-pointer', 'rounded-md',
                        'hover:bg-gray-400',
                    ])}
                >
                    <span>EN</span>
                </Link>
            </div>
        </div>
    )
}
```

### Root Layout Changes

Important changes:

- Using generateMetadata function and setting metadata through languages.
- Setting html lang attribute dynamically
- Wrapping elements with NextIntlClientProvider

```tsx
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
```

## Using Translations in Server Component

We use **getTranslations** method.

```tsx
async function RelatedPosts(relatedPosts: RelatedPost[]) {
        const t = await getTranslations('PostPage')

        return (
            <section>
                <h2
                    className={clsx([
                        montserrat.className,
                        'text-center', 'font-bold', 'text-3xl', 'text-gray-800', 'mt-16', 'mb-8',
                        'dark:text-gray-100'
                    ])}
                >
                    {t('relatedPostsTitle')}
                </h2>
                ...
```

## Using Translations in Client Component

We use **useTranslations** method.

```tsx
export default function Header() {
    const t = useTranslations('Header')

    return (
        <header>
            ...
                <p
                    className={clsx([
                        `${caveat.className}`, "text-5xl", "text-center", "text-gray-800", "mb-4",
                        "dark:text-white"
                    ])}
                >
                    {t('catchWord')}
                </p>
            ...
```