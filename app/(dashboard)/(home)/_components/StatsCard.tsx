
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper/ReactCountUpWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import React from 'react'

interface Props {
    title: string;
    value: number;
    icon: LucideIcon;
}
export const StatsCard = (props: Props) => {
    const { title, value, icon: ICON } = props;
    return (
        <Card className='relative overflow-hidden h-full'>
            <CardHeader className='flex pb-2'>
                <CardTitle>{title}</CardTitle>
                <ICON size={120} className='text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10' />
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold text-primary'>
                    <ReactCountUpWrapper value={value} />
                </div>
            </CardContent>
        </Card>
    )
}
