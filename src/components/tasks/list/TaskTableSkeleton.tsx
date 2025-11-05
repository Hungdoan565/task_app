import { Skeleton } from '@/components/ui/skeleton'

interface TaskTableSkeletonProps {
  rows?: number
}

export function TaskTableSkeleton({ rows = 8 }: TaskTableSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg sm:w-[180px]" />
        <Skeleton className="h-10 w-full rounded-lg sm:w-[180px]" />
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_40px] gap-3 border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_40px] items-center gap-3 px-4 py-4"
            >
              <Skeleton className="h-4 w-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


