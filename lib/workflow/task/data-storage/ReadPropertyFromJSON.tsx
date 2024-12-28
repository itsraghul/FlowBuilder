import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { FileJson2Icon, LucideProps } from "lucide-react";

export const ReadPropertyFromJSONTask = {
    type: TaskType.READ_PROPERTY_FROM_JSON,
    label: "Read Property From JSON",
    icon: (props: LucideProps) => (<FileJson2Icon className="stroke-orange-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "JSON",
            type: TaskParamType.STRING,
            helperText: "",
            required: true
        },
        {
            name: "Property Name",
            type: TaskParamType.STRING,
            helperText: "Enter the property to get value",
            required: true
        }
    ] as const,
    outputs: [
        {
            name: "Property Value",
            type: TaskParamType.STRING
        }
    ] as const,
    credits: 1
} satisfies WorkflowTask;