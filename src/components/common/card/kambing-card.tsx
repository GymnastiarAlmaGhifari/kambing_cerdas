"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { useModal } from '@/hooks/use-modal-store';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kambing as KambingProps } from "@prisma/client";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


interface KambingCardProps {
    item: any;
}


const KambingCard: FC<KambingCardProps> = ({ item }) => {

    const { data: kambingData, isLoading, isError } = useQuery({
        queryKey: ['kambing'],
        queryFn: async () => {
            const { data } = await axios.get(`/api/kandang/${item.id_kandang}/kambing`);
            return data
        }
    })

    const { onOpen } = useModal();

    return (
        <>
            <div className="flex w-full flex-col rounded-xl bg-light-2 dark:bg-dark-2">
                <div className='dark:text-white text-neutral-800 my-10'>
                    <div className="w-full px-10">
                        <h1 className='text-heading2-semibold text-dark-2 dark:text-light-2'>{item?.nama_kandang}</h1>
                    </div>
                    <div className="w-full h-[1px] bg-red-500 mt-3"></div>
                    <div className="flex flex-col gap-5 mx-10">
                        {isLoading ? (
                            <p className='text-white'>Loading...</p>
                        ) : isError ? (
                            <p>Error: Failed to fetch data</p>
                        ) : (
                            kambingData.map((items: KambingProps) => (
                                <div key={items.id_kambing} className='flex flex-row gap-5 relative mt-10'>
                                    <div className="relative w-28 h-28">
                                        <Image
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-fit rounded-xl border-2 border-red-500"
                                            src={"/assets/default.jpeg"}
                                            alt={items.nama_kambing}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <h1>
                                            {items.nama_kambing}
                                        </h1>
                                        <h1>
                                            Berat Kambing: {items.bobot}
                                        </h1>
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

export default KambingCard;
