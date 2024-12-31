import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpIcon, LucideProps } from "lucide-react";

export const ScrollToElementTask = {
    type: TaskType.SCROLL_TO_ELEMENT,
    label: "Scroll To Element",
    icon: (props: LucideProps) => (<ArrowUpIcon className="stroke-orange-400" {...props} />),
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
            helperText: "Enter the selector to scroll",
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