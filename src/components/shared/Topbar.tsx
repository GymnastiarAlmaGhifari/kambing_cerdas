"use client"

import { FC, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from '../common/ThemeSetting';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface TopbarProps {
    // title?: string
}

const Topbar: FC<TopbarProps> = ({ }) => {

    const router = useRouter();
    const pathname = usePathname();




    return (
        <nav className='topbar '>
            <Link href='/dashboard' className='flex items-center gap-4'>
                <Image src='/kumo.png' alt='logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>Domba Cerdas</p>
            </Link>


            <div className='flex items-center gap-1'>
                <ModeToggle />
                <div className='block md:hidden'>
                </div>
            </div>
        </nav>
    )
}

export default Topbar