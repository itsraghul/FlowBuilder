"use client"

import { cn } from '@/lib/utils';
import { WorkflowExecutionStatus } from '@/types/workflow';
import React from 'react'

const indicatorColours: Record<WorkflowExecutionStatus, string> = {
    [WorkflowExecutionStatus.PENDING]: 'bg-slate-400',
    [WorkflowExecutionStatus.RUNNING]: 'bg-yellow-400',
    [WorkflowExecutionStatus.COMPLETED]: 'bg-emerald-600',
    [WorkflowExecutionStatus.FAILED]: 'bg-red-400'
}

const ExecutionStatusIndicator = ({ status }: { status: WorkflowExecutionStatus }) => {
    return (
        <div className={cn("w-2 h-2 rounded-full", indicatorColours[status])} />
    )
}

export default ExecutionStatusIndicator;


const labelColors: Record<WorkflowExecutionStatus, string> = {
    [WorkflowExecutionStatus.PENDING]: 'text-slate-400',
    [WorkflowExecutionStatus.RUNNING]: 'text-yellow-400',
    [WorkflowExecutionStatus.COMPLETED]: 'text-emerald-600',
    [WorkflowExecutionStatus.FAILED]: 'text-red-400'
}

export const ExecutionStatusLabel = ({ status }: { status: WorkflowExecutionStatus }) => {
    return <span className={cn("lowercase", labelColors[status])}>{status}</span>
}