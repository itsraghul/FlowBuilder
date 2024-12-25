"use client"

import { Workflow } from '@prisma/client'
import React from 'react';
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from './FlowEditor';
import TopBar from './topbar/TopBar';
import TaskMenu from './TaskMenu';
import { FlowValidationContextProvider } from '@/context/FlowValidationContext';
import { WorkflowStatus } from '@/types/workflow';

const Editor = ({ workflow }: { workflow: Workflow }) => {
    const { name, id } = workflow;
    return (
        <FlowValidationContextProvider>
            <ReactFlowProvider>
                <div className="flex flex-col h-full w-full overflow-hidden">
                    <TopBar title={'Workflow Editor'} subtitle={name} workflowId={id} isPublished={workflow.status === WorkflowStatus.PUBLISHED_LOCAL} />
                    <section className="flex h-full overflow-auto">
                        <TaskMenu />
                        <FlowEditor workflow={workflow} />
                    </section>
                </div>
            </ReactFlowProvider>
        </FlowValidationContextProvider>

    )
}

export default Editor