"use client"
import React, { FC } from 'react';
import { useModal } from "@/hooks/use-modal-store";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import KandangCard from '@/components/common/card/kandang-card';
import { Kandang as KandangProps } from "@prisma/client";


const Kandang = () => {
    // const kandangData = await getKandang()
    const { data: kandangData, isLoading, isError } = useQuery({
        queryKey: ['kandang'],
        queryFn: async () => {
            const { data } = await axios.get('/api/kandang');
            return data
        }
    })

    const { onOpen } = useModal();


    return (
        <>
            <h1 className='head-text text-left '>Kandang</h1>

            <button className='text-white' onClick={() => onOpen("createKandang")}>Open Modal</button>

            <section className='mt-9 flex  md:flex-row flex-wrap gap-10 '>
                {isLoading ? (
                    <p className='text-white'>Loading...</p>
                ) : isError ? (
                    <p>Error: Failed to fetch data</p>
                ) : (
                    kandangData.map((item: KandangProps) => (
                        // map data dan pindah ke page kandang/[kandangId]
                        <KandangCard
                            key={item.id_kandang}
                            item={item}
                        />
                    ))
                )}
            </section>
        </ >

    );
};

export default Kandang;


// interface Kandang {
//     id_kandang: string,
//     nama_kandang?: string,
//     gambar_kandang?: string,
// }
