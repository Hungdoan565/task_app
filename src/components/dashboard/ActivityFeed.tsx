import { ActivityLog } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Activity, FileText, Folder, Trash2, Edit, Share, Archive, RotateCcw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface ActivityFeedProps {
  activities: ActivityLog[]
  isLoading?: boolean
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'created':
      return <FileText className="h-4 w-4" />
    case 'updated':
      return <Edit className="h-4 w-4" />
    case 'deleted':
      return <Trash2 className="h-4 w-4" />
    case 'moved':
      return <Folder className="h-4 w-4" />
    case 'shared':
      return <Share className="h-4 w-4" />
    case 'archived':
      return <Archive className="h-4 w-4" />
    case 'restored':
      return <RotateCcw className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

const getActionColor = (action: string) => {
  switch (action) {
    case 'created':
      return 'text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-500/10'
    case 'updated':
      return 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10'
    case 'deleted':
      return 'text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-500/10'
    case 'moved':
      return 'text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-500/10'
    case 'shared':
      return 'text-indigo-600 bg-indigo-50 dark:text-indigo-200 dark:bg-indigo-500/10'
    case 'archived':
      return 'text-orange-600 bg-orange-50 dark:text-orange-300 dark:bg-orange-500/10'
    case 'restored':
      return 'text-teal-600 bg-teal-50 dark:text-teal-300 dark:bg-teal-500/10'
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-300 dark:bg-gray-800/60'
  }
}

const getActionLabel = (action: string) => {
  switch (action) {
    case 'created':
      return 'đã tạo'
    case 'updated':
      return 'đã cập nhật'
    case 'deleted':
      return 'đã xóa'
    case 'moved':
      return 'đã di chuyển'
    case 'shared':
      return 'đã chia sẻ'
    case 'archived':
      return 'đã lưu trữ'
    case 'restored':
      return 'đã khôi phục'
    default:
      return action
  }
}

const getEntityLabel = (entityType: string) => {
  switch (entityType) {
    case 'task':
      return 'công việc'
    case 'folder':
      return 'thư mục'
    case 'workspace':
      return 'workspace'
    case 'member':
      return 'thành viên'
    case 'comment':
      return 'bình luận'
    case 'attachment':
      return 'tệp đính kèm'
    default:
      return entityType
  }
}

export default function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Hoạt động gần đây
          </CardTitle>
          <CardDescription className="dark:text-slate-400">Đang tải...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded bg-slate-200 dark:bg-slate-700 w-3/4" />
                  <div className="h-3 rounded bg-slate-200 dark:bg-slate-700 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Hoạt động gần đây
          </CardTitle>
          <CardDescription className="dark:text-slate-400">Chưa có hoạt động nào</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Chưa có hoạt động nào được ghi nhận</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          Hoạt động gần đây
        </CardTitle>
        <CardDescription className="dark:text-slate-400">Cập nhật realtime trong workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.user?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {activity.user?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {activity.user?.full_name || 'Người dùng'}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {getActionLabel(activity.action)}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getEntityLabel(activity.entity_type)}
                  </span>
                  <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getActionColor(activity.action)}`}>
                    {getActionIcon(activity.action)}
                    {activity.action}
                  </div>
                </div>

                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {JSON.stringify(activity.metadata)}
                  </div>
                )}

                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


