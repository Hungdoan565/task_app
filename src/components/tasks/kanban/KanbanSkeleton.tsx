import { Skeleton } from '@/components/ui/skeleton'
import { TaskCardSkeleton } from '../TaskCardSkeleton'

interface KanbanSkeletonProps {
  columns?: number
  cardsPerColumn?: number
}

export function KanbanSkeleton({ columns = 4, cardsPerColumn = 3 }: KanbanSkeletonProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: columns }).map((_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex h-full min-w-[280px] flex-1 flex-col rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((__, cardIndex) => (
              <TaskCardSkeleton key={cardIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}


