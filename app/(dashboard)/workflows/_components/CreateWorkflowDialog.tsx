"use client"

import CustomDialogHeader from '@/components/CustomDialogHeader/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Layers2Icon } from 'lucide-react';
import React, { useState } from 'react'

const CreateWorkflowDialog = ({ triggerText }: { triggerText?: string }) => {
    const [open, setOpen] = useState();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Create Workflow"}</Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader icon={Layers2Icon} title='Create Workflow' subTitle="Start creating your workflow" />
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkflowDialog