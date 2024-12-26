import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, MousePointerClick } from "lucide-react";

export const ClickElement = {
    type: TaskType.CLICK_ELEMENT,
    label: "Click Element",
    icon: (props: LucideProps) => (<MousePointerClick className="stroke-orange-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
            helperText: "",
            required: true
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            helperText: "Enter the selector to click",
            required: true
        }
    ] as const,
    outputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
    credits: 1
} satisfies WorkflowTask;