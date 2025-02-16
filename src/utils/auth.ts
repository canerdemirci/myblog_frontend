import { AuthOptions } from "next-auth"

// Providers
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import { createUser, getUser, getUserByEmailAndPassword, getUserByProviderId }
    from "@/blog_api_actions/user_repo"
import { sha256 } from "@/utils"
import { JWT } from "next-auth/jwt"

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        CredentialsProvider({
            id: 'credentials',
            type: 'credentials',
            name: 'credentials',
            // For next-auth to create form inputs for signin
            credentials: {
                email: {
                    label: 'E-Posta',
                    placeholder: 'E-Posta',
                    type: 'text',
                },
                password: {
                    label: 'Parola',
                    type: 'password'
                }
            },
            // If user with this credentials exists on database return user otherwise return null
            async authorize(credentials) {
                if (credentials?.email && credentials?.password) {
                    try {
                        const hashedPassword = await sha256(credentials.password)
                        const user = await getUserByEmailAndPassword(
                            credentials.email, hashedPassword
                        )

                        return user
                    } catch (_) {
                        return null
                    }
                }

                return null
            }
        })
    ],
    // Session for one week
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60
    },
    useSecureCookies: process.env.NODE_ENV === 'production' ? true : false,
    debug: true,
    callbacks: {
        // Add user provider id and provider to the token
        async jwt({ token, user, account }: { token: JWT, user?: any, account?: any }) {
            if (user) {
                if (account && account.provider) {
                    token.id = account.providerAccountId
                    token.provider = account.provider
                } else if (user.id) {
                    token.id = user.id
                    token.provider = 'credentials'
                }
            }

            return token
        },
        // Fill session.user with db user with necessary information without password
        async session({ session, token }) {
            try {
                const dbUser = token.provider === 'credentials'
                    ? await getUser(token.id!)
                    : await getUserByProviderId(token.id!)

                if (dbUser && session.user) {
                    session.user.id = dbUser.id
                    session.user.email = dbUser.email
                    session.user.name = dbUser.name
                    session.user.image = dbUser.image
                    session.user.provider = dbUser.provider
                    session.user.providerId = dbUser.providerId
                }

                console.log(session)
                return session
            } catch (_) {
                throw new Error('Giriş başarısız bir hata oluştu!')
            }
        },
        // If the user is from providers then save it to the database.
        async signIn({ user, account }) {
            if (account?.provider === 'credentials') {
                return true
            }

            const email = user.email! as string
            const provider = account?.provider as string
            const providerId = account?.providerAccountId as string

            try {
                await getUserByProviderId(providerId)
            } catch (_) {
                const newUser = await createUser({
                    email: email,
                    name: user.name,
                    image: user.image!,
                    provider: provider,
                    providerId: providerId
                })
                user.id = newUser.id
            }

            return true
        },
        // Always redirect to base url
        async redirect() {
            return process.env.NEXTAUTH_URL!
        }
    }
}