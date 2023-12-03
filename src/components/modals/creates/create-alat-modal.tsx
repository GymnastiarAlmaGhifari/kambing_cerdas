"use client";

import axios, { AxiosError } from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";


const formSchema = z.object({
    id_kandang: z.string()

});

type FormData = z.infer<typeof formSchema>;

export const CreateSensorModal = () => {
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();
    // menampung state error

    const isModalOpen = isOpen && type === "createSensor";

    const [error, setError] = useState<string | null>(null);

    const { data: kandangData, isLoading: loading_kandang, isError: error_kandang } = useQuery({
        queryKey: ['kandang'],
        queryFn: async () => {
            const { data } = await axios.get('/api/kandang');
            return data
        }
    })

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        resetField,

        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log("Form submitted!", data.id_kandang);

        try {
            // const formData = new FormData();
            // formData.append("id_kandang", data.id_kandang);
            const responseData = {
                id_kandang: data.id_kandang,
            };


            const postResponse = await axios.post("/api/dht", responseData,);




            console.log(postResponse);

            queryClient.invalidateQueries(["alat"]);
            reset();
            onClose();
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                // If it's an AxiosError, it means it's a response from the server
                const axiosError = error as AxiosError<{ message: string }>;
                setError(axiosError.response?.data.message || "An error occurred");
            } else {
                // If it's not an AxiosError, it might be a network error or something else
                setError("An error occurred");
            }
            // You can choose to reset or perform other actions on error
            reset();
        }
    };


    const handleClose = () => {
        reset();
        onClose();
    }



    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-neutral-100 dark:bg-dark-5 dark:text-light-2 text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Tambah Kandang
                    </DialogTitle>

                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 px-6">
                    <div className="flex flex-col gap-2">
                        {/* Create a dropdown with options */}
                        {kandangData && !loading_kandang && !error_kandang && (
                            <div>
                                <label className="text-lg font-semibold">Select Kandang:</label>
                                <select
                                    {...register("id_kandang")} // Register the field with react-hook-form
                                    className="p-2 border rounded"
                                >
                                    {kandangData.map((kandang: any) => (
                                        <option
                                            key={kandang.id_kandang}
                                            value={kandang.id_kandang}
                                        >
                                            {kandang.nama_kandang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        {error && (
                            <div className="text-red-500">{error}</div>
                        )}
                    </div>
                    <DialogFooter className="px-6 pb-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="themeMode"
                        >
                            Buat Sensor Baru
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >

    );
}
