"use client"

import CustomDialogHeader from '@/components/CustomDialogHeader/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { createWorkFlowSchema, createWorkflowSchemaType } from '@/schema/workflows';
import { Layers2Icon, Loader2 } from 'lucide-react';
import React, { useCallback, useState } from 'react'
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { CreateWorkFlow } from '@/actions/workflows/createWorkflow';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const CreateWorkflowDialog = ({ triggerText }: { triggerText?: string }) => {
    const [open, setOpen] = useState();

    const form = useForm<createWorkflowSchemaType>({
        resolver: zodResolver(createWorkFlowSchema),
        defaultValues: {}
    });

    const { mutate, isPending } = useMutation({
        mutationFn: CreateWorkFlow,
        onSuccess: () => {
            toast.success("Workflow Created", { id: "create-workflow" });
        },
        onError: () => {
            toast.error("Failed to create workflow.", { id: "create-workflow" });
        },
    });

    const onSubmit = useCallback((values: createWorkflowSchemaType) => {
        toast.loading("Creating Workflow...", { id: "create-workflow" });
        mutate(values);
    }, [mutate]);

    const onFunctionFormOpen = (open: any) => {
        form.reset();
        setOpen(open);
    }

    return (
        <Dialog open={open} onOpenChange={onFunctionFormOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Create Workflow"}</Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader icon={Layers2Icon} title='Create Workflow' subTitle="Start creating your workflow" />
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
                                                        <SelectValue placeholder="Select the type of workflow" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="FORM">Form Site</SelectItem>
                                                    <SelectItem value="PLAIN">Plain Site</SelectItem>
                                                    <SelectItem value="CHART">Chart Site</SelectItem>
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

export default CreateWorkflowDialog