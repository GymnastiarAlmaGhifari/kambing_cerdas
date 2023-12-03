"use client"

import OpenModal from "@/components/common/button/OpenModal";
import AlatCard from "@/components/common/card/alat-card"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";


const Alat = () => {
    return (
        <div>
            <h1 className='head-text text-left text-[#00A762] dark:text-light-2'>Kandang</h1>

            <div className="flex flex-row items-center justify-start my-10">
                <OpenModal isOpen={'createSensor'} text='Tambah Sensor' icon={<Plus size={28} strokeWidth={3}

                />} />
            </div>

            <AlatCard />
        </div>
    )
}

export default Alat