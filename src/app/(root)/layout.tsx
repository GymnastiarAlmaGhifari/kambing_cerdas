import '@/styles/globals.css';
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Provider from '@/components/providers/auth-landing';
import { FC, ReactNode } from 'react';
import { ModalProvider } from '@/components/providers/modal-provider';
import { redirect } from 'next/navigation';


const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = async ({
  children,
}: {
  children: React.ReactNode
}) => {

  const session = await getServerSession(authOptions)


  return (
    <Provider session={session}>
      <html lang="en">
        <body className={inter.className}>{
          children
        }
        </body>
      </html>
    </Provider>

  )
}

export default RootLayout