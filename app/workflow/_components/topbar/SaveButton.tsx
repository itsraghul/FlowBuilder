"use client"

import { UpdateWorkFlow } from '@/actions/workflows/updateWorkflow'
import { Button } from '@/components/ui/button'
import useSaveShortcut from '@/hooks/useSaveShortcut'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { Save } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const SaveButton = ({ workflowId }: { workflowId: string }) => {
    const { toObject } = useReactFlow();

    const saveMutation = useMutation({
        mutationFn: UpdateWorkFlow,
        onSuccess: () => {
            toast.success("Flow saved successfully", { id: "save-workflow" });
        },
        onError: () => {
            toast.error("Failed to save workflow", { id: "save-workflow" });
        }
    });

    const onSaveWorkflow = () => {
        const workflowDefinition = JSON.stringify(toObject());

        toast.loading("Saving workflow data...", { id: "save-workflow" });
        saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
    }

    useSaveShortcut({ onSave: onSaveWorkflow });

    return (
        <Button disabled={saveMutation.isPending}
            variant={'outline'} className='flex items-center gap-2' onClick={onSaveWorkflow} >
            <Save size={16} className='stroke-blue-400' /> Save
        </Button>
    )
}

export default SaveButton