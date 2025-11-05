import { Task } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onArchive?: (task: Task) => void
  onClick?: (task: Task) => void
}

export default function TaskCard({ task, onEdit, onDelete, onArchive, onClick }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div
      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2">
          {task.title}
        </h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(task); }}>
                Lưu trữ
              </DropdownMenuItem>
            )}
            {onEdit && onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                className="text-red-600 dark:text-red-400"
              >
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>

        {task.tags && task.tags.length > 0 && (
          <>
            {task.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{task.tags.length - 2}
              </Badge>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          {task.due_date && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(task.due_date), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>
          )}

          {task.estimated_hours && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.estimated_hours}h</span>
            </div>
          )}

          {/* Attachments and comments features not yet implemented */}
        </div>

        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {task.assignee.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}
