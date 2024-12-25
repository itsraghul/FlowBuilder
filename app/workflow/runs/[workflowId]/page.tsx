import React, { Suspense } from 'react'
import TopBar from '../../_components/topbar/TopBar'
import { GetWorkflowExecutions } from '@/actions/workflows/getWorkflowExecutions';
import { InboxIcon, Loader2Icon } from 'lucide-react';
import ExecutionsTable from './_components/ExecutionsTable';

const WorkflowExecutionPage = ({ params }: { params: { workflowId: string } }) => {
    const { workflowId } = params;
    return (
        <div className='h-full w-full overflow-auto'>
            <TopBar
                workflowId={workflowId}
                hideButton
                title="All Runs"
                subtitle='List of all your workflow runs'
            />
            <Suspense fallback={
                <div className='flex h-full w-full items-center justify-center'><Loader2Icon size={30} className='animate-spin stroke-primary' /></div>
            }>
                <ExecutionsTableWrapper workflowId={workflowId} />
            </Suspense>
        </div>

    )
}

export default WorkflowExecutionPage;


const ExecutionsTableWrapper = async ({ workflowId }: { workflowId: string }) => {

    const executions = await GetWorkflowExecutions(workflowId);
    if (!executions) return <div>No data</div>;

    if (executions.length === 0) {
        return <div className="conatainer w-full h-full py-6">
            <div className='flex items-center flex-col gap-2 justify-center h-full w-full'>
                <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
                    <InboxIcon size={40} className='stroke-primary' />
                </div>
                <div className='flex flex-col gap-4 text-center'>
                    <p className="font-bold">
                        No runs have been triggered yet for this workflow
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You can trigger the workflow in the editor page
                    </p>
                </div>
            </div>
        </div>
    }
    return <div className='container py-6 w-full'>
        <ExecutionsTable workflowId={workflowId} initialExecutions={executions} />
    </div>



}

