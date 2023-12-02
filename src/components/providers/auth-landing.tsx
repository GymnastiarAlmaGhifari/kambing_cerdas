'use client'

import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/navigation"


export default function Provider({
    children,
    session
}: {
    children: React.ReactNode
    session: any
}): React.ReactNode {

    return <SessionProvider session={session}>
        {children}
    </SessionProvider>
}