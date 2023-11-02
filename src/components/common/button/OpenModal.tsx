"use client"
import { Button } from '@/components/ui/button'
import { ModalType, useModal } from '@/hooks/use-modal-store'
import React, { FC, ReactNode } from 'react'

interface OpenModalProps {
    isOpen: ModalType
    icon?: ReactNode // Menggunakan ReactNode untuk menerima ikon
    text?: string // Menggun
}

const OpenModal: FC<OpenModalProps> = ({
    isOpen,
    icon,
    text
}) => {

    const { onOpen } = useModal();


    return (
        <>
            <Button
                variant={'themeMode'}
                size={'default'}
                className='flex flex-row gap-3'
                onClick={() => onOpen(isOpen)}
            >
                <h1>{text}</h1>
                {icon}

            </Button>
        </>
    )
}


export default OpenModal