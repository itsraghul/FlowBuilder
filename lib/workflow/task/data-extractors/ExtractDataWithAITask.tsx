import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon, LucideProps } from "lucide-react";

export const ExtractDataWithAITask = {
    type: TaskType.EXTRACT_DATA_WITH_AI,
    label: "Extract Data with AI",
    icon: (props: LucideProps) => (<BrainIcon className="stroke-rose-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "Content",
            type: TaskParamType.STRING,
            helperText: "",
            required: true
        },
        {
            name: "Credentials",
            type: TaskParamType.CREDENTIAL,
            required: true,
            hideHandle: true
        },
        {
            name: "Prompt",
            type: TaskParamType.STRING,
            helperText: "Enter the prompt",
            required: true,
            variant: "textarea"
        }
    ] as const,
    outputs: [
        {
            name: "Extracted Data",
            type: TaskParamType.STRING
        }
    ] as const,
    credits: 3
} satisfies WorkflowTask;