"use client"

import Image from 'next/image'
import React, { FC } from 'react'
import { Kambing as KambingProps } from "@prisma/client";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import OpenModal from '../button/OpenModal';
import Link from 'next/link';


interface KambingCardProps {
    item: {
        id_kandang: string;
        nama_kandang: string;
        // Add other properties as needed
    };
}

const hitungUsia = (tanggalLahir: Date | null): string => {
    if (!tanggalLahir) {
        return 'Tidak diketahui';
    }

    const hariIni = new Date();
    const lahir = new Date(tanggalLahir);

    let usiaBulan = hariIni.getMonth() - lahir.getMonth() +
        (12 * (hariIni.getFullYear() - lahir.getFullYear()));

    const tahun = Math.floor(usiaBulan / 12);
    const bulan = usiaBulan % 12;

    return tahun > 0
        ? `${tahun} ${tahun === 1 ? 'tahun' : 'tahun'}${bulan > 0 ? ` ${bulan} ${bulan === 1 ? 'bulan' : 'bulan'}` : ''}`
        : `${bulan} ${bulan === 1 ? 'bulan' : 'bulan'}`;
};



const KambingCard: FC<KambingCardProps> = ({ item }) => {

    const { data: kambingData, isLoading, isError } = useQuery({
        queryKey: ['kambing'],
        queryFn: async () => {
            const { data } = await axios.get(`/api/kandang/${item.id_kandang}/kambing`);
            return data
        }
    })


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
                                            // src={items.gambar_kambing || "/assets/default.jpeg"}
                                            src={`/api/kandang/${item.id_kandang}/kambing/img?img=${items.gambar_kambing}`}
                                            alt={items.nama_kambing}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-wrap gap-2 lg:w-1/3">
                                        <h1 className='text-heading3-bold'>
                                            {items.nama_kambing}
                                        </h1>
                                        <div className="flex lg:flex-row flex-col gap-2 justify-between">
                                            <div className="flex flex-col">

                                                <h1>
                                                    tanggal lahir: {items.tanggal_lahir?.toString().split('T')[0]}
                                                </h1>
                                                <h1>
                                                    usia: {hitungUsia(items.tanggal_lahir)}
                                                </h1>
                                            </div>
                                            <div className="flex flex-col">
                                                <h1>
                                                    bobot bulan ini: {items.bobot}
                                                </h1>
                                                <h1>
                                                    rfid: {items.rfid || 'RFID Belum Terpasang'}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                    {/* button delete dan edit */}
                                    <div className="flex flex-col sm:flex-row gap-2 relative sm:absolute bottom-0 right-0 justify-end items-end ">
                                        <Link
                                            href={`/kandang/${item.id_kandang}/${items.id_kambing}`}
                                        >
                                            <Button
                                                variant={'themeMode'}
                                                size={'default'}
                                            >
                                                Detail
                                            </Button>
                                        </Link>
                                        <OpenModal isOpen={'editKambing'} text='Edit' icon={<Pencil size={20} strokeWidth={3} />}
                                            dataModal={{ idKandang: item.id_kandang, idKambing: items.id_kambing, imageKambing: items.gambar_kambing, namaKambing: items.nama_kambing, rfid: items.rfid, dateKambing: items.tanggal_lahir }}
                                            variant={'secondary'} className='w-full rounded-xl' />
                                        <OpenModal isOpen={'deleteKambing'} text='Delete' icon={<Trash2 size={20} strokeWidth={3} />}
                                            id_kambing={items.id_kambing}
                                            variant={'destructive'} className='w-full rounded-xl' />

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