import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon, LucideProps } from "lucide-react";

export const AddPropertyToJSONTask = {
    type: TaskType.ADD_PROPERTY_TO_JSON,
    label: "Add Property To JSON",
    icon: (props: LucideProps) => (<DatabaseIcon className="stroke-orange-400" {...props} />),
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
            helperText: "Enter the property name",
            required: true
        },
        {
            name: "Property Value",
            type: TaskParamType.STRING,
            helperText: "Enter the property value",
            required: true
        }
    ] as const,
    outputs: [
        {
            name: "Updated JSON",
            type: TaskParamType.STRING
        }
    ] as const,
    credits: 1
} satisfies WorkflowTask;