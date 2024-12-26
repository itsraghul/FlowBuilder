import { TaskType } from "@/types/Tasks/task";
import { ExtractTextFromElment } from "./data-extractors/ExtractTextFromElment";
import { LaunchBrowserTask } from "./data-extractors/LaunchBrowser";
import { PageToHTML } from "./data-extractors/PageToHTML";
import { WorkflowTask } from "@/types/workflow";
import { FillInput } from "./user-interaction/FillInput";
import { ClickElement } from "./user-interaction/ClickElement";

type Registry = {
    [K in TaskType]: WorkflowTask & { type: K };
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHTML,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElment,
    [TaskType.FILL_INPUT]: FillInput,
    [TaskType.CLICK_ELEMENT]: ClickElement
};


