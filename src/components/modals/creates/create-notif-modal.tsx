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
    message_notifications: z.string()
        .min(3, { message: "Kandang name must be at least 3 characters long" })
        .refine(value => !!value.trim(), {
            message: "Kandang name is required and must not be empty",
            path: [],
        }),
    // gambar_kandang dengan typedata file
});

type FormData = z.infer<typeof formSchema>;

export const CreateNotifModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const queryClient = useQueryClient();
    // menampung state error

    const isModalOpen = isOpen && type === "createNotif";



    const { notif } = data;

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

        const { message_notifications } = data;

        console.log(notif?.id_notifications);
        console.log(data);

        try {
            const response = await axios.post('/api/notif', {
                message_notifications
            });

            console.log(response.data);

            queryClient.invalidateQueries(["notif"]);
            onClose();

        } catch (error) {
            console.log(error);
        }
    };



    const handleClose = () => {
        // reset form
        // resetField("nama_kandang");
        reset();
        onClose();
    }
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
                        <Label htmlFor="message_notifications	">
                            Nama Kandang
                        </Label>
                        <Input
                            id="message_notifications	"
                            className="bg-neutral-200 outline-none border-none focus:border-none"
                            type="text"
                            placeholder="Nama Kandang"
                            defaultValue={notif?.message_notifications ? notif?.message_notifications : ""}
                            {...register("message_notifications")}
                        />
                        {errors.message_notifications && (
                            <div>{errors.message_notifications.message}</div>
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
                            Edit Kandang
                        </Button>

                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog >
    );
}
