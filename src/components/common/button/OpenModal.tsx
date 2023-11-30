"use client"
import { Button } from '@/components/ui/button'
import { ModalType, useModal } from '@/hooks/use-modal-store'
import React, { FC, ReactNode } from 'react'
import { dataModal, terimaData } from '@/hooks/use-modal-store'

interface OpenModalProps {
    isOpen: ModalType
    icon?: ReactNode
    text?: string
    dataModal?: dataModal
    terimaData?: terimaData
    variant?: 'themeMode' | 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined
    className?: string
}

const OpenModal: FC<OpenModalProps> = ({
    isOpen,
    icon,
    text,
    dataModal,
    terimaData,
    variant,
    className
}) => {

    const { onOpen } = useModal();

    return (
        <>
            <Button
                variant={variant ? variant : 'themeMode'}
                size={'default'}
                className={`flex flex-row gap-3 justify-between items-center ${className}`}
                onClick={() => onOpen(isOpen, { dataModal, terimaData })}
            >
                <h1>{text}</h1>
                {icon}

            </Button>
        </>
    )
}


export default OpenModal