import { TaskParamType, TaskType } from "@/types/Tasks/task";
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
    ],
    outputs: [
        {
            name: "Html",
            type: TaskParamType.STRING
        },
        {
            name: "Web page",
            type: TaskParamType.STRING
        }
    ]
}