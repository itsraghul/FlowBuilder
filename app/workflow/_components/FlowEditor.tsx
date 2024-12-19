"use client"

import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, MarkerType, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react';

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/Tasks/task';
import NodeComponent from './nodes/NodeComponent';
import { AppNode } from '@/types/Nodes/appNodes';
import DeletableEdge from './edges/DeletableEdge';

const nodeTypes = {
    WebScrapeNode: NodeComponent,
}

const edgeTyeps = {
    default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();


    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition);
            if (!flow) return;

            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);

            if (!flow.viewport) return;
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (e) {

        }

    }, [workflow.definition, setEdges, setNodes, setViewport]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const taskType = event.dataTransfer.getData("application/reactflow");

        if (typeof taskType === undefined && !taskType) return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        });

        const newNode = CreateFlowNode(taskType as TaskType, position);
        setNodes(prevNodes => prevNodes.concat(newNode));
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        setEdges(edges => addEdge({ ...connection, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, edges));
        if (!connection.targetHandle) return;

        //Remove input if present in connection
        const node = nodes.find((node) => node.id === connection.target);
        if (!node) return;

        const nodeInputs = node.data.inputs;
        updateNodeData(node.id, { inputs: { ...nodeInputs, [connection.targetHandle]: "" } });
    }, [setEdges, updateNodeData, nodes])

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTyeps}
                snapToGrid
                snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                fitView
            >
                <Controls position='top-left' fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main >
    )
}

export default FlowEditor