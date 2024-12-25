"use client";


import { RunWorkFlow } from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

const RunButton = ({ workflowId }: { workflowId: string }) => {
    const mutation = useMutation({
        mutationFn: RunWorkFlow,
        onSuccess: () => {
            toast.success("Workflow ran successfully", { id: workflowId });
        },
        onError: () => {
            toast.error("Workflow run failed", { id: workflowId });
        }
    })

    const onClick = () => {
        toast.loading("Scheduling run...", { id: workflowId });
        mutation.mutate({
            workflowId
        })
    }
    return (
        <Button variant={'outline'} size={'sm'} className='flex items-center gap-2' disabled={mutation.isPending} onClick={onClick}>
            <PlayIcon size={16} />
            Run
        </Button>
    )
}

export default RunButton