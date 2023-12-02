"use client"
import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Landing from '@/components/shared/Landing';

export default function Home() {
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        session?.user ? (
          // logout button 
          <div className='flex flex-row gap-3'>
            <button
              className={buttonVariants()}
              onClick={() => signOut()}
            >
              Sign out
            </button>
            {
              session?.user.role === 'owner' || session?.user.role === 'pekerja' ? (
                <button
                  className={buttonVariants()}
                  onClick={() => {
                    router.push('/dashboard')
                  }}
                >
                  dashboard
                </button>
              ) : (
                <>
                </>
              )
            }
          </div>
        ) : (

          <Link className={buttonVariants()} href='/api/auth/signin'>
            Sign in
          </Link>
        )
      }
      <Landing />
    </main>
  )
}
