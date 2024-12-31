
import { ExecutionEnvironment } from "@/types/executor";
import { NavigateURLTask } from "../../task/user-interaction/NavigateURL";



export const NavigateToURLExecutor = async (environment: ExecutionEnvironment<typeof NavigateURLTask>): Promise<boolean> => {
    try {

        const url = environment.getInput("URL");
        if (!url) {
            environment.log.error("Input->URL not defined");
        }

        await environment.getPage()!.goto(url);
        environment.log.info(`Visited URL : ${url}`);

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}