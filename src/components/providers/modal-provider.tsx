"use client";

import { useEffect, useState } from "react";
import { CreateSensorModal } from "@/components/modals/create-sensor-modal";
import { CreateKandangModal } from "@/components/modals/create-kandang-modal";
import { EditKandangModal } from "@/components/modals/edit-kandang-modal";

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
        </>
    )
}