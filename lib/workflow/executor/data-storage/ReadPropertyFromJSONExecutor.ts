
import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJSONTask } from "../../task/data-storage/ReadPropertyFromJSON";



export const ReadPropertyFromJSONExecutor = async (environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>): Promise<boolean> => {
    try {
        const JSONData = environment.getInput("JSON");
        if (!JSONData) {
            environment.log.error("Input->JSON not defined");
        }

        const property = environment.getInput("Property Name");
        if (!property) {
            environment.log.error("Input->Property Name not defined");
        }

        const json = JSON.parse(JSONData);
        const propertyValue = json[property];

        if (propertyValue === undefined) {
            environment.log.error("Property not found");
        }

        environment.setOutput("Property Value", propertyValue);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}