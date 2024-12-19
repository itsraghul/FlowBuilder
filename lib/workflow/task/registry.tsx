import { ExtractTextFromElment } from "./ExtractTextFromElment";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHTML } from "./PageToHTML";

export const TaskRegistry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHTML,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElment
};


