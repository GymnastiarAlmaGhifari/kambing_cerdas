"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import KandangCard from '@/components/common/card/kandang-card';
import { Kandang as KandangProps } from "@prisma/client";
import OpenModal from '@/components/common/button/OpenModal';
import { Plus } from 'lucide-react';

import React from 'react'

const KandangComponent = () => {
    const { data: kandangData, isLoading, isError } = useQuery({
        queryKey: ['kandang'],
        queryFn: async () => {
            const { data } = await axios.get('/api/kandang');
            return data
        }
    })
    return (
        <>
            <h1 className='head-text text-left text-[#00A762] dark:text-light-2'>Kandang</h1>

            <div className="flex flex-row items-center justify-start my-10">
                <OpenModal isOpen={'createKandang'} text='Tambah Kandang' icon={<Plus size={28} strokeWidth={3} />} />
            </div>

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
        </>

    )
}

export default KandangComponent