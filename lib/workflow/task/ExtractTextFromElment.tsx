import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElment = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label: "Extract Text from Element",
    icon: (props: LucideProps) => (<TextIcon className="stroke-rose-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "HTML",
            type: TaskParamType.STRING,
            helperText: "",
            required: true,
            variant: "textarea"
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            helperText: "Enter the selector to extract text",
            required: true
        }
    ] as const,
    outputs: [
        {
            name: "Extracted Text",
            type: TaskParamType.STRING
        }
    ] as const,
    credits: 3
} satisfies WorkflowTask;