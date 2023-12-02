import EstimateCard from '@/components/common/card/estimate-card';
import React from 'react'


const Estimate = () => {
    const apiUrl = '/api/estimate'

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