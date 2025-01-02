import { Browser, Page } from "puppeteer";
import { type Browser as BrowserCore, type Page as PageCore } from 'puppeteer-core';
import { WorkflowTask } from "./workflow";
import { LogCollector } from "./log";

export type Environment = {
    browser?: Browser | BrowserCore;
    page?: Page;
    //phases with phaseID as key
    phases: {
        [key: string]: {
            inputs: Record<string, string>;
            outputs: Record<string, string>;
        }
    }
}


export type ExecutionEnvironment<T extends WorkflowTask> = {
    getInput(name: T["inputs"][number]["name"]): string;
    setOutput(name: T["outputs"][number]["name"], value: string): void;
    getBrowser(): Browser | BrowserCore | undefined;
    setBrowser(browser: Browser | BrowserCore): void;
    getPage(): Page | undefined;
    setPage(page: Page | PageCore): void;

    log: LogCollector;
}