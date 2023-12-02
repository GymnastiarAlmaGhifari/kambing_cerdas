'use client'

import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"



export default function Provider({
    children,
    session,

}: {
    children: React.ReactNode
    session: any
}): React.ReactNode {


    const router = useRouter()
    // const { data: sessionData } = useSession();

    // jika tidak ada session arah kan ke /
    if (!session) {
        router.push('/')
        return null
    }



    return <SessionProvider session={session}>
        {children}
    </SessionProvider>
}