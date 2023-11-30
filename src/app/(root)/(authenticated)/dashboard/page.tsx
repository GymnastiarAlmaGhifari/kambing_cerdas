"use client"
import Humidity from '@/components/common/chart/humidity';
import Temperature from '@/components/common/chart/temperature'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import Image from 'next/image';
import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = React.useState('sejam');

    const router = useRouter();
    // jika tidak ada session maka redirect ke login
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user.role !== 'owner' && session?.user.role !== 'pekerja') {
            router.push('/');

        }
    }, [session, router]);


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
            <div className="">
                {/* Add a select input for date options */}

                <h1 className='text-heading2-semibold'>Dashboard</h1>
                <label htmlFor="dateSelector" className="text-white">
                    Pilih Waktu:
                    <select
                        id="dateSelector"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="ml-2 p-2 rounded-md my-10"
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
                            <div className="text-heading3-bold">{item.kandang.nama_kandang}</div>
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
        </div>
    )
}

export default Dashboard
