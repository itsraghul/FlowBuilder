import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { LucideProps, GlobeIcon } from "lucide-react";

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props: LucideProps) => (<GlobeIcon className="stroke-ink-400" {...props} />),
    isEntryPoint: true,
    inputs: [
        {
            name: "Website Url",
            type: TaskParamType.STRING,
            helperText: "Eg: https://www.google.com",
            required: true,
            hideHandle: true
        }
    ],
    outputs: [
        {
            name: "Web Page",
            type: TaskParamType.BROWSER_INSTANCE
        }
    ]
}