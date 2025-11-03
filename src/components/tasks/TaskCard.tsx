import { Task } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Flag } from 'lucide-react'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between space-x-2">
          <CardTitle className="text-base font-semibold line-clamp-2">
            {task.title}
          </CardTitle>
          <Flag
            className={`h-4 w-4 flex-shrink-0 ${priorityColors[task.priority]} text-white rounded-sm p-0.5`}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.category && (
          <Badge
            variant="secondary"
            style={{
              backgroundColor: task.category.color + '20',
              color: task.category.color,
            }}
          >
            {task.category.name}
          </Badge>
        )}

        <div className="flex items-center justify-between pt-2">
          {task.due_date && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.due_date), 'MMM dd')}
            </div>
          )}

          {task.assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar_url} />
              <AvatarFallback className="text-xs">
                {task.assignee.full_name?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

