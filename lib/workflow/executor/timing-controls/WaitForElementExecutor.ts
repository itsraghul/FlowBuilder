
import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../../task/timing-controls/WaitForElement";



export const WaitForElementExecutor = async (environment: ExecutionEnvironment<typeof WaitForElementTask>): Promise<boolean> => {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("Input->Selector not defined");
        }

        const visibility = environment.getInput("Visibility");
        if (!visibility) {
            environment.log.error("Input->Visibility not defined");
        }

        await environment.getPage()!.waitForSelector(selector, {
            visible: visibility === "visible",
            hidden: visibility === "hidden"
        });

        environment.log.info(`Element ${selector} became:  ${visibility}`);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}