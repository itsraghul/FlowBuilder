"use client"

import CustomDialogHeader from '@/components/CustomDialogHeader/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, ShieldEllipsis } from 'lucide-react';
import React, { useCallback, useState } from 'react'
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCredentialSchema, createCredentialSchemaType } from '@/schema/credential';
import { CreateCredential } from '@/actions/credentials/createCredential';


const CreateCredentialDialog = ({ triggerText }: { triggerText?: string }) => {
    const [open, setOpen] = useState<boolean>();

    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: {
        }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCredential,
        onSuccess: () => {
            toast.success("Credential Created", { id: "create-credential" });
            form.reset()
            setOpen((prev) => !prev);
        },
        onError: () => {
            toast.error("Failed to create credential.", { id: "create-credential" });
        },
    });

    const onSubmit = useCallback((values: createCredentialSchemaType) => {
        toast.loading("Creating Workflow...", { id: "create-credential" });
        mutate(values);
    }, [mutate]);

    const onFunctionFormOpen = (open: any) => {
        setOpen(open);
    }

    return (
        <Dialog open={open} onOpenChange={onFunctionFormOpen}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? "Create"}</Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader icon={ShieldEllipsis} title='Create Credential' subTitle="Start creating your credential" />
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
                                        description={"Choose a descriptive and unique name for the credential. This name will be used to identify the credential."}
                                        isRequired={true}
                                        renderInputElement={(field: ControllerRenderProps) => <Input {...field} />}
                                    />
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItemBox
                                        label={"Value"}
                                        field={{ ...field }}
                                        description={"Enter the value associated with this credential. This value will be securely encrypted and stored."}
                                        isRequired={true}
                                        renderInputElement={(field: ControllerRenderProps) => <Textarea className='resize-none' {...field} />} />
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

export default CreateCredentialDialog