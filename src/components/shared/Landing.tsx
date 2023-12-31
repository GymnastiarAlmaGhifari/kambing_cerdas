import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {};

const Landing = (props: Props) => {
  const [isMenuOpen, setIsOpenMenu] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();


  const toggleMenu = () => {
    setIsOpenMenu(!isMenuOpen);
    console.log(isMenuOpen);
  };



  useEffect(() => {
    const handleResize = () => {
      // Menyembunyikan menu jika lebar layar lebih dari 768px
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsOpenMenu(false);
      }
    };

    // Menambah event listener untuk menangkap perubahan lebar layar
    window.addEventListener("resize", handleResize);

    // Membersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]); // Bergantung pada nilai isOpen

  return (
    <>
      <div className=" relative h-screen">
        <section className="absolute h-screen w-full flex flex-col">
          <nav className="flex items-center justify-between w-full py-4 sticky top-0 backdrop-blur-lg px-16 text-light-1">
            {/* <div className="w-full flex justify-between text-light-1 items-center px-16"> */}
            <div className="flex gap-2 items-center w-fit">
              <div className="w-10 h-10 md:w-20 md:h-20" style={{ backgroundImage: 'url(/kumo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              </div>
              <div className="flex flex-col">
                <p>Domba Cerdas</p>
                <p>Sarang Farm</p>
              </div>
            </div>
            <div className="relative md:hidden">
              <div onClick={toggleMenu} className="md:hidden">
                <Image
                  alt="hamburger"
                  src="/assets/menu.svg"
                  width={40}
                  height={40}
                />
              </div>
              {isMenuOpen && (
                <ul className="absolute backdrop-blur-lg border top-[50px] rounded-md right-0 flex flex-col w-[200px] gap-5 justify-end w-full text-light-1 py-4 md:hidden">
                  <li className="text-body-semibold px-4">Tentang Kami</li>
                  <li className="text-body-semibold px-4">Contact</li>
                  <li className="px-4">
                    {
                      session?.user ? (
                        // logout button 
                        <Button
                          onClick={() => signOut(
                            { callbackUrl: 'https://dombacerdas.gymnastiarag.my.id/' }
                          )}
                          variant="destructive" className="w-full">
                          Sign out
                        </Button>
                      ) : (
                        <Button
                          variant="destructive" className="w-full" >
                          <Link href='/api/auth/signin'>
                            Sign in
                          </Link>
                        </Button>
                      )
                    }
                  </li>
                </ul>
              )}
            </div>
            <ul className=" hidden md:flex absolute backdrop-blur-lg md:backdrop-blur-0 border md:border-none rounded-md right-0 w-[200px] md:flex-row gap-2 justify-end w-full items-center text-light-1 py-4">
              <li className="text-body-semibold px-4">Tentang Kami</li>
              <li className="text-body-semibold px-4">Contact</li>
              <li className="px-4">
                {
                  session?.user ? (
                    // logout button 
                    <Button
                      onClick={() => signOut(
                        { callbackUrl: 'https://dombacerdas.gymnastiarag.my.id/' }
                      )}
                      variant="destructive" className="w-full">
                      Sign out
                    </Button>
                  ) : (
                    <Button
                      variant="destructive" className="w-full" >
                      <Link href='sign-in'>
                        Sign in
                      </Link>
                    </Button>
                  )
                }
              </li>
            </ul>
            {/* </div> */}
          </nav>
          <header className="text-light-1 h-full px-16">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <h1 className="text-heading1-bold lg:text-[80px] font-bold">
                Modern Farm
              </h1>
              <div className="flex flex-col gap-2">
                <p className="md:w-[500px]">
                  Smart Farm merupakan website pemantauan peternakan cerdas
                  dengan menggunakan berbagai sensor untuk meningkatkan
                  efisiensi peternakan kambing.
                </p>
                {
                  session?.user ? (
                    // logout button 
                    <div className='flex flex-row gap-3'>
                      <Button
                        onClick={() => signOut(
                          { callbackUrl: 'https://dombacerdas.gymnastiarag.my.id/' }
                        )} variant="destructive" className="w-fit">
                        Sign out
                      </Button>
                      {
                        session?.user.role === 'owner' || session?.user.role === 'pekerja' ? (
                          <Button
                            variant="destructive" className="w-fit"
                            onClick={() => {
                              router.push('/dashboard')
                            }}
                          >
                            dashboard
                          </Button>) : (
                          <>
                          </>
                        )
                      }
                    </div>
                  ) : (
                    <Button
                      variant="destructive" className="w-fit" >
                      <Link href='sign-in'>
                        Sign in
                      </Link>
                    </Button>
                  )
                }
              </div>
            </div>
          </header>
        </section>
        <div className="w-full h-full bg-dark-4 overflow-clip relative z-[-1]">
          {/* <Image
          alt="gambar domba"
          src="/assets/illustration.png"
          height={1000}
          width={1000}
          className="w-full h-full absolute object-cover overflow-clip  z-[-1]"
        /> */}
        </div>
      </div >
      <div className="px-16 py-12 bg-black text-light-1 flex flex-col lg:flex-row gap-10">
        <section className="flex flex-col gap-4 w-full">
          <h1 className="text-heading2-bold md:text-heading1-bold">
            Tentang Kami
          </h1>
          <p className="md:w-[500px]">
            Smart Farm merupakan website pemantauan peternakan cerdas dengan
            menggunakan berbagai sensor untuk meningkatkan efisiensi peternakan
            kambing.
          </p>
        </section>
        <section className="flex flex-col gap-4 lg:w-1/2">
          <h1 className="text-heading2-bold md:text-heading1-bold">
            Contact & Sosmed
          </h1>
          <div className="flex flex-col gap-3">
            <div className="flex relative items-center">
              <Input type="email" className="bg-[#262626] h-16 border-none" />
              <div className="flex justify-center px-4 absolute right-0 border-l h-full">
                <Image alt="" src="/assets/google.svg" width={40} height={40} />
              </div>
            </div>
            <div className="flex relative items-center">
              <Input type="email" className="bg-[#262626] h-16 border-none" />
              <div className="flex justify-center px-4 absolute right-0 border-l h-full">
                <Image
                  alt=""
                  src="/assets/facebook.svg"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <div className="flex relative items-center">
              <Input type="email" className="bg-[#262626] h-16 border-none" />
              <div className="flex justify-center px-4 absolute right-0 border-l h-full">
                <Image alt="" src="/assets/phone.svg" width={40} height={40} />
              </div>
            </div>
            <div className="flex relative items-center">
              <Input type="email" className="bg-[#262626] h-16 border-none" />
              <div className="flex justify-center px-4 absolute right-0 border-l h-full">
                <Image
                  alt=""
                  src="/assets/twitter.svg"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;
