import EstimateCard from '@/components/common/card/estimate-card';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'


const Estimate = async () => {
    const apiUrl = '/api/estimate'
    const session = await getServerSession(authOptions)

    // jika session?.user.role = "user" alihakan ke path /
    if (session?.user.role !== "owner" && session?.user.role !== "pekerja") {
        redirect('/')
    }
    return (
        <>
            <h1 className='head-text text-left text-[#00A762] dark:text-light-2'>Hasil Perhitungan dan Prediksi Bobot Domba dari Pyhton Webserver</h1>
            <section className='mt-9 flex  md:flex-row flex-wrap gap-10 '>
                <EstimateCard
                    apiUrl={apiUrl}
                />
            </section>
        </ >

    );
}

export default Estimate