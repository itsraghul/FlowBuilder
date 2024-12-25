import { AppNode } from "@/types/Nodes/appNodes";
import { TaskRegistry } from "./task/registry";


export const CalculateWorkflowCost = (nodes: AppNode[]) => {
    return nodes.reduce((acc, node) => acc + TaskRegistry[node.data.type].credits, 0);
}