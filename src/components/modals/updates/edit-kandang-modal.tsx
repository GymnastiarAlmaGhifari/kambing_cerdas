"use client";

import axios from "axios";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { Label } from "../../ui/label";

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

export const EditKandangModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();
    // menampung state error

    const isModalOpen = isOpen && type === "editKandang";



    const { kandang } = data;

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

    // ketika open modal, set value form reset field

    useEffect(() => {
        if (kandang) {
            reset()
            setValue("nama_kandang", kandang.nama_kandang);
        }

    }, [kandang, resetField, setValue, reset]);


    const onSubmit: SubmitHandler<FormData> = async (data) => {

        console.log(kandang?.id_kandang);
        console.log(data);

        const formData = new FormData();
        formData.append("nama_kandang", data.nama_kandang);
        if (data.gambar_kandang instanceof File) {
            formData.append("file", data.gambar_kandang);
        } else {
            // Use the existing file path
            formData.append("file", kandang?.gambar_kandang || "");
        }
        const response = await axios.put(`/api/kandang/${kandang?.id_kandang}`
            , formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // consol log
        console.log(response.data);

        queryClient.invalidateQueries(["kandang"]);
        onClose();

    };



    const handleClose = () => {
        // reset form
        // resetField("nama_kandang");
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

            // Juga, perbarui nilai form untuk gambar_kandang saat gambar berubah
            setValue("gambar_kandang", file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-neutral-100 text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit Kandang
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 px-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nama_kandang">
                            Nama Kandang
                        </Label>
                        <Input
                            id="nama_kandang"
                            className="bg-neutral-200 outline-none border-none focus:border-none"
                            type="text"
                            placeholder="Nama Kandang"
                            defaultValue={kandang?.nama_kandang ? kandang?.nama_kandang : ""}
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
                        {previewImage ? (
                            <Image
                                src={previewImage}
                                alt="Preview Image"
                                width={200}
                                height={200}
                                objectFit="cover"
                                className="rounded-md"
                            />
                        ) : (
                            <Image
                                // src={kandang?.gambar_kandang ? kandang?.gambar_kandang : '/assets/default.jpeg'}
                                src={`/api/kandang/img?img=${kandang?.gambar_kandang}`}
                                alt="Preview Image"
                                width={200}
                                height={200}
                                objectFit="cover"
                                className="rounded-md"
                            />
                        )}
                        <Label
                            htmlFor="gambar_kandang"
                            className="flex flex-row mt-2 items-center justify-center text-light-2 gap-2 cursor-pointer p-2 bg-greens-gradient dark:bg-reds-gradient w-2/5 rounded-xl"
                        >
                            <UploadCloud size={24} />
                            <span>Upload Image</span>
                        </Label>
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
                            Edit Kandang
                        </Button>

                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog >
    );
}
