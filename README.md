# Frontend

This is my personal blog app’s frontend code consists of NextJS 14 with App Router and Typescript, Tailwind, Material UI (Used for only Admin Panel), HTML, CSS, SCSS. App consists of **Admin Panel and Blog (/admin and /blog routes).**

[![Watch the video](https://img.youtube.com/vi/PZXf5SrEvn4/maxresdefault.jpg)](https://www.youtube.com/watch?v=PZXf5SrEvn4)
[![Watch the video](https://img.youtube.com/vi/6qjsXQfVpkE/maxresdefault.jpg)](https://www.youtube.com/watch?v=6qjsXQfVpkE)

Backend Repository: [Backend Code](https://github.com/canerdemirci/myblog_api)

| **Production Server** | [https://canerdemirci.vercel.app](https://canerdemirci.vercel.app/en/blog) |
| --- | --- |
| **Hosting (Vercel)** | [https://vercel.com/canerdemircis-projects/myblog-frontend](https://vercel.com/canerdemircis-projects/myblog-frontend) |
| **Package Manager** | pnpm |

<aside>
👉

It deployed with Github push command (automatic deployment)

</aside>

## Authentication Providers

Google: https://console.cloud.google.com/auth/ → Clients section

Github:

[https://github.com/settings/applications/](https://github.com/settings/applications/)


[Packages](README/Packages%2013fa4b25fe518062ad12cce57a6cd245.md)

[Folder Structure](README/Folder%20Structure%201aaa4b25fe518099b2c3f923eba1fbaf.md)

[Data Fetching](README/Data%20Fetching%201aba4b25fe5180f19863cc4a0a5752fd.md)

[Caching](README/Caching%20191a4b25fe51804480e7dbfbbd8eeb23.md)

[Authentication & Authorization](README/Authentication&Authorization_14ea4b25fe5180dc8c5cd1f647be5f01.md)

[Middleware](README/Middleware%20191a4b25fe5180819ab2e1eaf0d70413.md)

[Internationalazation](README/Internationalazation%201a8a4b25fe51803ca7c8dea3d4defe5b.md)

[Dark Mode Implementation](README/Dark%20Mode%20Implementation%2013ba4b25fe5180c0bd5ce0708e7e47f6.md)

[Staggered Content Component](README/Staggered%20Content%20Component%20170a4b25fe5180aa84b9fdc93beb19a7.md)

## Next JS Configurations (next.config.mjs)

> Redirect main root to /blog route
> 

```
redirects: async () => [
    {
        source: '/',
        destination: '/blog',
        permanent: true
    }
],
```

> For using images from outside
> 

```
images: {
        remotePatterns: [
            {
                protocol: 'http',
                port: '8000',
                hostname: 'localhost',
                pathname: '/api/static/**'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: '"avatars.githubusercontent.com"',
                pathname: '/**'
            },
        ]
    }
```

### How admin warned when he left post creating page

Browser warns admin to prevent lost changes when close tab or window or changes url.

```tsx
// This effect used for system doesn't let the user leave from the page and lost changes.
useEffect(() => {
  function beforeUnload(e: any) {
    e.preventDefault();
  }

  window.addEventListener("beforeunload", beforeUnload);
  window.addEventListener("close", beforeUnload);

  return () => {
    window.removeEventListener("beforeunload", beforeUnload);
    window.removeEventListener("close", beforeUnload);
  };
}, []);
```

### Debounced Search

When user stop typing it fetches results 500 milliseconds later. Thus this process will be responsive and effective.

```tsx
const [query, setQuery] = useState<string>('')

useEffect(() => {
  const debouncedSearch = setTimeout(() => {
    if (query) {
      setIsFetching(true)

      getPostSearchResults(query)
        .then((p) => setPosts(p))
        .catch((e) => setError(e))
        .finally(() => setIsFetching(false))
    } else {
      setPosts([])
    }
  }, 500)

  return () => clearTimeout(debouncedSearch)
}, [query])

...

<input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
/>
```

### Generating Dynamic Metadata and React Cache

Generated dynamic metadata for post. Cached post data that comes from api to prevent unnecessary data fetching.

```tsx
import { cache } from 'react'

type Props = {
    params: { id: string }
}

const fetchPost = cache(async (id: string) => await getPost(id))

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata)
: Promise<Metadata>
{
    const postId = params.id as string
    const post = await fetchPost(postId)

    return {
        title: post.title,
        keywords: post.tags.map(t => t.name),
        description: post.description
    }
}

export default async function PostPage({ params } : Props) {
...
try {
        const post = await fetchPost(postId)
...
```

## Header config for cors

```tsx
/** @type {import('next').NextConfig} */
const nextConfig = {
    ...
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "https://canerdemirci.vercel.app",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                    {
                        key: "Access-Control-Allow-Credentials",
                        value: "true",
                    },
                ],
            },
        ]
    },
    ...
};

export default nextConfig;

```

## Remote Pattern Configs For Images

```tsx
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                port: '8000',
                hostname: 'localhost',
                pathname: '/api/static/**'
            },
            {
                protocol: 'https',
                port: '',
                hostname: 'square-danyette-canerdemirci-63378b97.koyeb.app',
                pathname: '/api/static/**'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: '"avatars.githubusercontent.com"',
                pathname: '/**'
            },
        ]
    }
};

export default nextConfig;
```