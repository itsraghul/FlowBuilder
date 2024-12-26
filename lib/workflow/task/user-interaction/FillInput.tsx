import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { Edit3Icon } from "lucide-react";

export const FillInput = {
    type: TaskType.FILL_INPUT,
    label: "Fill Input to field",
    icon: (props) => (<Edit3Icon className="stroke-orange-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "Web Page",
            type: TaskParamType.BROWSER_INSTANCE,
            helperText: "",
            required: true
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            helperText: "",
            required: true
        },
        {
            name: "Value",
            type: TaskParamType.STRING,
            helperText: "",
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