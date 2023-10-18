"use client"

import { FC } from 'react'
import Image from "next/image";
import Link from "next/link";


interface TopbarProps {
    // title?: string
}

const Topbar: FC<TopbarProps> = ({ }) => {
    return (
        <nav className='topbar'>
            <Link href='/dashboard' className='flex items-center gap-4'>
                <Image src='/logo.svg' alt='logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>Kambing Cerdas</p>
            </Link>

            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                    {/* <SignedIn>
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                                <Image
                                    src='/assets/logout.svg'
                                    alt='logout'
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn> */}
                </div>
            </div>
        </nav>
    )
}

export default Topbar