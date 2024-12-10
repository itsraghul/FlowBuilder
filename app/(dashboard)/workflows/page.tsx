import React, { Suspense } from 'react'
import { GetWorkflowsForUser } from '@/actions/workflows/getWorkflowsForUser'
import AlertBox from '@/components/AlertBox/AlertBox'
import { Skeleton } from '@/components/ui/skeleton'
import { InboxIcon } from 'lucide-react'
import CreateWorkflowDialog from './_components/CreateWorkflowDialog'

const WorkflowPage = () => {
    return (
        <div className='flex-1 flex flex-col h-full'>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h1 className='text-3xn font-bold'>Workflows</h1>
                    <p className="text-muted-foreground">Manage your workflows</p>
                </div>
                <CreateWorkflowDialog />
            </div>

            <div className="h-full py-6">
                <Suspense fallback={<UserWorkflowsSkeleton />} >
                    <UserWorkflows />
                </Suspense>
            </div>
        </div>
    )
}


const UserWorkflowsSkeleton = () => {
    return (
        <div className="space-y-2">
            {
                [1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className='h-32 w-full' />
                ))
            }
        </div>
    )
}

const UserWorkflows = async () => {
    try {
        const workflows = await GetWorkflowsForUser();

        if (workflows.length == 0) {
            return <EmptyWorkflowBox />
        }
        return <div className=""></div>
    } catch (error) {
        return <AlertBox title='Error' description='Something went wrong. Please try again later.' />
    }
}

const EmptyWorkflowBox = () => {
    return (
        <div className="flex flex-col gap-4 h-full items-center justify-center">
            <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                <InboxIcon size={40} className='stroke-primary' />
            </div>
            <div className="flex flex-col gap-1 text-center">
                <p className="font-bold">No workflow created yet</p>
                <p className="text-sm text-muted-foreground">Click the button below to create your first workflow</p>
            </div>
            <CreateWorkflowDialog triggerText='Create your first workflow' />
        </div>)
}

export default WorkflowPage
