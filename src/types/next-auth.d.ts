// Expand User (for id, email, password) and JWT (for id) interfaces

import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        email: string
        createdAt: Date
        updatedAt: Date
        name?: string
        password?: string
        provider?: string
        providerId?: string
    }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: User
  }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string
    provider?: string
  }
}