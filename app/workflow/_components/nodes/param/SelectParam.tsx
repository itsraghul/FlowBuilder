"use client";

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ParamProps } from '@/types/Nodes/appNodes';
import React, { useId } from 'react'


type OptionType = {
    label: string,
    value: string
}
const SelectParam = ({ param, updateNodeParamValue, value }: ParamProps) => {
    const id = useId();

    const onValueChange = (value: string) => {
        updateNodeParamValue(value)
    }

    return (
        <div className='flex flex-col gap-1 w-full'>
            <Label htmlFor={id} className='text-xs flex' >
                {param.name}
                {param.required && <p className='text-red-400 px-2'>*</p>}
            </Label>
            <Select onValueChange={(value) => onValueChange(value)} defaultValue={value}>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select a option" />
                </SelectTrigger>
                <SelectContent >
                    <SelectGroup>
                        <SelectLabel>Option</SelectLabel>
                        {param.options.map((option: OptionType) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default SelectParam;