"use client"

import Image from 'next/image'
import React, { FC } from 'react'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import OpenModal from '../button/OpenModal';
import Link from 'next/link';

interface Alat {
    id_dht22: string;
    kandang: {
        id_kandang: string;
        nama_kandang: string;
        gambar_kandang: string;
    }
}

const AlatCard = () => {

    const { data: alatData, isLoading, isError } = useQuery({
        queryKey: ['alat'],
        queryFn: async () => {
            const { data } = await axios.get(`/api/dht`);
            return data
        }
    })

    return (
        <>
            <div className="flex w-full flex-col rounded-xl bg-light-2 dark:bg-dark-2">
                <div className='dark:text-white text-neutral-800 my-10'>
                    <div className="w-full px-10">
                        <h1 className='text-heading2-semibold text-dark-2 dark:text-light-2'>Alat</h1>
                    </div>
                    <div className="w-full h-[1px] bg-red-500 mt-3"></div>
                    <div className="flex flex-col gap-5 mx-10">
                        {isLoading ? (
                            <p className='text-white'>Loading...</p>
                        ) : isError ? (
                            <p>Error: Failed to fetch data</p>
                        ) : (
                            alatData.map((items: Alat) => (
                                <div key={items.id_dht22} className='flex flex-row gap-5 relative mt-10'>
                                    <div className="relative w-28 h-28">
                                        <Image
                                            width={100}
                                            height={100}
                                            className="absolute top-0 left-0 w-full h-full object-fit"                        // src gambar jika tidak ada maka ambil default.jpeg dari folder public/assets
                                            src={`/api/kandang/img?img=${items.kandang.gambar_kandang}`}
                                            alt={items.kandang.nama_kandang}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-wrap gap-2 lg:w-1/3">
                                        <h1 className='text-heading3-bold'>
                                            {items.kandang.nama_kandang}
                                        </h1>
                                    </div>
                                    {/* button delete dan edit */}
                                    <div className="flex flex-col sm:flex-row gap-2 relative sm:absolute bottom-0 right-0 justify-end items-end ">
                                        <OpenModal isOpen={'deleteSensor'} text='Delete' icon={<Trash2 size={20} strokeWidth={3} />} alat={{
                                            id_dht22: items.id_dht22,
                                            id_kandang: items.kandang.id_kandang,
                                            nama_kandang: items.kandang.nama_kandang,
                                        }} variant={'destructive'} className='w-full rounded-xl' />

                                    </div>

                                    <div className="absolute w-full h-[1px] bottom-[-20px] left-0 bg-red-500 "></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AlatCard;