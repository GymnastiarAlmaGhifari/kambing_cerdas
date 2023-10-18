"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const { mutate: addKandang, isLoading, isError } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const formData = new FormData();
            formData.append("nama_kandang", values.nama_kandang);
            formData.append("file", values.gambar_kandang);

            const response = await axios.post("/api/kandang", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["kandang"]);
            form.reset();
            onClose();
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const handleAddKambing = async (values: z.infer<typeof formSchema>) => {
        try {
            await addKandang(values); // Trigger the mutation using addKandang
            // The mutation will be handled by useMutation's onSuccess and onError callbacks
        } catch (error) {
            console.error("Submission error:", error);
        }
    };


    const handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your Kandang
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your kandang a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                {
                    isError ? (
                        <p>
                            {isError.valueOf.name}
                        </p >
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleAddKambing)}
                                className="space-y-8">
                                <div className="space-y-8 px-6">
                                    <FormField
                                        control={form.control}
                                        name="nama_kandang"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                                >
                                                    Server name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isLoading}
                                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                        placeholder="Enter server name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-8 px-6">
                                    <FormField
                                        control={form.control}
                                        name="gambar_kandang"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                                >
                                                    Kandang image
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        disabled={isLoading}
                                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                        accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"

                                                        onChange={(e) =>
                                                            field.onChange(e.target.files ? e.target.files[0] : null)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter className="px-6 pb-8">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="default"
                                        disabled={isLoading}
                                    >
                                        Create
                                    </Button>
                                </DialogFooter>

                            </form>
                        </Form>
                    )
                }
            </DialogContent>
        </Dialog >

    );
}



// const isLoading = form.formState.isSubmitting;

// const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//         const formData = new FormData();
//         formData.append("nama_kandang", values.nama_kandang);
//         formData.append("file", values.gambar_kandang);

//         await axios.post("/api/kandang", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });

//         queryClient.invalidateQueries(["kandang"]);
//         form.reset();
//         onClose();
//     } catch (error) {
//         // Handle any submission errors here
//         console.error("Submission error:", error);
//     }
// };


// const { mutate: onSubmit, isLoading, isError } = useMutation({
//     mutationFn: async (values: z.infer<typeof formSchema>) => {
//         const formData = new FormData();
//         formData.append("nama_kandang", values.nama_kandang);
//         formData.append("file", values.gambar_kandang);

//         const response = await axios.post("/api/kandang", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });

//         return response.data;
//     },
//     onSuccess: () => {
//         queryClient.invalidateQueries(["kandang"]);
//         form.reset();
//         onClose();
//     },
// })