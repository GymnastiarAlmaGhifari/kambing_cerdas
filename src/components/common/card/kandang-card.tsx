"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'
import { useModal } from '@/hooks/use-modal-store';



interface KandangCardProps {
    item: any;
}

const KandangCard: FC<KandangCardProps> = ({ item }) => {

    const { onOpen } = useModal();

    return (
        <>
            <Link href={`/kandang/${item.id_kandang}`} className='text-white m-10'>
                <h1>{item.id_kandang}</h1>
                <h2>{item.nama_kandang}</h2>

                <Image
                    width={100}
                    height={100}
                    className='w-10 h-10'
                    // src gambar jika tidak ada maka ambil default.jpeg dari folder public/assets
                    src={item.gambar_kandang ? item.gambar_kandang : '/assets/default.jpeg'}


                    alt={item.nama_kandang} />
            </Link>

            <button className='text-white bg-red-600'
                onClick={() => onOpen("editKandang", { kandang: item })}>
                edit kandang
            </button>
        </>

    )
}

export default KandangCard