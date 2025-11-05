import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, WorkspaceStatus } from '@/types'
import SortableTaskCard from './SortableTaskCard'
import { Plus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface KanbanColumnProps {
  status: WorkspaceStatus
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (task: Task) => void
  onTaskArchive?: (task: Task) => void
  onAddTask?: (statusId: string) => void
  onEditStatus?: (status: WorkspaceStatus) => void
  onDeleteStatus?: (status: WorkspaceStatus) => void
}

export default function KanbanColumn({
  status,
  tasks,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onTaskArchive,
  onAddTask,
  onEditStatus,
  onDeleteStatus,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
  })

  const taskIds = tasks.map((task) => task.id)

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 min-w-[320px] transition-colors ${
        isOver ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-400' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: status.color || '#6366f1' }}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {status.name}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
          {status.wip_limit && tasks.length >= status.wip_limit && (
            <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full font-medium">
              WIP {tasks.length}/{status.wip_limit}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onAddTask?.(status.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEditStatus && (
                <DropdownMenuItem onClick={() => onEditStatus(status)}>
                  Chỉnh sửa cột
                </DropdownMenuItem>
              )}
              {onAddTask && (
                <DropdownMenuItem onClick={() => onAddTask(status.id)}>
                  Thêm task
                </DropdownMenuItem>
              )}
              {onEditStatus && onDeleteStatus && <DropdownMenuSeparator />}
              {onDeleteStatus && !status.is_default && (
                <DropdownMenuItem
                  onClick={() => onDeleteStatus(status)}
                  className="text-red-600 dark:text-red-400"
                >
                  Xóa cột
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onArchive={onTaskArchive}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
            <Plus className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm">Kéo task vào đây</p>
            <p className="text-xs">hoặc thêm mới</p>
          </div>
        )}
      </div>
    </div>
  )
}


