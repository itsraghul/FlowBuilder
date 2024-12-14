"use client";

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog'
import React, { useState } from 'react'
import { Input } from '../ui/input';


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    description?: string;
    subDescription?: string;
    needConfirmText: boolean;
    actionDisabled: boolean;
    actionButtonText: string;
    confirmText: string;
    setConfirmText: (text: string) => void;
    onActionClick: (event: any) => void;
}
const AlertDialogBox = (props: Props) => {
    const { open, setOpen, title, description, subDescription, needConfirmText, actionDisabled, actionButtonText, confirmText, setConfirmText, onActionClick } = props;
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                        <div className="flex flex-col py-4 gap-2">
                            <p>{subDescription}</p>
                        </div>
                        {
                            needConfirmText && <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={actionDisabled}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        onClick={onActionClick}
                    >{actionButtonText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDialogBox