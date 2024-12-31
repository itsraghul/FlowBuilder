import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { Link2Icon, LucideProps } from "lucide-react";

export const NavigateURLTask = {
    type: TaskType.NAVIGATE_URL,
    label: "Navigate URL",
    icon: (props: LucideProps) => (<Link2Icon className="stroke-orange-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
            helperText: "",
            required: true
        },
        {
            name: "URL",
            type: TaskParamType.STRING,
            helperText: "Enter the url to navigate",
            required: true
        }
    ] as const,
    outputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ] as const,
    credits: 2
} satisfies WorkflowTask;