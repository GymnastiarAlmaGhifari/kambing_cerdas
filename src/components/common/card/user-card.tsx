"use client"

import Image from 'next/image'
import React, { FC } from 'react'
import { User } from "@prisma/client";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import OpenModal from '../button/OpenModal';
import Link from 'next/link';
import { useSession } from 'next-auth/react';



interface UserCardProps {
    role: string;
}

const UserCard: FC<UserCardProps> = ({
    role
}) => {


    const queryClient = useQueryClient();
    const session = useSession();


    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['user', role], // Include role in the query key
        queryFn: async () => {
            const { data } = await axios.get(`/api/user?role=${role}`);
            return data
        }
    })

    // api to edit user mehthod post /api/user/role?={dari id yang di select}&role={dari role yang di select}
    const handleRoleChange = async (userId: string, newRole: string) => {
        if (userId && newRole) {
            await axios.post(`/api/user/role?id=${userId}&role=${newRole}`);
            // Refetch user data after updating role
            queryClient.invalidateQueries(['user', role]);
        }
    };

    return (
        <>
            <div className="flex w-full flex-col rounded-xl bg-light-2 dark:bg-dark-2">

                <div className='dark:text-white text-neutral-800 my-10'>
                    <div className="w-full px-10">
                        <h1 className='text-heading2-semibold text-dark-2 dark:text-light-2'>User Data</h1>
                    </div>
                    <div className="w-full h-[1px] bg-red-500 mt-3"></div>

                    <div className="flex flex-col gap-5 mx-10">
                        {isLoading ? (
                            <p className='text-white'>Loading...</p>
                        ) : isError ? (
                            <p>Error: Failed to fetch data</p>
                        ) : !userData || userData.length === 0 ? (
                            <p>No user data available</p>
                        ) : (
                            userData.user.map((items: User) => (
                                <div key={items.id} className='flex flex-col sm:flex-row gap-5 relative mt-10'>
                                    <div className="relative w-28 h-28">
                                        <Image
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-fit rounded-xl border-2 border-red-500"
                                            src={items.image || "/assets/default-profile.png"}
                                            alt="gambar pengguna"
                                        // src={`/api/kandang/${item.id_kandang}/kambing/img?img=${items.image}`}

                                        />
                                    </div>
                                    <div className="flex flex-col flex-wrap gap-2 lg:w-1/3">
                                        <div className="flex lg:flex-row flex-col gap-2 justify-between">
                                            <div className="flex flex-col">
                                                <h1>
                                                    username : {items.name || items.username}
                                                </h1>

                                            </div>
                                            <div className="flex flex-col">
                                                <h1>
                                                    email : {items.email}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                    {/* button delete dan edit */}
                                    <div className="flex flex-col sm:flex-row gap-2 relative sm:absolute bottom-0 right-0 justify-end items-end ">

                                        {session.data?.user.role == "owner" ?
                                            // buat select role
                                            <div className="flex flex-row  bg-red-600 items-center justify-center w-[100px] gap-1 rounded-lg my-10">
                                                <select
                                                    id="roleSelector"
                                                    value={items.role}
                                                    onChange={(event) => {
                                                        handleRoleChange(items.id, event.target.value);
                                                    }}
                                                    className="py-2 pl-1 rounded-md dark:text-light-2 text-[#00A762] appearance-none focus:outline-none bg-transparent"
                                                >
                                                    <option className="bg-red-600" value="pekerja">pekerja</option>
                                                    <option className="bg-red-600" value="owner">owner</option>
                                                    <option className="bg-red-600" value="user">user</option>
                                                </select>
                                                <ChevronDown />
                                            </div>

                                            : (session.data?.user.role == "pekerja" ?
                                                // jika role == pekerja
                                                <div className="flex flex-row  bg-reds-gradient items-center justify-center w-[100px] gap-1 rounded-lg my-10">
                                                    <select
                                                        id="roleSelector"
                                                        value={items.role}
                                                        onChange={(event) => {
                                                            // Call handleRoleChange directly when role is selected
                                                            handleRoleChange(items.id, event.target.value);
                                                        }}
                                                        className="py-2 pl-1 rounded-md dark:text-light-2 text-[#00A762] appearance-none focus:outline-none bg-transparent"
                                                    >
                                                        <option className="bg-red-600" value="pekerja">pekerja</option>
                                                        <option className="bg-red-600" value="user">user</option>
                                                    </select>
                                                    <ChevronDown />
                                                </div>
                                                : null
                                            )

                                        }


                                    </div>
                                </div>

                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCard;