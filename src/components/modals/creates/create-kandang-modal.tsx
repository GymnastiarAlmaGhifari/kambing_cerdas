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
import { Label } from "@/components/ui/label";


const formSchema = z.object({
    nama_kandang: z.string()
        .min(3, { message: "Kandang name must be at least 3 characters long" })
        .refine(value => !!value.trim(), {
            message: "Kandang name is required and must not be empty",
            path: [],
        }),
    // gambar_kandang dengan typedata file
    gambar_kandang: z.any(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateKandangModal = () => {
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();
    // menampung state error

    const isModalOpen = isOpen && type === "createKandang";

    const [error, setError] = useState<string | null>(null);


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
            const formData = new FormData();
            formData.append("nama_kandang", data.nama_kandang);
            formData.append("file", data.gambar_kandang);

            const response = await axios.post("/api/kandang", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });



            console.log(response.data);

            queryClient.invalidateQueries(["kandang"]);
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
            setValue("gambar_kandang", file);
        } else {
            setPreviewImage(null);
        }
    };


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
                        <Label htmlFor="nama_kandang">
                            Nama Kandang
                        </Label>
                        <Input
                            id="nama_kandang"
                            className="dark:bg-[#515151] bg-neutral-200 outline-none border-none focus:border-none"
                            type="text"
                            placeholder="Nama Kandang"
                            {...register("nama_kandang")}
                        />
                        {errors.nama_kandang && (
                            <div>{errors.nama_kandang.message}</div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="gambar_kandang" className="text-lg">
                            Gambar Kandang
                        </label>
                        <input
                            id="gambar_kandang"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            {...register("gambar_kandang")}
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
                            htmlFor="gambar_kandang"
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
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="themeMode"
                        >
                            Buat Kandang Baru
                        </Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog >

    );
}
