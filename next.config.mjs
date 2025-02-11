/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => [
        {
            source: '/',
            destination: '/blog',
            permanent: true
        }
    ],
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
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
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                port: '8000',
                hostname: 'localhost',
                pathname: '/api/static/**'
            },
            {
                protocol: 'http',
                port: '8000',
                hostname: '192.168.1.101',
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
