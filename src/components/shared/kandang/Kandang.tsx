"use client"
import React, { FC } from 'react';
import { useModal } from "@/hooks/use-modal-store";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { Kandang as KandangProps } from "@prisma/client";
import Image from 'next/image';


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
        <div className="">
            {/* button open */}
            <button className='text-white' onClick={() => onOpen("createKandang")}>Open Modal</button>
            {/* <ButtonOpen /> */}
            <div>
                {/* <KandangCard /> */}


                {isLoading ? (
                    <p className='text-white'>Loading...</p>
                ) : isError ? (
                    <p>Error: Failed to fetch data</p>
                ) : (
                    kandangData.map((item: KandangProps) => (
                        // map data dan pindah ke page kandang/[kandangId]
                        <div key={item.id_kandang}>
                            <Link href={`/kandang/${item.id_kandang}`} className='text-white m-10'>
                                <h1>{item.id_kandang}</h1>
                                <h2>{item.nama_kandang}</h2>
                                {/* <Image width={100} height={100} className='w-10 h-10' src={item.gambar_kandang} alt={item.nama_kandang} /> */}
                            </Link>

                            {/* button edit */}
                            <button className='text-white bg-red-600'
                                onClick={() => onOpen("editKandang", { kandang: item })}>
                                edit kandang
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
};

export default Kandang;


// interface Kandang {
//     id_kandang: string,
//     nama_kandang?: string,
//     gambar_kandang?: string,
// }
