"use client";

import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Layers2Icon } from 'lucide-react';
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;

const chartConfig = {
    success: {
        label: "Success",
        color: "hsl(var(--chart-2))"
    },
    failed: {
        label: "Failed",
        color: "hsl(var(--chart-1))"
    }
}
const ExecutionStatusChart = ({ data }: { data: ChartData }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                    <Layers2Icon className='w-6 h-6 text-primary' />
                    Workflow Execution Status
                </CardTitle>
                <CardDescription>
                    Daily number of successfull and failed workflow executions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className='max-h-[200px] w-full'>
                    <AreaChart data={data} height={200} accessibilityLayer margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey={"date"} tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={
                            value => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        } />
                        <ChartLegend content={<ChartLegendContent />} />
                        <ChartTooltip content={
                            <ChartTooltipContent className='w-[250px]' />
                        } />
                        <Area min={0}
                            type={"monotone"}
                            fill='var(--color-success)' dataKey={"success"}
                            fillOpacity={0.6}
                            stroke='var(--color-success)'
                            stackId={"a"}
                        />
                        <Area min={0}
                            type={"monotone"}
                            fill='var(--color-failed)' dataKey={"failed"}
                            fillOpacity={0.6}
                            stroke='var(--color-failed)'
                            stackId={"b"}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default ExecutionStatusChart