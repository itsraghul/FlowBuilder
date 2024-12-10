"use client"

import { AlertCircle } from 'lucide-react';
import React from 'react'
import { AlertDescription, AlertTitle, Alert } from '../ui/alert';

const AlertBox = ({ title, description }: { title: string, description: string }) => {
    return (
        <Alert variant={"destructive"}>
            <AlertCircle className='w-4 h-4' />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    )
}

export default AlertBox;