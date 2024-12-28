import { TaskType } from "@/types/Tasks/task";
import { LaunchBrowserExecutor } from "./data-extractors/LaunchBrowserExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHTMLExecutor } from "./data-extractors/PageToHTMLExecutor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./data-extractors/ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./user-interactions/FillInputExecutor";
import { ClickElementExecutor } from "./user-interactions/ClickElementExecutor";
import { WaitForElementExecutor } from "./timing-controls/WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./storing-data/DeliverViaWebhookExecutor";
import { ExtractAllTextFromSimilarSelectorTaskExecutor } from "./data-extractors/ExtractAllTextFromSimilarSelectorTaskExecutor";
import { ExtractDataWithAIExecutor } from "./data-extractors/ExtractDataWithAIExecutor";
import { ReadPropertyFromJSONExecutor } from "./data-storage/ReadPropertyFromJSONExecutor";



type Registry = {
    [K in TaskType]: (environment: ExecutionEnvironment<WorkflowTask & { type: K }>) => Promise<boolean>;
}

export const ExecutorRegistry: Registry = {
    [TaskType.LAUNCH_BROWSER]: LaunchBrowserExecutor,
    [TaskType.PAGE_TO_HTML]: PageToHTMLExecutor,
    [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElementExecutor,
    [TaskType.FILL_INPUT]: FillInputExecutor,
    [TaskType.CLICK_ELEMENT]: ClickElementExecutor,
    [TaskType.WAIT_FOR_ELEMENT]: WaitForElementExecutor,
    [TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebhookExecutor,
    [TaskType.EXTRACT_ALL_TEXT_FROM_SIMILAR_SELECTOR]: ExtractAllTextFromSimilarSelectorTaskExecutor,
    [TaskType.EXTRACT_DATA_WITH_AI]: ExtractDataWithAIExecutor,
    [TaskType.READ_PROPERTY_FROM_JSON]: ReadPropertyFromJSONExecutor
}