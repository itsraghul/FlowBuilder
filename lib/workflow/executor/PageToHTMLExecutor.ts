
import { ExecutionEnvironment } from "@/types/executor";
import { PageToHTML } from "../task/PageToHTML";


export const PageToHTMLExecutor = async (environment: ExecutionEnvironment<typeof PageToHTML>): Promise<boolean> => {
    try {
        const html = await environment.getPage()!.content();
        environment.setOutput("Html", html);
        environment.log.info("HTML extracted successfully from page.");
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}