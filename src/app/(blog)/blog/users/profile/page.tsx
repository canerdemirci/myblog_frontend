import { authOptions } from "@/utils/auth"
import { routeMap } from "@/utils/routeMap"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getUserByEmail } from "@/blog_api_actions/user_repo"
import UserForm from "./UserForm"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect(routeMap.blog.users.signin)
    }

    const user = await getUserByEmail(session.user!.email)
    
    return (
        <main>
            <UserForm user={user} />
        </main>
    )
}