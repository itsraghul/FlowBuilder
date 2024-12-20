import { TaskType } from "@/types/Tasks/task";
import { ExtractTextFromElment } from "./ExtractTextFromElment";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHTML } from "./PageToHTML";
import { WorkflowTask } from "@/types/workflow";

type Registry = {
    [K in TaskType]: WorkflowTask & { type: K };
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHTML,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElment
};


