"use client"
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

import { HandMetal } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { signOut, useSession } from 'next-auth/react';
import Logout from './Logout';
import { db } from "@/lib/db";
import { SocketIndicator } from '../common/Socket-indicator';


const Navbar = () => {
  const { data: session } = useSession();


  // const session = await getServerSession(authOptions);
  return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <HandMetal />
        </Link>
        {
          session?.user ? (
            <Logout />
          ) : (
            <Link className={buttonVariants()} href='/api/auth/signin'>
              Sign in
            </Link>
          )
        }

        <div className="">
          <SocketIndicator />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
