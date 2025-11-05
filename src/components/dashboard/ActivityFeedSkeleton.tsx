import { Skeleton } from "@/components/ui/skeleton";

interface ActivityFeedSkeletonProps {
  items?: number;
}

export function ActivityFeedSkeleton({ items = 4 }: ActivityFeedSkeletonProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <Skeleton className="h-6 w-40" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


