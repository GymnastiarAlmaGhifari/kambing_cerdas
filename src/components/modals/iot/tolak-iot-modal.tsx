"use client";

import axios, { AxiosError } from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const TolakModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();

    // set error string
    const [error, setError] = useState<string | null>(null);

    const isModalOpen = isOpen && type === "tolak";

    const { terimaData } = data;

    const onSubmit = async () => {
        const responsePost = {
            id_kambing: terimaData?.id_kambing,
            usia: terimaData?.usia,
            bobot: terimaData?.bobot,
            deskripsi: terimaData?.deskripsi,
            imagePath: terimaData?.image_path,
        };

        const responseDelete = {
            id: terimaData?.id,
            id_kambing: terimaData?.id_kambing,
            usia: terimaData?.usia,
        };

        try {
            console.log(terimaData?.id_kambing);
            console.log(responsePost);



            const deleteResponse = await axios.delete(`/api/estimate/tolak`, { data: responseDelete });
            console.log(deleteResponse);


            queryClient.invalidateQueries(["estimate"]);

            onClose();

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                // Jika ini AxiosError, itu berarti itu adalah respons dari server
                const axiosError = error as AxiosError<{ message: string }>;
                setError(axiosError.response?.data.message || "Terjadi kesalahan");
            } else {
                // Jika ini bukan AxiosError, mungkin itu adalah kesalahan jaringan atau yang lain
                setError("Terjadi kesalahan");
            }
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-neutral-100 dark:bg-dark-5 dark:text-light-2 text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Tolak Perhitungan iot dengan nama {terimaData?.nama}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription
                    className="px-6 pb-8 text-neutral-500 dark:text-neutral-400 text-center">
                    Apakah Anda yakin ingin menolak perhitungan bobot ini?
                </DialogDescription>

                <DialogFooter className="px-6 pb-8">
                    <Button
                        type="button"
                        variant="default"
                        className="bg-neutral-800 hover:bg-neutral-800/80 text-light-2"
                        onClick={handleClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="themeMode"
                        onClick={onSubmit}
                    >
                        Tolak
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
