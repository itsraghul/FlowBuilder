import { NodeProps } from '@xyflow/react';
import React, { memo } from 'react'
import NodeCard from './NodeCard';
import NodeHeader from './NodeHeader';
import { AppNodeData } from '@/types/Nodes/appNodes';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { NodeInput, NodeInputs } from './NodeInputs';

const NodeComponent = memo((props: NodeProps) => {
    const { id, selected, data } = props;
    const nodeData = data as AppNodeData;
    const task = TaskRegistry[nodeData.type];
    const { inputs } = task;

    return (
        <NodeCard nodeId={id} isSelected={!!selected}>
            <NodeHeader taskType={nodeData.type} />
            <NodeInputs>
                {
                    inputs.map((input, index) => (
                        <NodeInput key={index} input={input} />
                    ))
                }
            </NodeInputs>
        </NodeCard>
    )
});

export default NodeComponent;

NodeComponent.displayName = "NodeComponent";