import { BlocksIcon } from 'lucide-react'
import React from 'react'

const MarketPlacePage = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className='flex  items-center justify-center rounded-3xl gap-3 border-slate-200 border-2 p-3 bg-slate-50'>
                <BlocksIcon size={50} className='text-primary' />
                <span className='text-3xl font-medium'>
                    Coming Soon
                </span>
            </div>
        </div>
    )
}

export default MarketPlacePage
