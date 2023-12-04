'use client'

import { signOut } from "next-auth/react"
import { Button } from '../../ui/button'

const Logout = () => {
    return (
        <Button onClick={() => signOut({
            redirect: true,
        })} variant={"destructive"}>
            Sign Out
        </Button>
    )
}

export default Logout