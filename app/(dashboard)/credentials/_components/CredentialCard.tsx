"use client";

import { DeleteCredential } from '@/actions/credentials/deleteCredential';
import AlertDialogBox from '@/components/AlertDialogBox/AlertDialogBox';
import TooltipWrapper from '@/components/TooltipWrapper/TooltipWrapper';
import { Card } from '@/components/ui/card';
import { Credential } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { LockKeyholeIcon, Trash2Icon } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

const CredentialCard = ({ credential }: { credential: Credential }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const { name, createdAt, id } = credential;
    const formatedCreatedAt = formatDistanceToNow(createdAt, {
        addSuffix: true,
    });


    const deleteMutatuon = useMutation({
        mutationFn: DeleteCredential,
        onSuccess: () => {
            toast.success(`Credential ${name} deleted successfully.`, { id: id });
            setConfirmText("")
        },
        onError: () => {
            toast.error('Something went wrong!', { id: id });
        }
    })

    const onDeleteWorkflow = (event: any) => {
        event.preventDefault();
        toast.loading("Deleting credential...", { id: id });
        deleteMutatuon.mutate(name)
    }
    return (
        <Card key={id} className='w-full p-4 flex justify-between'>
            <div className='flex gap-2 items-center'>
                <div className='rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center'><LockKeyholeIcon size={18} className='stroke-primary' /></div>
                <div>
                    <p className='font-bold'>{name}</p>
                    <p className='text-xs text-muted-foreground'>{formatedCreatedAt}</p>
                </div>
            </div>
            <div className='flex gap-2 items-center'>
                <TooltipWrapper content="Delete Credential">
                    <div className='rounded-md bg-destructive/10 w-8 h-8 flex items-center justify-center cursor-pointer'>
                        <Trash2Icon size={18} onClick={() => setOpenDeleteDialog((prev) => !prev)} className='text-destructive' />
                    </div>
                </TooltipWrapper>
            </div>
            <AlertDialogBox
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                title={'Are you sure you want to delete ?'}
                subDescription={`If you are sure, enter ${name} to confirm.`}
                description='If you delete this credential, you will not be able to retrieve it.'
                needConfirmText={true}
                actionDisabled={confirmText !== name || deleteMutatuon.isPending}
                actionButtonText={'Delete'}
                confirmText={confirmText}
                setConfirmText={setConfirmText}
                onActionClick={onDeleteWorkflow}
            />
        </Card>
    )
}

export default CredentialCard