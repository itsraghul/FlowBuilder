import { WorkflowType } from '@/types/workflow';
import { z } from 'zod';


export const createWorkFlowSchema = z.object({
    name: z.string().max(50),
    description: z.string().max(100).optional(),
    type: z.enum([WorkflowType.WEBSCRAPPER, WorkflowType.COMMON_APP_INTEGRATION, WorkflowType.WEB_AUTOMATION_TESTING])
})

export type createWorkflowSchemaType = z.infer<typeof createWorkFlowSchema>;


export type duplicateWorkflowSchemaType = z.infer<typeof duplicateWorkFlowSchema>;

export const duplicateWorkFlowSchema = z.object({
    workflowId: z.string(),
    name: z.string().max(50),
    description: z.string().max(100).optional(),
    type: z.enum([WorkflowType.WEBSCRAPPER, WorkflowType.COMMON_APP_INTEGRATION, WorkflowType.WEB_AUTOMATION_TESTING])
})