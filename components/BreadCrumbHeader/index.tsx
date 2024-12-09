"use client"

import { usePathname } from 'next/navigation';
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '../ui/breadcrumb';
import { MobileSidebar } from '../Sidebar/Sidebar';

const BreadCrumbHeader = () => {
    const pathName = usePathname();
    const paths = pathName === "/" ? [""] : pathName.split("/");
    return (
        <div className="flex items-center flex-start">
            <MobileSidebar />
            <Breadcrumb>
                <BreadcrumbList>
                    {paths.map((path, index) => (
                        <React.Fragment key={index} >
                            <BreadcrumbItem>
                                <BreadcrumbLink className='"capitalize' href={`/${path}`}>
                                    {path === "" ? "HOME" : path.toLocaleUpperCase()}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default BreadCrumbHeader;