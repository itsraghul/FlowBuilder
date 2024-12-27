
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../../task/user-interaction/FillInput";



export const FillInputExecutor = async (environment: ExecutionEnvironment<typeof FillInputTask>): Promise<boolean> => {
    try {
        const html = await environment.getPage()!.content();
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("Input->Selector not defined");
        }

        const value = environment.getInput("Value");
        if (!value) {
            environment.log.error("Input->Value not defined");
        }

        await environment.getPage()!.type(selector, value);

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}