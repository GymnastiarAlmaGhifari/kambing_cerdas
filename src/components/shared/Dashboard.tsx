"use client"
import React from 'react'

import Humidity from '@/components/common/chart/humidity';
import Temperature from '@/components/common/chart/temperature'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import Image from 'next/image';
import { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const DashboardComponent = () => {

    const [selectedDate, setSelectedDate] = React.useState('sejam');
    const { data: session } = useSession();





    const handleDateChange = useCallback((event: any) => {
        setSelectedDate(event.target.value);
    }, []);
    const { data: kandangDashboard, isLoading, isError } = useQuery({
        queryKey: ['kandangDashbaord'],
        queryFn: async () => {
            const { data } = await axios.get('/api/dht');
            return data
        }
    })


    return (
        <div className='text-white '>
            <h1 className='text-heading2-semibold dark:text-light-2 text-[#00A762] '>Dashboard</h1>
            <h1>
                {session?.user.role}
            </h1>
            <label htmlFor="dateSelector" className="dark:text-light-2 text-[#00A762]">
                Pilih Waktu:
                <select
                    id="dateSelector"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="ml-2 p-2 rounded-md my-10 dark:text-light-2 text-[#00A762]"
                >
                    <option value="sejam">Setiap Jam</option>
                    <option value="sehari">Setiap Hari</option>
                    <option value="seminggu">Setiap Minggu</option>
                    <option value="sebulan">Setiap     Bulan</option>
                </select>
            </label>
            {isLoading ? (
                <p className='text-white'>Loading...</p>
            ) : isError ? (
                <p>Error: Failed to fetch data</p>
            ) : (
                kandangDashboard.map((item: any) => (
                    // map data dan pindah ke page kandang/[kandangId]
                    <div key={item.id_dht22}>
                        <div className="text-heading3-bold dark:text-white text-neutral-800">{item.kandang.nama_kandang}</div>
                        <div className="my-5 flex flex-row gap-20">
                            <div className="relative xl:block hidden min-w-[450px] xl:[350px] 2xl:h-[305px]">
                                <div className="absolute inset-[3px] border-solid border-secondary border-[3px] flex flex-col justify-center items-center overflow-hidden bg-cover z-[5] rounded-lg">
                                    <Image
                                        width={100}
                                        height={100}
                                        className="absolute top-0 left-0 w-full h-full object-fit"                        // src gambar jika tidak ada maka ambil default.jpeg dari folder public/assets
                                        src={`/api/kandang/img?img=${item.kandang.gambar_kandang}`}
                                        alt={item.kandang.nama_kandang}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-5  lg:justify-around">
                                <Temperature
                                    apiUrl={`/api/sensor?id=${item.id_dht22}&date=${selectedDate}`}
                                    queryKey={`sensor-${item.id_dht22}-${selectedDate}`}
                                />
                                <Humidity
                                    apiUrl={`/api/sensor?id=${item.id_dht22}&date=${selectedDate}`}
                                    queryKey={`sensor-${item.id_dht22}-${selectedDate}`}
                                />
                            </div>
                        </div>
                    </div>
                ))
            )}

        </div>
    )
}

export default DashboardComponent