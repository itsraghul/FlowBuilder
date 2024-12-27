import { TaskParamType } from "@/types/Tasks/task";

export const ColorForHandle: Record<TaskParamType, string> = {
    BROWSER_INSTANCE: "!bg-sky-400",
    STRING: "!bg-amber-400",
    [TaskParamType.SELECT]: "!bg-rose-400"
}