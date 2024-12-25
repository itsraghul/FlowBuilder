"use client"


import { GetWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions'
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateToDurationString } from '@/lib/helper/date';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import ExecutionStatusIndicator from './ExecutionStatusIndicator';
import { WorkflowExecutionStatus } from '@/types/workflow';
import { CoinsIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { WorkflowExecution } from '@prisma/client';


type InitialExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

const ExecutionsTable = ({ workflowId, initialExecutions }: { workflowId: string, initialExecutions: InitialExecutionData }) => {
    const router = useRouter();
    const query = useQuery({
        queryKey: ["executions", workflowId],
        initialData: initialExecutions,
        queryFn: () => GetWorkflowExecutions(workflowId),
        refetchInterval: 6000
    });

    const onRowClick = (execution: WorkflowExecution) => {
        router.push(`/workflow/runs/${execution.workflowId}/${execution.id}`)
    }
    return (
        <div className='border rounded-lg shadow-md overflow-auto'>
            <Table className='h-full'>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Consumed</TableHead>
                        <TableHead className='text-right text-sm text-muted-foreground'>Started At (desc)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='gap-2 h-full overflow-auto'>
                    {query.data.map((execution) => {
                        const duration = DateToDurationString(execution.completedAt, execution.startedAt);
                        const formattedStartedAt = execution.startedAt && formatDistanceToNow(execution.startedAt, {
                            addSuffix: true
                        })
                        return (<TableRow key={execution.id} className='cursor-pointer' onClick={() => onRowClick(execution)}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold">{execution.id}</span>
                                    <div className="text-muted-foreground text-xs">
                                        <span>Triggered via</span>
                                        <Badge variant={"outline"} className='mx-5'>{execution.trigger}</Badge>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className='flex flex-col'>
                                    <div className='flex gap-2 items-center'>
                                        <ExecutionStatusIndicator status={execution.status as WorkflowExecutionStatus} />
                                        <span className='font-semibold capitalize'>{execution.status}</span>
                                    </div>
                                    <div className='text-muted-foreground text-xs mx-5'>{duration}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className='flex flex-col'>
                                    <div className='flex gap-2 items-center'>
                                        <CoinsIcon size={16} className='text-primary' />
                                        <span className='font-semibold capitalize'>{execution.creditsConsumed}</span>
                                    </div>
                                    <div className='text-muted-foreground text-xs mx-5'>Credits</div>
                                </div>
                            </TableCell>
                            <TableCell className='text-right text-muted-foreground'>
                                {formattedStartedAt}
                            </TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </div>

    )
}

export default ExecutionsTable