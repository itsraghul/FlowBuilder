"use client";


import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextTopLoader from "nextjs-toploader";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <NextTopLoader color="#3b82f6" showSpinner={false} zIndex={9999} />
            <ThemeProvider attribute="class" defaultTheme='system'>
                {children}
            </ThemeProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )


}


export default AppProviders