import { TaskType } from "@/types/Tasks/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHTMLExecutor } from "./PageToHTMLExecutor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";



type Registry = {
    [K in TaskType]: (environment: ExecutionEnvironment<WorkflowTask & { type: K }>) => Promise<boolean>;
}

export const ExecutorRegistry: Registry = {
    [TaskType.LAUNCH_BROWSER]: LaunchBrowserExecutor,
    [TaskType.PAGE_TO_HTML]: PageToHTMLExecutor,
    [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementExecutor
}