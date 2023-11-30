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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { Label } from "../../ui/label";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
    nama_kambing: z.string()
        .min(3, { message: "nama kambing minimal 3 huruf" })
        .refine(value => !!value.trim(), {
            message: "Kandang name is required and must not be empty",
            path: [],
        }),
    // RFID  input validation string and possible null values
    rfid: z.string().nullable(),
    // umurkambing date picker
    tanggal_lahir: z.date(),
    // gambar_kambing dengan typedata file
    gambar_kambing: z.any(),
});

type FormData = z.infer<typeof formSchema>;


export const CreateKambingModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();

    // set error string 
    const [error, setError] = useState<string | null>(null);

    // menampung state error

    const isModalOpen = isOpen && type === "createKambing";

    const { dataModal } = data;

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
        try {
            console.log(dataModal?.idKandang);

            console.log(data);
            const umurKambing = data.tanggal_lahir;
            const formattedDate = `${umurKambing.getFullYear()}-${String(umurKambing.getMonth() + 1).padStart(2, '0')}-${String(umurKambing.getDate()).padStart(2, '0')}`;

            console.log(formattedDate);

            const formData = new FormData();
            formData.append("nama_kambing", data.nama_kambing);
            formData.append("rfid", data.rfid || "");
            formData.append("tanggal_lahir", formattedDate);
            if (data.gambar_kambing instanceof File) {
                formData.append("file", data.gambar_kambing);
            }

            const response = await axios.post(`/api/kandang/${dataModal?.idKandang}/kambing`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response.data);

            queryClient.invalidateQueries(["kambing"]);
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

    const handleDateSelect = (selectedDate: Date) => {
        setValue('tanggal_lahir', selectedDate); // Set the selected date to the form field
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Juga, perbarui nilai form untuk gambar_kambing saat gambar berubah
            setValue("gambar_kambing", file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-neutral-100 dark:bg-dark-5 dark:text-light-2 text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Tambah Kambing
                    </DialogTitle>
                </DialogHeader>


                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 px-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nama_kambing">
                            Nama Kambing
                        </Label>
                        <Input
                            id="nama_kambing"
                            className="dark:bg-[#515151] bg-neutral-200 outline-none border-none focus:border-none"
                            type="text"
                            placeholder="Nama Kambing"
                            {...register("nama_kambing")}
                        />
                        {errors.nama_kambing && (
                            <div>{errors.nama_kambing.message}</div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="rfid">
                            Rfid
                        </Label>
                        <Input
                            id="rfid"
                            className="dark:bg-[#515151] bg-neutral-200 outline-none border-none focus:border-none"
                            type="text"
                            placeholder="RFID bisa dikosongkan"
                            {...register("rfid")}
                        />
                        {errors.rfid && (
                            <div>{errors.rfid.message}</div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="tanggal_lahir">
                            Umur Kambing
                        </Label>
                        <DatePicker onDateSelect={handleDateSelect} />

                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="gambar_kambing" className="text-lg">
                            Gambar Kandang
                        </label>
                        <input
                            id="gambar_kambing"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            {...register("gambar_kambing")}
                            onChange={handleImageChange}
                        />

                        <Image
                            src={previewImage || "/assets/default.jpeg"}
                            alt="Preview Image"
                            width={200}
                            height={200}
                            objectFit="cover"
                            className="rounded-md"
                        />

                        <Label
                            htmlFor="gambar_kambing"
                            className="flex flex-row mt-2 items-center justify-center text-light-2 gap-2 cursor-pointer p-2 bg-greens-gradient dark:bg-reds-gradient w-2/5 rounded-xl"
                        >
                            <UploadCloud size={24} />
                            <span>Upload Image</span>
                        </Label>
                        {/* set error from submiting data */}


                    </div>
                    <div className="flex flex-col gap-2">
                        {error && (
                            <div className="text-red-500">{error}</div>
                        )}
                    </div>
                    <DialogFooter className="px-6 pb-8">
                        <Button
                            type="button"
                            variant="default"
                            className="bg-neutral-800 hover:bg-neutral-800/80 text-light-2"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="themeMode"
                        >
                            Tambah Kambing
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
