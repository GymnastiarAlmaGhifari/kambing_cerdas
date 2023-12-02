"use client"

import { FC, useEffect, useState } from 'react'

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { sidebarLinksPekerja, sidebarLinksOwner } from "@/constants";
import Logout from './Logout';
import { signOut, useSession } from 'next-auth/react';
import { Button, buttonVariants } from '../ui/button';

interface LeftsidebarProps {
    // title?: string
}

const Leftsidebar: FC<LeftsidebarProps> = ({ }) => {
    const { data: session } = useSession();
    const pathname = usePathname();

    const router = useRouter();
    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: '/',
            // Do not redirect immediately; handle it manually
        });
        // Redirect to the sign-in page or any other desired page
    };



    // const { userId } = useAuth();
    return (
        <section className='custom-scrollbar leftsidebar greens-gradient dark:darks-gradient'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                {
                    session?.user.role === 'owner' ?
                        <>
                            {sidebarLinksOwner.map((link) => {
                                const isActive =
                                    (pathname?.includes(link.route) && link.route.length > 1) ||
                                    pathname === link.route;

                                // if (link.route === "/profile") link.route = `${link.route}/${userId}`;
                                return (
                                    <Link
                                        href={link.route}
                                        key={link.label}
                                        className={`leftsidebar_link ${isActive && "bg-[#01C577] dark:bg-red-500"}`}
                                    >
                                        <Image
                                            src={link.imgUrl}
                                            alt={link.label}
                                            width={24}
                                            height={24}
                                        />

                                        <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                                    </Link>
                                );
                            })}
                        </>
                        :
                        <>
                            {sidebarLinksPekerja.map((link) => {
                                const isActive =
                                    (pathname?.includes(link.route) && link.route.length > 1) ||
                                    pathname === link.route;

                                // if (link.route === "/profile") link.route = `${link.route}/${userId}`;
                                return (
                                    <Link
                                        href={link.route}
                                        key={link.label}
                                        className={`leftsidebar_link ${isActive && "bg-[#01C577] dark:bg-red-500"}`}
                                    >
                                        <Image
                                            src={link.imgUrl}
                                            alt={link.label}
                                            width={24}
                                            height={24}
                                        />

                                        <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                                    </Link>
                                );
                            })}
                        </>

                }




            </div>

            <div className='mt-10 px-6'>

                <button
                    onClick={handleLogout}
                    className='flex cursor-pointer gap-4 p-4'>
                    <Image
                        src='/assets/logout.svg'
                        alt='logout'
                        width={24}
                        height={24}
                    />

                    <p className='text-light-2 max-lg:hidden'>Logout</p>
                </button>


            </div>

            <div className='mt-10 px-6'>

            </div>
        </section>
    )
}

export default Leftsidebar