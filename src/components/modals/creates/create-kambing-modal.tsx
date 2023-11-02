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
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
    nama_kambing: z.string()
        .min(3, { message: "Kandang name must be at least 3 characters long" })
        .refine(value => !!value.trim(), {
            message: "Kandang name is required and must not be empty",
            path: [],
        }),
    // umurkambing date picker
    umur_kambing: z.date(),
    // gambar_kambing dengan typedata file
    gambar_kambing: z.any(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateKambingModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();
    // menampung state error

    const isModalOpen = isOpen && type === "createKambing";

    const { kambing } = data;

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
        if (kambing) {
            reset()
            setValue("nama_kambing", kambing.nama_kambing);
        }

    }, [kambing, resetField, setValue, reset]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {

        console.log(kambing?.id_kandang);
        console.log(data);

        const formData = new FormData();
        formData.append("nama_kambing", data.nama_kambing);
        if (data.gambar_kambing instanceof File) {
            formData.append("file", data.gambar_kambing);
        } else {
            // Use the existing file path
            formData.append("file", kambing?.gambar_kambing || "");
        }
        const response = await axios.put(`/api/kambing/${kambing?.id_kandang}`
            , formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // consol log
        console.log(response.data);

        queryClient.invalidateQueries(["kambing"]);
        onClose();

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
            setValue("gambar_kambing", file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-neutral-100 text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Tambah Kambing
                    </DialogTitle>
                </DialogHeader>

                <DatePicker />

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 px-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nama_kambing">
                            Nama Kandang
                        </Label>
                        <Input
                            id="nama_kambing"
                            className="bg-neutral-200 outline-none border-none focus:border-none"
                            type="text"
                            placeholder="Nama Kandang"
                            defaultValue={kambing?.nama_kambing ? kambing?.nama_kambing : ""}
                            {...register("nama_kambing")}
                        />
                        {errors.nama_kambing && (
                            <div>{errors.nama_kambing.message}</div>
                        )}
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
                                // src={kambing?.gambar_kambing ? kambing?.gambar_kambing : '/assets/default.jpeg'}
                                src={`/api/kambing/img?img=${kambing?.gambar_kambing}`}
                                alt="Preview Image"
                                width={200}
                                height={200}
                                objectFit="cover"
                                className="rounded-md"
                            />
                        )}
                        <Label
                            htmlFor="gambar_kambing"
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
