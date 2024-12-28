
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../../task/data-extractors/ExtractDataWithAITask";
import prisma from "@/lib/prisma";
import { symmentricDecrypt } from "@/lib/encryption";
import OpenAI from "openai"

const AIROLE = "You are a webscrapper helper taht extracts data from HTML or text. You will be given a piece of text or HTML content as input and also prompt with data you want to extract. The response should always be only the extracted data as JSON array or object, without any additional words or explanations. Analyse the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array or object without any surrounding text."

export const ExtractDataWithAIExecutor = async (environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> => {
    try {

        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("Input->Credentials not defined");
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("Input->Prompt not defined");
        }

        const content = environment.getInput("Content");
        if (!prompt) {
            environment.log.error("Input->Content not defined");
        }

        //Get credential from DB
        const credential = await prisma.credential.findUnique({
            where: {
                id: credentials
            }
        });

        if (!credential) {
            environment.log.error("Credential not found.");
            return false;
        }

        const plainCredential = symmentricDecrypt(credential.value);

        if (!plainCredential) {
            environment.log.error("Cannot decrypt credential");
            return false;
        }


        const openai = new OpenAI({
            apiKey: plainCredential
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: AIROLE
                },
                {
                    role: "user",
                    content: content
                }, {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 1
        });

        environment.log.info(`Prompt tokens : ${response.usage?.prompt_tokens}`);
        environment.log.info(`Completion tokens : ${response.usage?.completion_tokens}`);

        const result = response.choices[0].message?.content;
        if (!result) {
            environment.log.error("Empty response from AI");
            return false;
        }

        environment.setOutput("Extracted Data", result);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}