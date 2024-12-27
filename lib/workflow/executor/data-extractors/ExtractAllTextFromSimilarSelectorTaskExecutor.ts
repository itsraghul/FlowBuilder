import * as cheerio from "cheerio";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractAllTextFromSimilarSelectorTask } from "../../task/data-extractors/ExtractAllTextFromSimilarSelector";


export const ExtractAllTextFromSimilarSelectorTaskExecutor = async (environment: ExecutionEnvironment<typeof ExtractAllTextFromSimilarSelectorTask>): Promise<boolean> => {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("Selector not defined.");
            return false;
        }
        console.log("Selector", selector);
        const html = environment.getInput("HTML");
        if (!html) {
            environment.log.error("HTML not found");
            return false;
        }

        const $ = cheerio.load(html);
        const elements = $(selector);

        if (!elements.length) {
            environment.log.error("Elements not found - " + selector);
            return false;
        }

        const extractedText: string[] = [];
        elements.each((index, element) => {
            extractedText.push($(element).text())
        })

        if (!extractedText.length) {
            environment.log.error("Elements does not have text");
            return false;
        }

        environment.setOutput("Extracted Text", JSON.stringify(extractedText));
        return true;
    } catch (error: any) {
        console.error(error.message);
        return false
    }
}