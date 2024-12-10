"use client"

import React from 'react'
import { DialogHeader } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface Props {
    icon?: LucideIcon;
    title?: string;
    subTitle?: string;
    iconClassName?: string;
    titleClassName?: string;
    subTitleClassName?: string;
}
const CustomDialogHeader = (props: Props) => {
    const Icon = props.icon;
    const { title, subTitle, titleClassName, subTitleClassName } = props;
    return (
        <DialogHeader className='py-6'>
            <DialogTitle asChild>
                <div className='flex flex-col items-center gap-2 mb-2'>
                    {Icon && <Icon size={30} className={cn("stroke-primary", props.iconClassName)} />}
                    {title && (
                        <p className={cn("text-x1 text-primary", titleClassName)}>
                            {title}
                        </p>
                    )}
                    {subTitle && (
                        <p className={cn("text-sm text-muted-foreground", subTitleClassName)}>
                            {subTitle}
                        </p>
                    )}
                </div>
            </DialogTitle>
            <Separator />
        </DialogHeader>
    )
}

export default CustomDialogHeader