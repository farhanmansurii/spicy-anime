'use client'
import { cn } from '@/lib/utils';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Container({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: 'string' | null;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <div className={cn("max-w-screen-lg pb-4 px-4 mb-10 mx-auto pt-2", className)}>{children}</div>
        </QueryClientProvider>
    );
}
