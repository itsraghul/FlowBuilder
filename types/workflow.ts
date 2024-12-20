import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "./Tasks/task";
import { AppNode } from "./Nodes/appNodes";

export enum WorkflowStatus {
    DRAFT = "DRAFT",
    PUBLISHED_LOCAL = "PUBLISHED_LOCAL",
    PUBLISHED_STORE = "PUBLISHED_STORE"
}


export enum WorkflowType {
    WEBSCRAPPER = "WEB_SCRAPPER",
    WEB_AUTOMATION_TESTING = "WEB_AUTOMATION_TESTING",
    COMMON_APP_INTEGRATION = "COMMON_APP_INTEGRATION"
}

export type WorkflowTask = {
    label: string;
    icon: React.FC<LucideProps>;
    type: TaskType;
    isEntryPoint?: boolean;
    inputs: TaskParam[];
    outputs: TaskParam[];
    credits: number;
}

export type WorkflowExecutionPlan = {
    phase: number;
    nodes: AppNode[];
}[];