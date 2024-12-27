"use client";


import { TaskParam, TaskParamType } from '@/types/Tasks/task';
import React, { useCallback } from 'react'
import StringParam from './param/StringParam';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/Nodes/appNodes';
import BrowserInstanceParam from './param/BrowserInstanceParam';
import SelectParam from './param/SelectParam';
import CredentialParam from './param/CredentialParam';

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
        case TaskParamType.SELECT: {
            return <SelectParam param={param} updateNodeParamValue={updateNodeParamValue} value={value} disabled={disabled} />
        }
        case TaskParamType.CREDENTIAL: {
            return <CredentialParam param={param} updateNodeParamValue={updateNodeParamValue} value={value} disabled={disabled} />
        }
        default: {
            return <div className='w-full'>
                <p className="text-xs text-muted-foreground">Not implemented.</p>
            </div>
        }
    }
}

export default NodeParamField