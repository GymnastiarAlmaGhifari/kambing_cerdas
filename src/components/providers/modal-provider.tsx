"use client";

import { useEffect, useState } from "react";
import { CreateSensorModal } from "@/components/modals/creates/create-alat-modal";
import { CreateKandangModal } from "@/components/modals/creates/create-kandang-modal";
import { EditKandangModal } from "@/components/modals/updates/edit-kandang-modal";
import { CreateKambingModal } from "@/components/modals/creates/create-kambing-modal";
import { CreateNotifModal } from "@/components/modals/creates/create-notif-modal";
import { EditKambingModal } from "@/components/modals/updates/edit-kambing-modal";
import { TerimaModal } from "@/components/modals/iot/terima-iot-modal";
import { TolakModal } from "@/components/modals/iot/tolak-iot-modal";
import { DeleteSensorModal } from "@/components/modals/deletes/delete-alat-modal";
import { DeleteKandangModal } from "@/components/modals/deletes/delete-kandang-modal";
import { DeleteKambingModal } from "@/components/modals/deletes/delete-kambing-modal";

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
            <EditKambingModal />
            <CreateKambingModal />
            <CreateNotifModal />
            <TerimaModal />
            <TolakModal />
            <DeleteSensorModal />
            <DeleteKandangModal />
            <DeleteKambingModal />
        </>
    )
}