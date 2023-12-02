"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { useModal } from '@/hooks/use-modal-store';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';



interface KandangCardProps {
    item: any;
}

const KandangCard: FC<KandangCardProps> = ({ item }) => {

    const { onOpen } = useModal();

    return (
        <>
            <div className="flex w-full flex-col rounded-xl  lg:max-w-md 2xl:max-w-2xl bg-light-2 dark:bg-dark-2">
                <div className='dark:text-white text-neutral-800 m-10'>
                    <div className="flex flex-row items-center justify-between">
                        <h1 className='text-heading2-semibold'>{item.nama_kandang}</h1>
                        <div className="flex flex-row gap-5">
                            <button
                                className="dark:hover:bg-red-400 dark:focus:bg-red-500 hover:bg-[#01C577] focus:bg-emerald-600 p-2 rounded-full"
                                onClick={() => onOpen("editKandang", { kandang: item })}
                            >
                                <Pencil />
                            </button>
                            <button
                                className="dark:hover:bg-red-400 dark:focus:bg-red-500 hover:bg-[#01C577] focus:bg-emerald-600 p-2 rounded-full"
                            // onClick={() => onOpen("editKandang", { kandang: item })}
                            >
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                    <div className="relative w-full h-[230px] mt-5">
                        <div className="absolute inset-[3px] border-solid border-secondary border-[3px] flex flex-col justify-center items-center overflow-hidden bg-cover z-[5] rounded-lg">
                            <Image
                                width={100}
                                height={100}
                                className="absolute top-0 left-0 w-full h-full object-fit"                        // src gambar jika tidak ada maka ambil default.jpeg dari folder public/assets
                                // src={item.gambar_kandang ? item.gambar_kandang : '/assets/default.jpeg'}
                                // src={`api/kandang/images/kandang/aadwd_607aad0a-35db-4cc1-9617-fec8edeb18d1.png`}
                                src={`/api/kandang/img?img=${item.gambar_kandang}`}
                                alt={item.nama_kandang}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center items-center w-full mt-4">
                        <Link
                            href={`/kandang/${item.id_kandang}`}
                        >
                            <Button
                                variant={'themeMode'}
                                size={'default'}
                            >
                                Masuk
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>

        </>

    )
}

export default KandangCard