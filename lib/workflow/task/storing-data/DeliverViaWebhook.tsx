import { TaskParamType, TaskType } from "@/types/Tasks/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, SendIcon } from "lucide-react";

export const DeliverViaWebhookTask = {
    type: TaskType.DELIVER_VIA_WEBHOOK,
    label: "Deliver vis Webhook",
    icon: (props: LucideProps) => (<SendIcon className="stroke-blue-400" {...props} />),
    isEntryPoint: false,
    inputs: [
        {
            name: "Target URL",
            type: TaskParamType.STRING,
            helperText: "",
            required: true
        },
        {
            name: "Body",
            type: TaskParamType.STRING,
            helperText: "Enter the selector to click",
            required: true
        }
    ] as const,
    outputs: [] as const,
    credits: 1
} satisfies WorkflowTask;