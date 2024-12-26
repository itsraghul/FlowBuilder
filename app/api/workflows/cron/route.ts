import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";



export async function GET(req: Request) {
    const now = new Date();
    const workflows = await prisma.workflow.findMany({
        select: { id: true },
        where: {
            status: WorkflowStatus.PUBLISHED_LOCAL,
            cron: { not: null },
            nextRunAt: { lte: now }
        }
    });

    for (const workflow of workflows) {
        triggerWorkflow(workflow.id);
    }


    return Response.json({ workflowsToRun: workflows.length }, { status: 200 })
};


const triggerWorkflow = (workflowId: string) => {
    const triggerApiURL = getAppUrl(`/api/workflows/execute?workflowId=${workflowId}`);

    console.log("TriggerURL", triggerApiURL)

    fetch(triggerApiURL, {
        headers: {
            Authorization: `Bearer ${process.env.API_SECRET}`
        },
        cache: "no-store",
        // signal: AbortSignal.timeout(20000)
    }).catch(error => console.error("Error triggering workflow with id ", workflowId, " error --> ", error.message));
}