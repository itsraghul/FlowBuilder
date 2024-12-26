import * as cheerio from "cheerio";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElment } from "../../task/data-extractors/ExtractTextFromElment";


export const ExtractTextFromElementExecutor = async (environment: ExecutionEnvironment<typeof ExtractTextFromElment>): Promise<boolean> => {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("Selector not defined.");
            return false;
        }

        const html = environment.getInput("HTML");
        if (!html) {
            environment.log.error("HTML not found");
            return false;
        }

        const $ = cheerio.load(html);
        const element = $(selector);

        if (!element) {
            environment.log.error("Element not found - " + selector);
            return false;
        }

        const extractedText = $.text(element);

        if (!extractedText) {
            environment.log.error("Element does not have text");
            return false;
        }

        environment.setOutput("Extracted Text", extractedText);

        return true;
    } catch (error: any) {
        console.error(error.message);
        return false
    }
}