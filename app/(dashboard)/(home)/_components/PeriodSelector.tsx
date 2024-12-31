"use client";


import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import { Period } from '@/types/analytics';
import { useRouter, useSearchParams } from 'next/navigation';

import React from 'react'


const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]
const PeriodSelector = ({ periods, selectedPeriod }: { periods: Period[], selectedPeriod: Period }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onSelectValueChange = (value: string) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
    }
    return (
        <Select onValueChange={onSelectValueChange} value={`${selectedPeriod.month}-${selectedPeriod.year}`}>
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {
                    periods.map((period, index) => (
                        <SelectItem key={index} value={`${period.month}-${period.year}`}>{`${MONTH_NAMES[period.month]} ${period.year}`}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}

export default PeriodSelector;