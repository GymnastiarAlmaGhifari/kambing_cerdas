"use client";

import { useEffect, useState } from "react";
import { CreateSensorModal } from "@/components/modals/creates/create-sensor-modal";
import { CreateKandangModal } from "@/components/modals/creates/create-kandang-modal";
import { EditKandangModal } from "@/components/modals/updates/edit-kandang-modal";
import { CreateKambingModal } from "@/components/modals/creates/create-kambing-modal";
import { CreateNotifModal } from "@/components/modals/creates/create-notif-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateSensorModal />
            <CreateKandangModal />
            <EditKandangModal />
            <CreateKambingModal />
            <CreateNotifModal />
        </>
    )
}