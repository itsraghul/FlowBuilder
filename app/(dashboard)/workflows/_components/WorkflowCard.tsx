"use client"

import { DeleteWorkflow } from '@/actions/workflows/deleteWorkflow'
import AlertDialogBox from '@/components/AlertDialogBox/AlertDialogBox'
import TooltipWrapper from '@/components/TooltipWrapper/TooltipWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { WorkflowStatus } from '@/types/workflow'
import { Workflow } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { FileCode2, MoreVerticalIcon, PlayIcon, ShuffleIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-amber-300 text-yellow-600",
    [WorkflowStatus.PUBLISHED_LOCAL]: "bg-primary"
}


const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;

    return (
        <Card className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30 mb-5'>
            <CardContent className='p-4 flex items-center justify-between h-[100px]'>
                <div className="flex items-center justify-start space-x-3">
                    <div className={cn("w-10 h-10 rounded-x2 flex items-center justify-center", statusColors[isDraft ? WorkflowStatus.DRAFT : WorkflowStatus.PUBLISHED_LOCAL])}>
                        {
                            isDraft ? (
                                <FileCode2 className='h-5 w-5' />
                            ) : (
                                <PlayIcon className='h-5 w-5' />
                            )
                        }
                    </div>
                    <div>
                        <h3 className='text-base font-bold text-muted-foreground flex items-center justify-between'>
                            <Link href={`/workflow/editor/${workflow.id}`} className='flex items-center hover:underline'>
                                {workflow.name}
                            </Link>
                            {isDraft && (
                                <span className='ml-2 px-2  py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full'>
                                    {WorkflowStatus.DRAFT}
                                </span>
                            )}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href={`/workflow/editor/${workflow.id}`} className={cn(buttonVariants({
                        variant: "outline",
                        size: "sm"
                    }), "flex items-center gap-2")}>
                        <ShuffleIcon size={16} />
                        Edit
                    </Link>
                    <WorkFlowActions workflowName={workflow.name} workflowId={workflow.id} />
                </div>
            </CardContent>
        </Card>
    )
}

export default WorkflowCard;


const WorkFlowActions = ({ workflowName, workflowId }: { workflowName: string, workflowId: string }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const deleteMutatuon = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            toast.success(`Workflow ${workflowName} deleted successfully.`, { id: workflowId });
            setConfirmText("")
        },
        onError: () => {
            toast.error('Something went wrong!', { id: workflowId });
        }
    })

    const onDeleteWorkflow = (event: any) => {
        event.preventDefault();
        toast.loading("Deleting workflow...", { id: workflowId });
        deleteMutatuon.mutate(workflowId)
    }

    return (<>
        <AlertDialogBox
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
            title={'Are you sure you want to delete ?'}
            subDescription={`If you are sure, enter ${workflowName} to confirm.`}
            description='If you delete this workflow, you will not be able to retrieve it.'
            needConfirmText={true}
            actionDisabled={confirmText !== workflowName || deleteMutatuon.isPending}
            actionButtonText={'Delete'}
            confirmText={confirmText}
            setConfirmText={setConfirmText}
            onActionClick={onDeleteWorkflow}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'} size={'sm'}>
                    <TooltipWrapper content="More Actions">
                        <div className='flex items-center justify-content w-full h-full'>
                            <MoreVerticalIcon size={18} />
                        </div>
                    </TooltipWrapper>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-descructive flex items-center gap-2' onClick={() => setOpenDeleteDialog((prev) => !prev)}>
                    <TrashIcon size={16} />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    </>);
}