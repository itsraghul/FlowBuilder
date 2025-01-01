import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { LetterText, LucideProps } from "lucide-react";

export const ExtractAllTextFromSimilarSelectorTask = {
    type: TaskType.EXTRACT_ALL_TEXT_FROM_SIMILAR_SELECTOR,
    label: "Extract Texts as Array",
    icon: (props: LucideProps) => (<LetterText className="stroke-rose-400" {...props} />),
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