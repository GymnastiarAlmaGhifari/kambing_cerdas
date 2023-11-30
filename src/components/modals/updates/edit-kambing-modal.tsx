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
    // RFID  input validation string and possible null values
    rfid: z.string().nullable(),
    // umurkambing date picker
    tanggal_lahir: z.date(),
    // gambar_kambing dengan typedata file
    gambar_kambing: z.any(),
});

type FormData = z.infer<typeof formSchema>;

export const EditKambingModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();
    // menampung state error

    const isModalOpen = isOpen && type === "editKambing";

    const { dataModal } = data;

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

    // ketika open modal, set value form reset field

    useEffect(() => {
        if (dataModal) {
            reset()
            setValue("nama_kambing", dataModal.namaKambing || "");
            setValue("rfid", dataModal.rfid || "");
            // console.log(dataModal?.dateKambing);
            if (dataModal.dateKambing) {
                setValue("tanggal_lahir", new Date(dataModal.dateKambing));
            }
        }

    }, [dataModal, resetField, setValue, reset]);


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log('Form submitted', data); // Add this line

        try {
            const umurKambing = data.tanggal_lahir;
            const formattedDate = `${umurKambing.getFullYear()}-${String(umurKambing.getMonth() + 1).padStart(2, '0')}-${String(umurKambing.getDate()).padStart(2, '0')}`;

            console.log(formattedDate);
            console.log(data.tanggal_lahir);

            const formData = new FormData();

            formData.append("nama_kambing", data.nama_kambing);
            formData.append("rfid", data.rfid || "");

            if (data.tanggal_lahir != null && data.tanggal_lahir !== undefined && data.tanggal_lahir instanceof Date) {
                formData.append("tanggal_lahir", formattedDate);
            }

            if (data.gambar_kambing instanceof File && data.gambar_kambing !== null) {
                formData.append("file", data.gambar_kambing);
            }


            const response = await axios.put(`/api/kandang/${dataModal?.idKandang}/kambing/${dataModal?.idKambing}`
                , formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // consol log
            console.log(response.data);

            queryClient.invalidateQueries(["kambing"]);
            onClose();
            reset();
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
        // reset form
        // resetField("nama_kambing");
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
                        Edit Kambing
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
                            defaultValue={dataModal?.namaKambing ? dataModal?.namaKambing : ""}
                            {...register("nama_kambing")}
                        />
                        {errors.nama_kambing && (
                            <div>{errors.nama_kambing.message}</div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="rfid">
                            RFID
                        </Label>
                        <Input
                            id="rfid"
                            className="dark:bg-[#515151] bg-neutral-200 outline-none border-none focus:border-none"
                            type="text"
                            placeholder="Nama Kambing"
                            defaultValue={dataModal?.rfid ? dataModal?.rfid : ""}
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
                        <DatePicker onDateSelect={handleDateSelect} initialDate={dataModal?.dateKambing ? new Date(dataModal.dateKambing) : undefined} />



                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="gambar_kambing" className="text-lg">
                            Gambar Kambing
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
                                // src={kandang?.gambar_kambing ? kandang?.gambar_kambing : '/assets/default.jpeg'}
                                // src={`/api/kandang/img?img=${dataModal?.imageKambing}`}
                                src={`/api/kandang/${dataModal?.idKandang}/kambing/img?img=${dataModal?.imageKambing}`}
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
                            Edit kambing
                        </Button>

                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog >
    );
}
