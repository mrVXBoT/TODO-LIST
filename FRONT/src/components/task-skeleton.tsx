"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const SkeletonItem = () => (
    <Card>
        <CardContent className="p-4 flex items-start gap-4">
            <Skeleton className="mt-1 h-5 w-5 rounded-sm" />
            <div className="flex-grow space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
            <Skeleton className="h-8 w-8" />
        </CardContent>
    </Card>
);

export const TaskSkeleton = () => {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <SkeletonItem key={i} />
            ))}
        </div>
    );
};
