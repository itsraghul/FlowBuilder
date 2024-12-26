"use client";

import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron';
import CustomDialogHeader from '@/components/CustomDialogHeader/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogFooter, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Calendar, ClockIcon, TriangleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import cronstrue from 'cronstrue';
import parser from "cron-parser"
import { RemoveWorkflowScheduler } from '@/actions/workflows/removeWorkflowSchedule';
import { Separator } from '@/components/ui/separator';

const SchedulerDialog = ({ workflowId, cron: defaultCron }: { workflowId: string, cron: string | null }) => {
    const [cron, setCron] = useState(defaultCron || "");
    const [validCron, setValidCron] = useState(false);
    const [readableCron, setReadableCron] = useState("");

    const mutatation = useMutation({
        mutationFn: UpdateWorkflowCron,
        onSuccess: () => {
            toast.success("Schedule Updated Successfully", { id: "cron" })
        },
        onError: () => {
            toast.error("Schedule Update Failed", { id: "cron" });
        }
    });

    const removeScheduleMutation = useMutation({
        mutationFn: RemoveWorkflowScheduler,
        onSuccess: () => {
            toast.success("Schedule Removed Successfully", { id: "cron" })
        },
        onError: () => {
            toast.error("Schedule Remove Failed", { id: "cron" });
        }
    });

    const removeScheduleClick = () => {
        toast.loading("Removing Scheduler...", { id: "cron" })
        removeScheduleMutation.mutate(workflowId);
    }

    const onCronInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setCron(event.target.value);

    const onScheduleSave = () => {
        toast.loading("Saving...", { id: "cron" })
        mutatation.mutate({
            id: workflowId, cron
        });

    };

    useEffect(() => {
        try {
            parser.parseExpression(cron);
            const humanCronStr = cronstrue.toString(cron);
            setValidCron(true);
            setReadableCron(humanCronStr);
        } catch (error) {
            setValidCron(false);
        }
    }, [cron]);


    const workflowHasValidCron = defaultCron && defaultCron.length > 0;
    const readableSavedCron = workflowHasValidCron && cronstrue.toString(defaultCron);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'link'} size={'sm'} className={cn("text-sm p-0 h-auto text-orange-500",
                    workflowHasValidCron && "text-primary"
                )}>
                    {workflowHasValidCron &&
                        <div className='flex items-center gap-2'>
                            <ClockIcon />
                            {readableSavedCron}
                        </div>
                    }
                    {!workflowHasValidCron && <div className='flex items-center gap-1'>
                        <TriangleAlert className='h-3 w-3' />Set Schedule
                    </div>}
                </Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader title='Schedule Workflow Execution' icon={Calendar} />
                <div className="p-6 space-y-4">
                    <p className='text-muted-foreground text-sm'>
                        Specify a cron expression to schedule periodic workflow execution. All times are in UTC.
                    </p>
                    <Input placeholder='E.g. * * * * *' value={cron} onChange={onCronInputChange} />
                    <div className={cn("bg-accent rounded-md p-4 border text-sm border-destructive text-destructive", validCron && "border-primary text-primary")}>
                        {validCron ? readableCron : "Not a valid cron expression"}
                    </div>

                    {workflowHasValidCron && <DialogClose asChild>
                        <div>
                            <Button className='w-full text-destructive border-destructive hover:text-destructive'
                                variant={'outline'} disabled={mutatation.isPending || removeScheduleMutation.isPending}
                                onClick={removeScheduleClick}
                            >
                                Remove Current Schedule
                            </Button>
                            <Separator className='my-4' />
                        </div>
                    </DialogClose>}
                </div>
                <DialogFooter className='px-6 gap-2'>
                    <DialogClose asChild>
                        <Button className='w-full' variant={'secondary'} >
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button className='w-full' disabled={mutatation.isPending || !validCron} onClick={onScheduleSave}>
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default SchedulerDialog;