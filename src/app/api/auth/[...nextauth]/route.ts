import NextAuth, { AuthOptions } from "next-auth"

// Providers
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import { getUserByEmailAndPassword } from "@/blog_api/user_repo"
import { sha256 } from "@/utils"

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
      name: 'E-Posta ve parola',
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
      // If email and password include in the database return user otherwise return null
      async authorize(credentials, req) {
        if (credentials?.email && credentials?.password) {
          try {
            const hashedPassword = await sha256(credentials.password)
            return await getUserByEmailAndPassword(credentials.email, hashedPassword)
          } catch (_) {
            return null
          }
        }

        return null
      }
    })
  ],
  debug: false,
  callbacks: {
    // Add user id to the token
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id
        }
        
        return token
    },
    // Add user id to the session from the token
    async session({ session, token }) {
        if (session.user) session.user.id = token.id

        return session
    },
    // Always redirect to base url
    async redirect({ url, baseUrl }) {
      return process.env.NEXTAUTH_URL!
    }
  }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }