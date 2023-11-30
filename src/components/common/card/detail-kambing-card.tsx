"use client"

import Image from 'next/image'
import React, { FC } from 'react'
import { IOTImageProcessing as iotProcess } from "@prisma/client";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import OpenModal from '../button/OpenModal';
import Link from 'next/link';


interface KambingDetailCardProps {
    item: {
        id_kandang: string;
        id_kambing: string;
        nama_kambing: string;
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



const KambingDetailCard: FC<KambingDetailCardProps> = ({ item }) => {

    const { data: kambingDetailData, isLoading, isError } = useQuery({
        queryKey: ['kambingDetail'],
        queryFn: async () => {
            const { data } = await axios.get(`/api/kandang/${item.id_kandang}/kambing/${item.id_kambing}`)
            return data
        }
    })

    const calculateNextMonth = (date: Date): Date => {
        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
    };

    return (
        <>
            <div className="flex w-full flex-col rounded-xl bg-light-2 dark:bg-dark-2">
                <div className='dark:text-white text-neutral-800 my-10'>
                    <div className="w-full px-10">
                        <h1 className='text-heading2-semibold text-dark-2 dark:text-light-2'>{item?.nama_kambing}</h1>
                    </div>
                    <div className="w-full h-[1px] bg-red-500 mt-3"></div>
                    <div className="flex flex-col gap-5 mx-10">
                        {isLoading ? (
                            <p className='text-white'>Loading...</p>
                        ) : isError ? (
                            <p>Error: Failed to fetch data</p>
                        ) : (
                            kambingDetailData.map((items: iotProcess) => (
                                <div key={items.id} className='flex md:flex-row flex-col gap-5 relative mt-10'>
                                    <div className="relative w-64 h-64">
                                        <Image
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-fit rounded-xl border-2 border-red-500"
                                            // src={items.gambar_kambing || "/assets/default.jpeg"}
                                            src={`/api/iotimage/img?img=${items.imagePath}`}
                                            // src={`/api/kandang/${item.id_kandang}/kambing/${item.id_kambing}/img?img=${items.imagePath}`}

                                            alt={item.nama_kambing}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-wrap gap-2 lg:w-1/2">
                                        <h1 className='text-heading3-bold'>
                                            {items.bobot !== null ? items.bobot.toFixed(2) + ' Kg' : 'N/A'}, {(items.usia)} Bulan
                                        </h1>
                                        <div className="flex lg:flex-row flex-col gap-2 justify-between text-xl">
                                            <div className="flex flex-col">
                                                <h1 className='text-heading4-medium'>
                                                    Prediksi Bobot Masa Depan
                                                </h1>
                                                <ul className='ml-0.5'>
                                                    {items.deskripsi?.split('|').map((desc: string, index: number) => {
                                                        const [bulan, nilai] = desc.trim().split(':');
                                                        const parsedNilai = parseFloat(nilai);

                                                        if (isNaN(parsedNilai)) {
                                                            return null; // or handle the error in another way
                                                        }

                                                        return (
                                                            <li key={index}>
                                                                {`${bulan}: ${parsedNilai.toFixed(2)}`}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="flex flex-col">
                                                {/* lakukan pengukuran bobot pada */}
                                                <h1>
                                                    Pada{' '}
                                                    <span className='text-emerald-600'>
                                                        {calculateNextMonth(new Date(items.createdAt)).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </span> Lakukan pengukuran bobot lagi
                                                </h1>
                                            </div>
                                        </div>

                                    </div>
                                    {/* button delete dan edit */}


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

export default KambingDetailCard;