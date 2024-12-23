import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, CodeIcon, Type } from "lucide-react";

export const PageToHTML = {
    type: TaskType.PAGE_TO_HTML,
    label: "Get HTML from Page",
    icon: (props: LucideProps) => (<CodeIcon className="stroke-rose-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "Web Page",
            type: TaskParamType.BROWSER_INSTANCE,
            helperText: "",
            required: true
        }
    ] as const,
    outputs: [
        {
            name: "Html",
            type: TaskParamType.STRING
        },
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
    credits: 2
} satisfies WorkflowTask;