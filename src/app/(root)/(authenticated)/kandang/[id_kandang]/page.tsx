// import ButtonEdit from '@/components/common/buttonEdit'
import KambingCard from '@/components/common/card/kambing-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { db } from '@/lib/db'
import React, { FC } from 'react'
import OpenModal from '@/components/common/button/OpenModal'
// import { useModal } from "@/hooks/use-modal-store";

interface pageKandangId {
    params: {
        id_kandang: string
    }
}

const getDetailKandang = async (id_kandang: string) => {
    const response = await db.kandang.findFirst({
        where: {
            id_kandang: id_kandang
        },
        select: {
            id_kandang: true,
            nama_kandang: true,
            gambar_kandang: true
        }
    })
    return response
}

const DetailKandang: FC<pageKandangId> = async ({ params }) => {

    const detailKandang = await getDetailKandang(params.id_kandang)

    console.log(detailKandang)

    // const { isOpen, onClose, type } = useModal();

    console.log(params.id_kandang)


    return (
        <>
            <h1 className='head-text text-left text-[#00A762] dark:text-light-2'>Kambing</h1>
            <div className="flex flex-row items-center justify-between my-10">
                <div className="">adwwad</div>
                <OpenModal isOpen={'createKambing'} text='Tambah Kambing' icon={<Plus size={28} strokeWidth={3} />} />
            </div>
            <section className='mt-9 flex  md:flex-row flex-wrap gap-10 '>
                <KambingCard
                    item={detailKandang}
                />
            </section>


        </>
    )
}

export default DetailKandang