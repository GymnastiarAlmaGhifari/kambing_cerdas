import Humidity from '@/components/common/chart/humidity';
import Temperature from '@/components/common/chart/temperature'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import Image from 'next/image';
import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import DashboardComponent from '@/components/shared/Dashboard';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Dashboard = async () => {

    const session = await getServerSession(authOptions)

    // jika session?.user.role = "user" alihakan ke path /
    if (session?.user.role == "user") {
        redirect('/')
    }

    return (
        <>
            <DashboardComponent />
        </>
    )
}

export default Dashboard
