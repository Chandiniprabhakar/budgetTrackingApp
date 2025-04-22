import React, { ReactNode } from 'react';
import { cn } from 'lib/utils';
import { Skeleton } from './ui/Skeleton';

function SkeletonWrapper({
    children,
    isLoading,
    fullWidth = true,
    height = "h-6", // default height
}: {
    children: ReactNode;
    isLoading: boolean;
    fullWidth?: boolean;
    height?: string;
}) {
    if (!isLoading) return children;

    return (
        <Skeleton className={cn(fullWidth && "w-full", height)} aria-busy="true">
            <div className="opacity-0">{children}</div>
        </Skeleton>
    );
}

export default SkeletonWrapper;
