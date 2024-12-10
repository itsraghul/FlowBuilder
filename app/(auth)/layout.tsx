import Logo from '@/components/Logo/Logo'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <Logo />
            {children}
        </div>
    )
}

export default Layout