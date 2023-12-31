// import ButtonEdit from '@/components/common/buttonEdit'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { db } from '@/lib/db'
import React, { FC } from 'react'
import OpenModal from '@/components/common/button/OpenModal'
import KambingDetailCard from '@/components/common/card/detail-kambing-card'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
// import { useModal } from "@/hooks/use-modal-store";

interface pageKandangId {
    params: {
        id_kambing: string
    }
}

const getDetailKambing = async (id_kambing: string) => {
    const response = await db.iotimageprocessing.findFirst({
        where: { id_kambing: id_kambing },
        select: {
            id: true,
            kambing: {
                select: {
                    id_kambing: true,
                    nama_kambing: true,
                    id_kandang: true,
                }
            }
        },
    })
    return response
}

const DetailKambing: FC<pageKandangId> = async ({ params }) => {

    const detailKambing = await getDetailKambing(params.id_kambing)

    // Redirect if user role is not "owner" or "pekerja"
    const session = await getServerSession(authOptions)
    if (session?.user.role !== "owner" && session?.user.role !== "pekerja") {
        redirect('/')
    }

    return (
        <>
            <h1 className='head-text text-left text-[#00A762] dark:text-light-2'>Hasil Prediksi</h1>
            <section className='mt-9 flex  md:flex-row flex-wrap gap-10 '>
                {detailKambing ? (
                    <KambingDetailCard
                        item={{
                            id_kambing: params.id_kambing,
                            id_kandang: detailKambing?.kambing?.id_kandang || "",
                            nama_kambing: detailKambing?.kambing?.nama_kambing || "",
                        }}
                    />
                ) : (
                    <div className="empty-data-message">No data available</div>
                )}
            </section>
        </>
    )
}

export default DetailKambing