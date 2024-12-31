import Logo from '@/components/Logo/Logo'
import Image from 'next/image'
import React from 'react';
import PlaceHolderImage from "../../assets/Placeholder.png"
import Link from 'next/link';
import { PORTFORLIO_LINK } from '@/constants';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Logo />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">
                        {children}
                    </div>
                </div>
                <span className='flex items-center justify-center'>
                    Crafted with ❤️ by
                    <Link href={PORTFORLIO_LINK} target="_blank" className='ml-1 font-medium text-primary'>
                        Raghul
                    </Link>
                </span>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    unoptimized={true}
                    priority
                    src={PlaceHolderImage.src}
                    alt="Workflow Image"
                    width={0}
                    height={0}
                    sizes='100vw'
                    className="absolute inset-0 h-full w-full object-cover object-left dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}

export default Layout