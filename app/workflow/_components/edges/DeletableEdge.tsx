"use client";

import { Button } from '@/components/ui/button';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import React from 'react'

const DeletableEdge = (props: EdgeProps) => {
    const { id } = props;
    const [edgePath, labelX, labelY] = getSmoothStepPath(props);
    const { setEdges } = useReactFlow();

    const onDeleteEdge = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }
    return (
        <>
            <BaseEdge path={edgePath} markerEnd={props.markerEnd} />
            <EdgeLabelRenderer>
                <div style={{
                    position: 'absolute',
                    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    pointerEvents: "all"
                }}>
                    <Button variant={'outline'}
                        size={'icon'}
                        className='w-5 h-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg'
                        onClick={onDeleteEdge}
                    >
                        X
                    </Button>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}

export default DeletableEdge