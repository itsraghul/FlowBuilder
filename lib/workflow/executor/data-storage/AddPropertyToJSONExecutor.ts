
import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJSONTask } from "../../task/data-storage/AddPropertyToJSON";



export const AddPropertyToJSONExecutor = async (environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>): Promise<boolean> => {
    try {
        const JSONData = environment.getInput("JSON");
        if (!JSONData) {
            environment.log.error("Input->JSON not defined");
        }

        const propertyName = environment.getInput("Property Name");
        if (!propertyName) {
            environment.log.error("Input->Property Name not defined");
        }

        const propertyValue = environment.getInput("Property Value");
        if (!propertyValue) {
            environment.log.error("Input->Property Value not defined");
        }

        const json = JSON.parse(JSONData);
        json[propertyName] = propertyValue;

        environment.log.info(`Value -> ${propertyValue} added to key -> ${propertyName}`);
        environment.setOutput("Updated JSON", json);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}