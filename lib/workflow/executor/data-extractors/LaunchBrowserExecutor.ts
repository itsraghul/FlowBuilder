
import { ExecutionEnvironment } from "@/types/executor";
import puppeteer, { Browser } from "puppeteer";
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { LaunchBrowserTask } from "../../task/data-extractors/LaunchBrowser";


export const LaunchBrowserExecutor = async (environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> => {
    try {
        const webSiteUrl = environment.getInput("Website Url");
        let browser: Browser | BrowserCore;
        if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
            const executablePath = await chromium.executablePath(process.env.CHROME_CDN_LINK);
            browser = await puppeteerCore.launch({
                executablePath,
                // You can pass other configs as required
                args: chromium.args,
                headless: chromium.headless,
                defaultViewport: chromium.defaultViewport
            })
        } else {
            browser = await puppeteer.launch({
                headless: true
            });
        }
        environment.log.info(`Browser has been launched successfully.`);
        environment.setBrowser(browser);
        const page = await browser.newPage();
        await page.goto(webSiteUrl);
        environment.setPage(page);
        environment.log.info(`Page ${webSiteUrl} has been opened successfully.`);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false
    }
}