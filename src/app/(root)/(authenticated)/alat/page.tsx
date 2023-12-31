import Alat from "@/components/shared/Authenticated/Alat"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const page = async () => {

    const session = await getServerSession(authOptions)

    // jika session?.user.role = "user" alihakan ke path /
    if (session?.user.role !== "owner" && session?.user.role !== "pekerja") {
        redirect('/')
    }
    return (
        <div>
            <Alat />
        </div>
    )
}

export default page