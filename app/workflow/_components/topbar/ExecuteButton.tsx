"use client";

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import React from 'react'

const ExecuteButton = ({ workflowId }: { workflowId: string }) => {
    return (
        <Button
            variant={'outline'} className='flex items-center gap-2' onClick={() => { }} >
            <Play size={16} className='stroke-orange-400' /> Execute
        </Button>
    )
}

export default ExecuteButton