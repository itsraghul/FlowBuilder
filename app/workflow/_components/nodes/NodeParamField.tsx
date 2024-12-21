"use client";


import { TaskParam, TaskParamType } from '@/types/Tasks/task';
import React, { useCallback } from 'react'
import StringParam from './param/StringParam';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/Nodes/appNodes';
import BrowserInstanceParam from './param/BrowserInstanceParam';

const NodeParamField = ({ param, nodeId, disabled }: { param: TaskParam, nodeId: string, disabled: boolean }) => {
    const { name: paramName } = param;
    const { updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data.inputs?.[paramName];


    const updateNodeParamValue = useCallback((newValue: string) => {
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [paramName]: newValue
            }
        });
    }, [nodeId, updateNodeData, paramName, node?.data.inputs]);

    switch (param.type) {
        case TaskParamType.STRING: {
            return <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled} />
        }
        case TaskParamType.BROWSER_INSTANCE: {
            return <BrowserInstanceParam param={param} value={""} updateNodeParamValue={updateNodeParamValue} />
        }
        default: {
            return <div className='w-full'>
                <p className="text-xs text-muted-foreground">Not implemented.</p>
            </div>
        }
    }
}

export default NodeParamField