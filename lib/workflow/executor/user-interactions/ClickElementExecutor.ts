
import { ExecutionEnvironment } from "@/types/executor";
import { ClickElement } from "../../task/user-interaction/ClickElement";
import { waitFor } from "@/lib/helper/waitFor";



export const ClickElementExecutor = async (environment: ExecutionEnvironment<typeof ClickElement>): Promise<boolean> => {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("Input->Selector not defined");
        }

        await environment.getPage()!.click(selector);
        await waitFor(3000);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}