import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HeroCardSkeleton, SectionCardSkeleton, GridSkeleton, ListRowCardSkeleton } from "./primitives";

// One skeleton per page, each roughly mirroring that page's real layout so
// the loading state doesn't feel like a jarring "blank screen with a
// spinner" - it replaces the old bare "Loading..." text states.

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
        <HeroCardSkeleton />
        <SectionCardSkeleton lines={4} />
        <SectionCardSkeleton lines={3} />
        <SectionCardSkeleton lines={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCardSkeleton lines={2} />
          <SectionCardSkeleton lines={2} />
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-5 w-56" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-md" />)}
        </div>
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-9 w-64" />
          <Skeleton className="mx-auto h-5 w-96 max-w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListRowCardSkeleton />
          <ListRowCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-10 w-full rounded-md" />
            {Array.from({ length: 3 }).map((_, i) => <ListRowCardSkeleton key={i} />)}
          </div>
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-16 rounded-full" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogPostViewSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-4">
          <div className="flex gap-2"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-5 w-20 rounded-full" /></div>
          <Skeleton className="h-10 w-full max-w-xl" />
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-4"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-20" /></div>
        </div>
        <Skeleton className="h-72 w-full rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4" style={{ width: `${95 - (i % 3) * 15}%` }} />)}
        </div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-40" />
        <SectionCardSkeleton lines={3} />
        <SectionCardSkeleton lines={3} />
        <SectionCardSkeleton lines={2} />
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Skeleton className="h-56 w-full sm:h-72 lg:h-80" />
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <GridSkeleton count={3} />
      </div>
    </div>
  );
}
