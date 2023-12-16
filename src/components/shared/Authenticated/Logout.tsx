'use client'

import { signOut } from "next-auth/react"
import { Button } from '../../ui/button'

const Logout = () => {
    return (
        <Button onClick={() => signOut({
            redirect: true,
            callbackUrl: "https://dombacerdas.gymnastiarag.my.id/"
        })} variant={"destructive"}>
            Sign Out
        </Button>
    )
}

export default Logout