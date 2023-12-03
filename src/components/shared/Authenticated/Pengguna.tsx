"use client"

import OpenModal from "@/components/common/button/OpenModal"
import UserCard from "@/components/common/card/user-card"
import { ChevronDown, Plus } from "lucide-react"
import { FC, useCallback, useState } from "react"

interface PenggunaProps {
    sessionRole: string
}

const PenggunaComponent: FC<PenggunaProps> = ({
    sessionRole
}) => {

    const [selectedRole, setSelectedRole] = useState("pekerja");

    const handleRoleChange = useCallback((event: any) => {
        setSelectedRole(event.target.value);
    }, []);

    return (
        <>

            <h1 className='head-text text-left text-[#00A762] dark:text-light-2'>Data User</h1>

            <div className="flex flex-row  bg-reds-gradient items-center justify-center w-[100px] gap-1 rounded-lg my-10">
                <select
                    id="dateSelector"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="py-2 pl-1 rounded-md dark:text-light-2 text-[#00A762] appearance-none focus:outline-none bg-transparent"
                >
                    <option className="bg-red-600" value="pekerja">pekerja</option>
                    <option className="bg-red-600" value="owner">owner</option>
                    <option className="bg-red-600" value="user">user</option>
                </select>
                <ChevronDown />
            </div>
            <section className='mt-9 flex  md:flex-row flex-wrap gap-10 '>
                <UserCard
                    role={selectedRole}
                />
            </section>
        </>
    )
}

export default PenggunaComponent