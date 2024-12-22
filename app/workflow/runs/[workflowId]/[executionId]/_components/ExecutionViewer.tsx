"use client"

import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import GetWorkflowPhaseDetails from '@/actions/workflows/getWorkflowPhaseDetails';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DateToDurationString } from '@/lib/helper/date';
import { GetPhasesTotalCost } from '@/lib/helper/phases';
import { WorkflowExecutionStatus } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, CircleDashedIcon, ClockIcon, Coins, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import React, { ReactNode, useState } from 'react'

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;
const ExecutionViewer = ({ execution: initialData }: { execution: ExecutionData }) => {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false //
    });

    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhase!)
    })

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;
    const duration = DateToDurationString(query.data?.completedAt, query.data?.startedAt);

    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

    const onSelectedPhase = (phaseId: string) => {
        setSelectedPhase(phaseId);
    }
    return (
        <div className='flex w-full h-full'>
            {ExecutionAllStatusLeftPanel(query, duration, creditsConsumed, isRunning, selectedPhase, onSelectedPhase)}
            <div className="flex w-full h-full">
                <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
            </div>
        </div>
    )
}

export default ExecutionViewer;


const ExecutionLabel = ({ icon, label, value }: { icon: LucideIcon, label: ReactNode, value: ReactNode }) => {
    const Icon = icon;
    return <div className='flex justify-between items-center py-2 px-4 text-sm'>
        <div className='text-muted-foreground flex items-center gap-2'>
            <Icon size={20} className='stroke-muted-foreground' />
            <span>{label}</span>
        </div>
        <div className="font-semibold capitalize flex gap-2 items-center">
            {value}
        </div>
    </div>
}

const ExecutionAllStatusLeftPanel = (query: any, duration: string | undefined, creditsConsumed: number, isRunning: boolean, selectedPhase: string | null, onSelectedPhase: (phaseId: string) => void) => {


    const onPhaseButtonClick = (id: string) => {
        if (isRunning) return;
        onSelectedPhase(id);
    }
    return <aside className='w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden'>
        <div className="py-4 px-2">
            {/* Status */}
            <ExecutionLabel
                icon={CircleDashedIcon}
                label={'Status'}
                value={query.data?.status} />
            {/* StartedAt */}
            <ExecutionLabel
                icon={CalendarIcon}
                label={'Started At'}
                value={<span className='lowercase'>
                    {query.data?.startedAt ? formatDistanceToNow(new Date(query.data?.startedAt), { addSuffix: true }) : "-"}
                </span>} />
            <ExecutionLabel
                icon={ClockIcon}
                label={'Duration'}
                value={duration ? duration : <Loader2Icon className='animate-spin' />} />

            <ExecutionLabel
                icon={Coins}
                label={'Credits Consumed'}
                value={creditsConsumed} />
        </div>
        <Separator />
        <div className='flex justify-center items-center py-2 px-4'>
            <div className='text-muted-foreground flex items-center gap-2'>
                <WorkflowIcon size={20} className='stroke-muted-foreground/80' />
                <span className='font-semibold'>
                    Phases
                </span>
            </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-2">
            {query.data?.phases.map((phase: any, index: number) => (
                <Button key={phase.id} className='w-full justify-between'
                    variant={selectedPhase === phase.id ? "secondary" : 'ghost'}
                    onClick={() => onPhaseButtonClick(phase.id)}>
                    <div className="flex items-center gap-2">
                        <Badge variant={'outline'}>{index + 1}</Badge>
                        <p className="font-semibold">{phase.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{phase.status}</p>
                </Button>
            ))}
        </div>
    </aside>;
}
