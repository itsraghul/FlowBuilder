"use client"

import { DeleteWorkflow } from '@/actions/workflows/deleteWorkflow'
import AlertDialogBox from '@/components/AlertDialogBox/AlertDialogBox'
import TooltipWrapper from '@/components/TooltipWrapper/TooltipWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { WorkflowExecutionStatus, WorkflowStatus } from '@/types/workflow'
import { Workflow } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ChevronRightIcon, ClockIcon, CoinsIcon, CornerDownRightIcon, FileCode2, MoreVerticalIcon, MoveRightIcon, PlayIcon, ShuffleIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import RunButton from './RunButton'
import SchedulerDialog from './SchedulerDialog'
import { Badge } from '@/components/ui/badge'
import ExecutionStatusIndicator, { ExecutionStatusLabel } from '@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator'
import { format, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-amber-300 text-yellow-600",
    [WorkflowStatus.PUBLISHED_LOCAL]: "bg-primary text-white"
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
                        <SchedulerSession isDraft={isDraft} creditsCost={workflow.creditsCost} workflowId={workflow.id} cron={workflow.cron} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!isDraft && <RunButton workflowId={workflow.id} />}
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
            <LastRunDetails workflow={workflow} />
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


const SchedulerSession = ({ isDraft, creditsCost, workflowId, cron }: { isDraft: boolean, creditsCost: number, workflowId: string, cron: string | null }) => {
    if (isDraft) return null;
    return <div className='flex items-center gap-2'>
        <CornerDownRightIcon className='h-4 w-4 text-muted-foreground' />
        <SchedulerDialog workflowId={workflowId} cron={cron} key={`${cron}-${workflowId}`} />
        < MoveRightIcon className='h-4 w-4 text-muted-foreground' />
        <TooltipWrapper content="Credit consumption for full run" >
            <div className='flex items-center gap-3'>
                <Badge variant={'outline'} className='space-x-2 text-muted-foreground rounded-sm'>
                    <CoinsIcon className='h-4 w-4' />
                    <span className='text-sm' >{creditsCost}</span>
                </Badge>
            </div>
        </TooltipWrapper>
    </div>
}


const LastRunDetails = ({ workflow }: { workflow: Workflow }) => {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;
    if (isDraft) {
        return null;
    }
    const { lastRunAt, lastRunStatus, lastRunId, nextRunAt, id } = workflow;
    const formattedStartedAt = lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
    const nextSchedule = nextRunAt && format(nextRunAt, "dd-MM-yyyy HH:mm");
    const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");
    return (
        <div className='bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground'>
            <div className='flex items-center text-sm gap-2'>
                {lastRunAt &&
                    <Link href={`/workflow/runs/${id}/${lastRunId}`} className='flex items-center text-sm gap-2 group'>
                        <span>Last Run:</span>
                        <ExecutionStatusIndicator status={lastRunStatus as WorkflowExecutionStatus} />
                        <ExecutionStatusLabel status={lastRunStatus as WorkflowExecutionStatus} />
                        <span>{formattedStartedAt}</span>
                        <ChevronRightIcon size={14} className='-translate-x-[2px] group-hover:translate-x-0 transition' />
                    </Link>
                }
                {!lastRunAt && <p>
                    No runs yet.</p>}
            </div>
            {nextRunAt && (
                <div className='flex items-center text-sm gap-2'>
                    <ClockIcon size={12} />
                    <span>Next run at:</span>
                    <span>{nextSchedule}</span>
                    <span className='text-xs'>({nextScheduleUTC} UTC)</span>
                </div>
            )}
        </div>
    )
}