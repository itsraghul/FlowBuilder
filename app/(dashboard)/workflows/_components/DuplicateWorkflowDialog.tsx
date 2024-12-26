"use client"

import CustomDialogHeader from '@/components/CustomDialogHeader/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { duplicateWorkFlowSchema, duplicateWorkflowSchemaType } from '@/schema/workflows';
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react';
import React, { useCallback, useState } from 'react'
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkflowType } from '@/types/workflow';
import { DuplicateWorkflow } from '@/actions/workflows/duplicateWorkflow';
import { cn } from '@/lib/utils';
import TooltipWrapper from '@/components/TooltipWrapper/TooltipWrapper';


const DuplicateWorkflowDialog = ({ workflowId }: { workflowId: string }) => {
    const [open, setOpen] = useState<boolean>();

    const form = useForm<duplicateWorkflowSchemaType>({
        resolver: zodResolver(duplicateWorkFlowSchema),
        defaultValues: {
            workflowId,
            type: WorkflowType.WEBSCRAPPER
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: DuplicateWorkflow,
        onSuccess: () => {
            toast.success("Workflow Duplicated", { id: "duplicate-workflow" });
            setOpen((prev) => !prev);
        },
        onError: () => {
            toast.error("Failed to duplicate workflow.", { id: "duplicate-workflow" });
        },
    });

    const onSubmit = useCallback((values: duplicateWorkflowSchemaType) => {
        toast.loading("Duplicating Workflow...", { id: "duplicate-workflow" });
        mutate(values);
    }, [mutate]);

    const onFunctionFormOpen = (open: any) => {
        form.reset();
        setOpen(open);
    }

    return (
        <Dialog open={open} onOpenChange={onFunctionFormOpen}>
            <DialogTrigger asChild>

                <Button variant={'ghost'} size={'icon'} className={cn('ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100')}>
                    <TooltipWrapper content="Duplicate Workflow">
                        <div className='flex items-center justify-center w-full h-full'>
                            <CopyIcon className='w-4 h-4 cursor-pointer text-muted-foreground' />
                        </div>
                    </TooltipWrapper>
                </Button>

            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader icon={Layers2Icon} title='Duplicate Workflow' subTitle="Duplicate exisitng workflow" />
                <div className="p-6">
                    <Form {...form}>
                        <form action="" className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItemBox
                                        label={"Name"}
                                        field={{ ...field }}
                                        description={"Choose a descriptive and unique name."}
                                        isRequired={true}
                                        renderInputElement={(field: ControllerRenderProps) => <Input {...field} />}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItemBox
                                        label={"Description"}
                                        field={{ ...field }}
                                        description={"Provide a clear description of your workflow. It may help in understanding the workflow's purpose."}
                                        isRequired={false}
                                        renderInputElement={(field: ControllerRenderProps) => <Textarea className='resize-none' {...field} />} />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItemBox
                                        label={"Type"}
                                        field={{ ...field }}
                                        description={"Provide the type of workflow to be created."}
                                        isRequired={true}
                                        renderInputElement={(field: ControllerRenderProps) => {
                                            return <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Currently only web/api scrapper is supported. More types will be introduced in the future." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={WorkflowType.WEBSCRAPPER}>Web Scrapper</SelectItem>
                                                    <SelectItem value={WorkflowType.COMMON_APP_INTEGRATION}>Common App Integration</SelectItem>
                                                    <SelectItem value={WorkflowType.WEB_AUTOMATION_TESTING}>Web Automation Testing</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        }} />
                                )}
                            />
                            <Button type='submit' className='w-full' disabled={isPending}>
                                {!isPending && "Proceed"}
                                {isPending && <Loader2 className='animate-spin' />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog >
    )
}

interface formItemProps {
    label: string;
    description: string;
    field: ControllerRenderProps;
    isRequired?: boolean;
    renderInputElement: Function;
}

const FormItemBox = (props: formItemProps) => {
    const { label, description, field, isRequired = false, renderInputElement } = props;
    return (<FormItem>
        <FormLabel className='flex gap-1 items-center'>
            {label}
            {isRequired && <p className="text-xs text-primary">(required)</p>}
        </FormLabel>
        <FormControl>
            {renderInputElement(field)}
        </FormControl>
        <FormDescription>
            {description}
        </FormDescription>
        <FormMessage />
    </FormItem>)
}

export default DuplicateWorkflowDialog