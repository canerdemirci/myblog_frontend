import { routeMap } from "@/app/(admin)/routeMap"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const session = await getServerSession()

    if (!session) {
        redirect(routeMap.blog.users.signin)
    }
    
    return (
        <div>Profile page</div>
    )
}