import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { EyeIcon, LucideProps } from "lucide-react";

export const WaitForElementTask = {
    type: TaskType.WAIT_FOR_ELEMENT,
    label: "Wait for Element",
    icon: (props: LucideProps) => (<EyeIcon className="stroke-amber-400" {...props} />),
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
        },
        {
            name: "Visibility",
            type: TaskParamType.SELECT,
            hideHandle: true,
            required: true,
            options: [
                { label: "Visibile", value: "visible" },
                { label: "Hidden", value: "hidden" }
            ]
        },
    ] as const,
    outputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
    credits: 1
} satisfies WorkflowTask;