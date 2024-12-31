import { TaskType } from "@/types/Tasks/task";
import { ExtractTextFromElment } from "./data-extractors/ExtractTextFromElment";
import { LaunchBrowserTask } from "./data-extractors/LaunchBrowser";
import { PageToHTML } from "./data-extractors/PageToHTML";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./user-interaction/FillInput";
import { ClickElementTask } from "./user-interaction/ClickElement";
import { WaitForElementTask } from "./timing-controls/WaitForElement";
import { DeliverViaWebhookTask } from "./storing-data/DeliverViaWebhook";
import { ExtractAllTextFromSimilarSelectorTask } from "./data-extractors/ExtractAllTextFromSimilarSelector";
import { ExtractDataWithAITask } from "./data-extractors/ExtractDataWithAITask";
import { ReadPropertyFromJSONTask } from "./data-storage/ReadPropertyFromJSON";
import { AddPropertyToJSONTask } from "./data-storage/AddPropertyToJSON";
import { NavigateURLTask } from "./user-interaction/NavigateURL";
import { ScrollToElementTask } from "./user-interaction/ScrollToElement";

type Registry = {
    [K in TaskType]: WorkflowTask & { type: K };
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHTML,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElment,
    [TaskType.FILL_INPUT]: FillInputTask,
    [TaskType.CLICK_ELEMENT]: ClickElementTask,
    [TaskType.WAIT_FOR_ELEMENT]: WaitForElementTask,
    [TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebhookTask,
    [TaskType.EXTRACT_ALL_TEXT_FROM_SIMILAR_SELECTOR]: ExtractAllTextFromSimilarSelectorTask,
    [TaskType.EXTRACT_DATA_WITH_AI]: ExtractDataWithAITask,
    [TaskType.READ_PROPERTY_FROM_JSON]: ReadPropertyFromJSONTask,
    [TaskType.ADD_PROPERTY_TO_JSON]: AddPropertyToJSONTask,
    [TaskType.NAVIGATE_URL]: NavigateURLTask,
    [TaskType.SCROLL_TO_ELEMENT]: ScrollToElementTask,
};


