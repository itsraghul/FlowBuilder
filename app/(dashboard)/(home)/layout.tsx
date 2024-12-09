import BreadCrumbHeader from '@/components/BreadCrumbHeader'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { ThemeModeToggle } from '@/components/ThemeModeToggle/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'
import { WEBSITE_NAME } from '@/constants'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className="flex flex-col flex-1 min-h-screen">
                <header className='flex items-center justify-between px-6 py-4 h-[50px] container'>
                    <BreadCrumbHeader />
                    <div className="gap-1 flex items-center">
                        <ThemeModeToggle />
                    </div>
                </header>
                <Separator />
                <div className="overflow-auto">
                    <div className="flex-1 container py-4 text-accent-foreground">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default layout