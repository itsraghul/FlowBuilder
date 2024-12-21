"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/Nodes/appNodes';
import React, { useEffect, useId, useState } from 'react'



const StringParam = ({ param, value, updateNodeParamValue, disabled }: ParamProps) => {
    const [internalValue, setInternalValue] = useState(value);
    const { name, required, helperText, variant } = param;
    const id = useId();

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    let Component: any = Input;
    if (variant === "textarea") {
        Component = Textarea
    }

    return (
        <div className='space-y-1 p-1 w-full'>
            <Label htmlFor={id} className='text-xs flex' >
                {name}
                {required && <p className='text-red-400 px-2'>*</p>}
            </Label>
            <Component
                id={id} value={internalValue}
                disabled={disabled}
                placeholder={disabled ? "Data Passed From Node" : 'Enter the value here'}
                className='text-xs bg-white'
                onChange={(e: any) => setInternalValue(e.target.value)}
                onBlur={(e: any) => updateNodeParamValue(e.target.value)}
            />
            {helperText && (
                <p className="text-muted-foreground px-2">
                    {helperText}
                </p>
            )}
        </div>
    )
}

export default StringParam