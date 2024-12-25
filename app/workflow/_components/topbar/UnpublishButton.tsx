"use client";

import { UnPublishWorkflow } from '@/actions/workflows/unPublishWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

const UnpublishButton = ({ workflowId }: { workflowId: string }) => {

    const mutation = useMutation({
        mutationFn: UnPublishWorkflow,
        onSuccess: () => {
            toast.success("Workflow unpublishded", { id: workflowId });
        },
        onError: () => {
            toast.error("Unpublishing Failed", { id: workflowId });
        },
    })

    const onClick = () => {
        toast.loading("Unpublishing workflow....", { id: workflowId })
        mutation.mutate(workflowId);
    }
    return (
        <Button
            disabled={mutation.isPending}
            variant={'outline'} className='flex items-center gap-2' onClick={onClick} >
            <DownloadIcon size={16} className='stroke-orange-400' /> Unpublish
        </Button>
    )
}

export default UnpublishButton;