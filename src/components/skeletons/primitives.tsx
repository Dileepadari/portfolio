/**
 * Layout-shaped loading blocks the page skeletons compose.
 *
 * Deliberately generic: no page-specific spacing lives here, so a page
 * skeleton can arrange them into its own layout.
 *
 * @module ui
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function HeroCardSkeleton() {
  return (
    <Card className="mb-6 bg-card border-border">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <Skeleton className="h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 shrink-0 rounded-full" />
          <div className="w-full space-y-4 text-center lg:text-left">
            <Skeleton className="mx-auto lg:mx-0 h-8 w-64" />
            <Skeleton className="mx-auto lg:mx-0 h-5 w-full max-w-md" />
            <Skeleton className="mx-auto lg:mx-0 h-5 w-3/4 max-w-md" />
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SectionCardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3" style={{ width: `${90 - i * 10}%` }} />
        ))}
      </CardContent>
    </Card>
  );
}

export function GridCardSkeleton() {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function GridSkeleton({ count = 6, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => <GridCardSkeleton key={i} />)}
    </div>
  );
}

export function ListRowCardSkeleton() {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="h-40 sm:h-auto sm:w-56 shrink-0 rounded-none" />
        <CardContent className="flex-1 space-y-3 p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </div>
    </Card>
  );
}
