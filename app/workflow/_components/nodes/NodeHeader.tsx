"use client";


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { AppNode } from '@/types/Nodes/appNodes';
import { TaskType } from '@/types/Tasks/task';
import { useReactFlow } from '@xyflow/react';
import { Coins, Copy, GripVerticalIcon, TrashIcon } from 'lucide-react';
import React from 'react'

const NodeHeader = ({ taskType, nodeId }: { taskType: TaskType, nodeId: string }) => {
    const task = TaskRegistry[taskType];

    const { deleteElements, getNode, addNodes } = useReactFlow();

    const onDeleteElement = () => {
        deleteElements({
            nodes: [{ id: nodeId }]
        })
    };

    const onDuplicateElement = () => {
        const node = getNode(nodeId) as AppNode;
        const newX = node.position.x + 10;
        const newY = node.position.y + node.measured?.height! + 20;
        const newNode = CreateFlowNode(node.data.type, {
            x: newX,
            y: newY
        });

        addNodes([newNode]);
    }
    return (
        <div className='flex items-center gap-2 p-2'>
            <task.icon size={16} />
            <div className="flex justify-between items-center w-full">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                    {task.label}
                </p>
                <div className="flex gap-1 items-center">
                    {task.isEntryPoint && <Badge>Entry Point</Badge>}
                    <Badge className='gap-2 flex items-center text-xs' >
                        <Coins size={16} />
                        {task.credits}
                    </Badge>
                    {!task.isEntryPoint && <>
                        <Button variant={'ghost'} size={'icon'} onClick={onDeleteElement}><TrashIcon size={12} /></Button>
                        <Button variant={'ghost'} size={'icon'} onClick={onDuplicateElement}><Copy size={12} /></Button>
                    </>}
                    <Button variant={'ghost'} size={'icon'} className='drag-handle cursor-grab'>
                        <GripVerticalIcon size={20} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NodeHeader