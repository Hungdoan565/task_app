import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Folder, Settings, FileText, BarChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Workspace } from '@/types'

interface WorkspaceQuickActionsProps {
  workspace: Workspace
}

export default function WorkspaceQuickActions({ workspace }: WorkspaceQuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: 'Tạo công việc',
      description: 'Thêm task mới vào workspace',
      href: '/tasks/new',
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400',
    },
    {
      icon: Folder,
      label: 'Tạo thư mục',
      description: 'Tổ chức workspace',
      href: '/folders/new',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
    },
    {
      icon: Users,
      label: 'Mời thành viên',
      description: 'Cộng tác với team',
      href: '/settings?tab=team',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
    },
    {
      icon: BarChart,
      label: 'Xem báo cáo',
      description: 'Phân tích tiến độ',
      href: '/analytics',
      color: 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400',
    },
    {
      icon: FileText,
      label: 'Templates',
      description: 'Tạo từ mẫu có sẵn',
      href: '/templates',
      color: 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400',
    },
    {
      icon: Settings,
      label: 'Cài đặt',
      description: 'Quản lý workspace',
      href: '/settings',
      color: 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-600" />
          Hành động nhanh
        </CardTitle>
        <CardDescription>
          Các công việc thường dùng trong {workspace.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className={`h-auto flex-col items-start p-4 ${action.color} border-0`}
              asChild
            >
              <Link to={action.href}>
                <action.icon className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-semibold text-sm mb-1">{action.label}</div>
                  <div className="text-xs opacity-80 font-normal">
                    {action.description}
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


