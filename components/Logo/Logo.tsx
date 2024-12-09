"use client"

import { cn } from '@/lib/utils'
import { ComputerIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react';

const Logo = ({
    fontSize = "2xl",
    iconSize = 20
}: {
    fontSize?: string,
    iconSize?: number
}) => {
    return (
        <Link href='/' className={cn("text-2xl font-extrabold flex items-center gap-2", fontSize)} >
            <div className="rounded-x2 bg-gradient-to-r from-blue-500 to-blue-600 p-2">
                <ComputerIcon size={iconSize} className='stroke-white' />
            </div>
            <div>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    Flow
                </span>
                <span className="text-stone-700 dark:text-stone-300">
                    Builder
                </span>

            </div>
        </Link>
    )
}

export default Logo