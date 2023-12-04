"use client"
import { useQuery } from "@/hooks/use-query";
import { useNotifSocket } from "@/hooks/use-notif-socket";

interface NotifikasiProps {
    apiUrl: string;
}

export const Notifikasi = ({
    apiUrl,
}: NotifikasiProps) => {
    const queryKey = `notifikasi`;
    const addKey = `addNotifikasi`;
    const updateKey = `updateNotifikasi`

    const {
        data,
        status,
    } = useQuery({
        queryKey,
        apiUrl,
    });
    useNotifSocket({ queryKey, addKey, updateKey });
    return (
        <>

        </>
    )
}

export default Notifikasi