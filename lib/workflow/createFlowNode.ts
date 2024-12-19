import { AppNode } from "@/types/Nodes/appNodes"
import { TaskType } from "@/types/Tasks/task"

export const CreateFlowNode = (nodeType: TaskType, position?: { x: number, y: number }): AppNode => {
    return {
        id: crypto.randomUUID(),
        type: "WebScrapeNode",
        dragHandle: ".drag-handle",
        data: {
            type: nodeType,
            inputs: {}
        },
        position: position ?? { x: 0, y: 0 }
    }
}