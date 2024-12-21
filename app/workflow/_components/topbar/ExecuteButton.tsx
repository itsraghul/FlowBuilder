"use client";

import { RunWorkFlow } from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/hooks/useExecutionPlan';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { Play } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

const ExecuteButton = ({ workflowId }: { workflowId: string }) => {
    const generate = useExecutionPlan();
    const { toObject } = useReactFlow();

    const mutation = useMutation({
        mutationFn: RunWorkFlow,
        onSuccess: () => {
            toast.success("Execution Started", { id: "flow-execution" });
        },
        onError: () => {
            toast.error("Execution Failed", { id: "flow-execution" });
        },
    })

    const onClick = () => {
        const plan = generate();
        if (!plan) {
            //Client Validation
            return
        }
        mutation.mutate({
            workflowId: workflowId,
            flowDefinition: JSON.stringify(toObject())
        })
    }
    return (
        <Button
            disabled={mutation.isPending}
            variant={'outline'} className='flex items-center gap-2' onClick={onClick} >
            <Play size={16} className='stroke-orange-400' /> Execute
        </Button>
    )
}

export default ExecuteButton