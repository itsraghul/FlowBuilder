
import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../../task/storing-data/DeliverViaWebhook";



export const DeliverViaWebhookExecutor = async (environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>): Promise<boolean> => {
    try {
        const webhookURL = environment.getInput("Target URL");
        if (!webhookURL) {
            environment.log.error("Input->Target URL not defined");
        }

        const body = environment.getInput("Body");
        if (!body) {
            environment.log.error("Input->Body URL not defined");
        }

        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const statusCode = response.status;
        if (statusCode !== 200) {
            environment.log.error(`Request Failed: Status Code : ${statusCode}`);
            return false;
        };

        const responseBody = await response.json();
        environment.log.info(JSON.stringify(responseBody, null, 4))

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}