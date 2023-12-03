import PenggunaComponent from '@/components/shared/Authenticated/Pengguna'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'



const Pengguna = async () => {

    const session = await getServerSession(authOptions)

    // jika session?.user.role = "user" alihakan ke path /
    if (session?.user.role !== "owner") {
        if (session?.user.role === "pekerja") {
            redirect('/dashboard')
        }
        else {
            redirect('/')
        }
    }

    const sessionRole = session?.user.role

    return (
        <>
            <PenggunaComponent sessionRole={sessionRole} />
        </>
    )
}

export default Pengguna