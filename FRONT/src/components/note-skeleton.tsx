
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const NoteSkeletonItem = () => (
    <Card>
        <CardHeader className="p-4 flex-row items-center justify-between">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-md">
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-md">
                <Skeleton className="h-4 w-4/5" />
            </div>
             <Skeleton className="h-9 w-28" />
        </CardContent>
    </Card>
);

export const NoteSkeleton = () => {
    return (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                <NoteSkeletonItem key={i} />
            ))}
        </div>
    );
};

    