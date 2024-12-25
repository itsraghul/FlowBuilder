"use client";

import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import GetWorkflowPhaseDetails from '@/actions/workflows/getWorkflowPhaseDetails';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateToDurationString } from '@/lib/helper/date';
import { GetPhasesTotalCost } from '@/lib/helper/phases';
import { cn } from '@/lib/utils';
import { LogLevel } from '@/types/log';
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import { ExecutionLog } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, CircleDashedIcon, ClockIcon, Coins, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react'
import PhaseStatusBadge from './PhaseStatusBadge';
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper/ReactCountUpWrapper';

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

    useEffect(() => {
        //while running we auto-select the current running phase in sidebar
        const phases = query.data?.phases || [];
        if (isRunning) {
            //select last executed
            const phaseToSelect = phases.toSorted((a, b) => a.startedAt! > b.startedAt! ? -1 : 1)[0];

            setSelectedPhase(phaseToSelect.id);
            return;
        }
        const phaseToSelect = phases.toSorted((a, b) => a.completedAt! > b.completedAt! ? -1 : 1)[0];
        setSelectedPhase(phaseToSelect.id);

    }, [query.data?.phases, isRunning, setSelectedPhase])

    const duration = DateToDurationString(query.data?.completedAt, query.data?.startedAt);

    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

    const onSelectedPhase = (phaseId: string) => {
        setSelectedPhase(phaseId);
    }
    return (
        <div className='flex w-full h-full'>
            {ExecutionAllStatusLeftPanel(query, duration, creditsConsumed, isRunning, selectedPhase, onSelectedPhase)}
            <div className="flex w-full h-full">
                {isRunning && (
                    <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                        <p className="font-bold">
                            Run is in progress, please wait.
                        </p>
                    </div>
                )}
                {!isRunning && !selectedPhase && (
                    <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                        <div className="flex flex-col gap-1 text-center">
                            <p className="font-bold">
                                No phase selected.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Select a phase to view details.
                            </p>
                        </div>
                    </div>
                )}
                {!isRunning && selectedPhase && phaseDetails.data && (
                    <div className="flex flex-col py-4 container gap-4 overflow-auto">
                        <div className="flex gap-2 items-center">
                            <Badge variant={'outline'} className='space-x-4'>
                                <div className="flex gap-1 items-center">
                                    <CoinsIcon size={18} className='stroke-muted-foreground' />
                                    <span>  Credits  </span>
                                </div>
                                <span>  {phaseDetails.data.creditsCost}  </span>
                            </Badge>
                            <Badge variant={'outline'} className='space-x-4'>
                                <div className="flex gap-1 items-center">
                                    <ClockIcon size={18} className='stroke-muted-foreground' />
                                    <span>  Duration  </span>
                                </div>
                                <span>  {DateToDurationString(phaseDetails.data.completedAt, phaseDetails.data.startedAt) || "-"}  </span>
                            </Badge>
                        </div>
                        <ParameterViewer title="Inputs" subtitle="Inputs used for the phase" paramsJSON={phaseDetails.data.inputs} />
                        <ParameterViewer title="Outputs" subtitle="Outpust generated by the phase" paramsJSON={phaseDetails.data.outputs} />
                        <LogViewer logs={phaseDetails.data.logs} />
                    </div>
                )}
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
                value=
                {<div className='font-semibold capitalize flex gap-2 items-center'>
                    <PhaseStatusBadge status={query.data?.status as ExecutionPhaseStatus} />
                    <span>
                        {query.data?.status}
                    </span>
                </div>}
            />
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
                value={<ReactCountUpWrapper value={creditsConsumed} />} />
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
                    <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
                </Button>
            ))}
        </div>
    </aside>;
}



const ParameterViewer = ({ title, subtitle, paramsJSON }: { title: string, subtitle: string, paramsJSON: string | null }) => {
    const params = paramsJSON ? JSON.parse(paramsJSON) : undefined;

    return <Card>
        <CardHeader className='rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background' >
            <CardTitle className='text-base'>{title}</CardTitle>
            <CardDescription className='text-muted-foreground text-sm'>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className='py-4'>
            <div className="flex flex-col gap-2">
                {(!params || Object.keys(params).length === 0) && (
                    <p className="text-sm">No parameters generated by this phase</p>
                )}
                {params && Object.entries(params).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center space-y-1">
                        <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                            {key}
                        </p>
                        <Input readOnly className='flex-1 basis-2/3' value={value as string} />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
}


const LogViewer = ({ logs }: { logs: ExecutionLog[] | undefined }) => {

    return (
        <Card className='w-full'>
            <CardHeader className='rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background' >
                <CardTitle className='text-base'>{"Logs"}</CardTitle>
                <CardDescription className='text-muted-foreground text-sm'>{"Logs generated by this phase"}</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                {
                    <Table>
                        <TableHeader className='text-muted-foreground text-sm'>
                            <TableRow>
                                <TableHead className='p-[2px] pl-4'>Time</TableHead>
                                <TableHead className='p-[3px] pl-4'>Level</TableHead>
                                <TableHead className='p-[3px] pl-4'>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(!logs || logs.length === 0) && (
                                <div className='flex p-6 py-4'>
                                    <p className="text-sm">No logs generated for this phase.</p>
                                </div>
                            )}
                            {
                                (logs && logs.length > 0) && logs.map((log) => (
                                    <TableRow key={log.id} className='text-muted-foreground'>
                                        <TableCell width={190} className='text-xs text-muted-foreground p-[2px] pl-4'>{log.timeStamp.toISOString()}</TableCell>
                                        <TableCell width={80} className={cn("uppercase text-sm font-bold p-[3px] pl-4",
                                            log.logLevel as LogLevel === "error" && "text-destructive",
                                            log.logLevel as LogLevel === "info" && "text-primary",
                                        )}>{log.logLevel}</TableCell>
                                        <TableCell
                                            className='text-sm flex-1 p-[3px] pl-4'
                                        >{log.message}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                }
            </CardContent>
        </Card >
    )
}