import { TaskType } from "@/types/Tasks/task";
import { LaunchBrowserExecutor } from "./data-extractors/LaunchBrowserExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHTMLExecutor } from "./data-extractors/PageToHTMLExecutor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./data-extractors/ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./user-interactions/FillInputExecutor";
import { ClickElementExecutor } from "./user-interactions/ClickElementExecutor";



type Registry = {
    [K in TaskType]: (environment: ExecutionEnvironment<WorkflowTask & { type: K }>) => Promise<boolean>;
}

export const ExecutorRegistry: Registry = {
    [TaskType.LAUNCH_BROWSER]: LaunchBrowserExecutor,
    [TaskType.PAGE_TO_HTML]: PageToHTMLExecutor,
    [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementExecutor,
    [TaskType.FILL_INPUT]: FillInputExecutor,
    [TaskType.CLICK_ELEMENT]: ClickElementExecutor
}