import { AppNode, AppNodeMissingInputs } from "@/types/Nodes/appNodes";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";


export enum FlowToExecutionPlanValidationError {
    "NO_ENTRY_POINT",
    "INVALID_INPUTS"
}

type FlowToExecutionPlan = {
    executionPlan?: WorkflowExecutionPlan;
    error?: {
        type: FlowToExecutionPlanValidationError;
        invalidElements?: AppNodeMissingInputs[];
    }
}

export const FlowToExecutionPlan = (nodes: AppNode[], edges: Edge[]): FlowToExecutionPlan => {
    const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);

    if (!entryPoint) {
        return {
            error: {
                type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT
            }
        }
    }
    const inputsWithErros: AppNodeMissingInputs[] = [];
    const planned = new Set<string>();

    const invalidInputsForEntry = getInvalidInputs(entryPoint, edges, planned);
    if (invalidInputsForEntry.length > 0) {
        inputsWithErros.push({
            nodeId: entryPoint.id,
            inputs: invalidInputsForEntry
        })
    }



    const executionPlan: WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes: [entryPoint]
        }
    ];

    planned.add(entryPoint.id);

    for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++) {
        const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

        for (const currenNode of nodes) {
            if (planned.has(currenNode.id)) continue; //Node already executed

            const invalidInputs = getInvalidInputs(currenNode, edges, planned);

            if (invalidInputs.length > 0) {
                const incomers = getIncomers(currenNode, nodes, edges);
                if (incomers.every(incomer => planned.has(incomer.id))) {
                    //If all are planned and still invalid input then error
                    console.error("Invalid inputs ", currenNode.id, invalidInputs);
                    inputsWithErros.push({
                        nodeId: currenNode.id,
                        inputs: invalidInputs
                    })
                } else {
                    continue;
                }
            }

            //Valid
            nextPhase.nodes.push(currenNode);

        }
        for (const node of nextPhase.nodes) {
            planned.add(node.id);
        }
        executionPlan.push(nextPhase)
    }

    if (inputsWithErros.length > 0) return {
        error: {
            type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
            invalidElements: inputsWithErros
        }
    }

    return { executionPlan }
}



function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];

    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        const inputValue = node.data.inputs[input.name];
        const inputValueProvided = inputValue && inputValue.length > 0;
        if (inputValueProvided) continue;

        //If value not provided then check whether a node is connected to it.
        const incomingEdges = edges.filter(edge => edge.target === node.id);

        const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name);

        const requiredInputProvidedByVisitedOutput =
            input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source);

        if (requiredInputProvidedByVisitedOutput) {
            //input required and have valid value
            continue;
        } else if (!input.required) {
            //Input not required but output linked - need to sure output is planned
            if (!inputLinkedToOutput) continue;
            if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) continue; //output provided
        }

        invalidInputs.push(input.name);
    }


    return invalidInputs;
}


const getIncomers = (node: AppNode, nodes: AppNode[], edges: Edge[]) => {
    if (!node.id) {
        return [];
    }

    const incomersIds = new Set();

    edges.forEach(edge => {
        if (edge.target === node.id) {
            incomersIds.add(edge.source);
        }
    });

    return nodes.filter((node) => incomersIds.has(node.id));
}