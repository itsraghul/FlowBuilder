"use client";

import { PublishWorkflow } from '@/actions/workflows/publishWorkflow';
import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/hooks/useExecutionPlan';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { UploadIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

const PublishButton = ({ workflowId }: { workflowId: string }) => {
    const generate = useExecutionPlan();
    const { toObject } = useReactFlow();

    const mutation = useMutation({
        mutationFn: PublishWorkflow,
        onSuccess: () => {
            toast.success("Workflow publishded", { id: workflowId });
        },
        onError: () => {
            toast.error("Publishing Failed", { id: workflowId });
        },
    })

    const onClick = () => {
        const plan = generate();
        if (!plan) {
            //Client Validation
            return
        }
        toast.loading("Publishing workflow....", { id: workflowId })
        mutation.mutate({
            id: workflowId,
            flowDefinition: JSON.stringify(toObject())
        })
    }
    return (
        <Button
            disabled={mutation.isPending}
            variant={'outline'} className='flex items-center gap-2' onClick={onClick} >
            <UploadIcon size={16} className='stroke-green-400' /> Publish
        </Button>
    )
}

export default PublishButton;