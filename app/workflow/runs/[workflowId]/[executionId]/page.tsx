import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases';
import TopBar from '@/app/workflow/_components/topbar/TopBar';
import { Loader2Icon } from 'lucide-react';
import React, { Suspense } from 'react'
import ExecutionViewer from './_components/ExecutionViewer';

const WorkFlowExecutionViewerPage = ({
    params
}: {
    params: {
        executionId: string;
        workflowId: string;
    }
}) => {
    const { workflowId, executionId } = params;
    return (
        <div className='flex flex-col h-screen w-full overflow-hidden'>
            <TopBar workflowId={workflowId} title='Workflow Run Details' subtitle={`Run ID: ${executionId}`} hideButton />
            <section className="flex h-full overflow-auto">
                <Suspense fallback={
                    <div className='flex w-full items-center justify-center'>
                        <Loader2Icon className='h-10 w-10 animate-spin stroke-primary' />
                    </div>}
                >
                    <ExecutionViewerWrapper executionId={executionId} />
                </Suspense>
            </section>
        </div>
    )
}

export default WorkFlowExecutionViewerPage;


async function ExecutionViewerWrapper({
    executionId
}: {
    executionId: string
}) {
    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

    if (!workflowExecution) {
        return <div>Not found</div>
    }

    return <ExecutionViewer execution={workflowExecution} />
}