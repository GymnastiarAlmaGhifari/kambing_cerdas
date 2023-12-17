"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { FC, Fragment } from 'react'
import { useModal } from '@/hooks/use-modal-store';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from "@/hooks/use-query";
import { useCartEstimateSocket } from '@/hooks/use-estimate-socket';
import OpenModal from '../button/OpenModal';



interface EstimateCardProps {
    apiUrl: string;
}

const EstimateCard: FC<EstimateCardProps> = (
    {
        apiUrl
    }
) => {

    const queryKey = `estimate`;
    const addKey = `addEstimate`;

    const {
        data,
        status,
    } = useQuery({
        queryKey,
        apiUrl,
    });
    useCartEstimateSocket({ queryKey, addKey });

    return (
        <>

            {status === "loading" ? (
                <p>Loading...</p>
            ) : status === "error" ? (
                <p>Error loading data</p>
            ) : !data?.pages || data.pages.length === 0 ? (
                <div className="empty-data-message">Data masih kosong</div>
            ) : (
                <>
                    {data?.pages.map((page, pageIndex) => (
                        <Fragment key={pageIndex}>
                            {page.estimateData.map((item: any) => (
                                <>
                                    <div className="flex w-full flex-col rounded-xl lg:max-w-md 2xl:max-w-2xl bg-light-2 dark:bg-dark-2">
                                        <div className='dark:text-white text-neutral-800 m-10'>

                                            <div className="flex flex-row items-center justify-between">

                                                <h1 className='text-heading2-semibold'>{item.kambing?.nama_kambing}</h1>
                                                <h1 className='text-heading2-semibold'>
                                                    {item.bobot !== null ? item.bobot.toFixed(2) + ' Kg' : 'N/A'}, {(item.usia)} Bulan
                                                </h1>
                                            </div>
                                            <div className="relative w-full h-[230px] mt-5">
                                                <div className="absolute inset-[3px] border-solid border-secondary border-[3px] flex flex-col justify-center items-center overflow-hidden bg-cover z-[5] rounded-lg">
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        className="absolute top-0 left-0 w-full h-full object-fit"
                                                        src={`/api/iotimage/img?img=${item.imagePath}`}

                                                        alt={item.kambing?.nama_kambing}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-2 justify-around">
                                                <div className="">
                                                    <h1 className='text-heading4-medium'>
                                                        Prediksi Bobot Masa Depan
                                                    </h1>
                                                    <ul className='ml-0.5'>
                                                        {item.deskripsi.split('|').map((desc: string, index: number) => {
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
                                                <div className="flex flex-col gap-3">
                                                    {/* <h1>
                                                        <span className='text-heading4-medium'>
                                                            Standart
                                                        </span>  : {item.standart.toFixed(2) + ' Kg'}
                                                    </h1> */}
                                                    <h1>
                                                        <span className='text-heading4-medium'>
                                                            Keterangan Kondisi : {" "}
                                                        </span>
                                                        {item.keterangan}
                                                    </h1>
                                                </div>
                                            </div>
                                            <div className="flex flex-row justify-end items-center w-full mt-4 gap-3">
                                                <OpenModal
                                                    isOpen='terima'
                                                    variant={'themeMode'}
                                                    text='Terima'
                                                    terimaData={{
                                                        id: item.id,
                                                        nama: item.kambing?.nama_kambing,
                                                        id_kambing: item.kambing?.id_kambing, image_path: item.imagePath,
                                                        usia: item.usia, bobot: item.bobot,
                                                        deskripsi: item.deskripsi,
                                                        standart: item.standart,
                                                        keterangan: item.keterangan
                                                    }}
                                                />
                                                <OpenModal
                                                    isOpen='tolak'
                                                    variant={'themeMode'}
                                                    text='Tolak'
                                                    terimaData={{
                                                        id: item.id,
                                                        nama: item.kambing?.nama_kambing,
                                                        id_kambing: item.kambing?.id_kambing, image_path: item.imagePath,
                                                        usia: item.usia, bobot: item.bobot,
                                                        deskripsi: item.deskripsi
                                                    }}
                                                />

                                            </div>
                                        </div>
                                    </div>

                                </>
                            ))}
                        </Fragment >
                    ))}
                </>
            )}
        </>
    );
};

export default EstimateCard;