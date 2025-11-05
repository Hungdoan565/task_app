import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Task } from '@/types'
import { User, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface MyTasksPanelProps {
  tasks: Task[]
  userId?: string
  isLoading?: boolean
}

export default function MyTasksPanel({ tasks, userId, isLoading }: MyTasksPanelProps) {
  const myTasks = tasks.filter((task) => task.assigned_to === userId && task.status !== 'done')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'review':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
      case 'blocked':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'done':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Công việc của tôi
          </CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-600" />
          Công việc của tôi
        </CardTitle>
        <CardDescription>
          {myTasks.length} công việc được giao cho bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {myTasks.length > 0 ? (
          <div className="space-y-3">
            {myTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {task.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(task.status)}
                      >
                        {task.status_info?.name || task.status}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(task.priority)}
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    {task.due_date && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Đến hạn{' '}
                          {formatDistanceToNow(new Date(task.due_date), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    asChild
                  >
                    <Link to={`/tasks/${task.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {myTasks.length > 5 && (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/tasks?filter=assigned-to-me">
                  Xem tất cả {myTasks.length} công việc
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Bạn chưa có công việc nào được giao</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


