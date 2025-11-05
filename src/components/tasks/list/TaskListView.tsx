import { useState, useMemo } from 'react'
import { Task, WorkspaceStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  Filter,
  MoreVertical,
  ArrowUpDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { TaskTableSkeleton } from './TaskTableSkeleton'

interface TaskListViewProps {
  tasks: Task[]
  statuses: WorkspaceStatus[]
  onTaskClick?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (task: Task) => void
  onBulkAction?: (taskIds: string[], action: string) => void
  isLoading?: boolean
}

type SortField = 'title' | 'priority' | 'status' | 'due_date' | 'created_at'
type SortDirection = 'asc' | 'desc'

export default function TaskListView({
  tasks,
  statuses,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onBulkAction,
  isLoading,
}: TaskListViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status_id === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 }
          aValue = priorityOrder[a.priority] || 0
          bValue = priorityOrder[b.priority] || 0
          break
        case 'status':
          aValue = a.status_info?.position || 0
          bValue = b.status_info?.position || 0
          break
        case 'due_date':
          aValue = a.due_date ? new Date(a.due_date).getTime() : Infinity
          bValue = b.due_date ? new Date(b.due_date).getTime() : Infinity
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortField, sortDirection])

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedTasks.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedTasks, currentPage])

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(new Set(paginatedTasks.map((t) => t.id)))
    } else {
      setSelectedTasks(new Set())
    }
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    const newSelected = new Set(selectedTasks)
    if (checked) {
      newSelected.add(taskId)
    } else {
      newSelected.delete(taskId)
    }
    setSelectedTasks(newSelected)
  }

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  if (isLoading) {
    return <TaskTableSkeleton />
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Độ ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức độ</SelectItem>
            <SelectItem value="urgent">Khẩn cấp</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="low">Thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.size > 0 && (
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Đã chọn {selectedTasks.size} công việc
          </span>
          <Button variant="outline" size="sm" onClick={() => onBulkAction?.(Array.from(selectedTasks), 'archive')}>
            Lưu trữ
          </Button>
          <Button variant="outline" size="sm" onClick={() => onBulkAction?.(Array.from(selectedTasks), 'delete')}>
            Xóa
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTasks.size === paginatedTasks.length && paginatedTasks.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-2">
                  Tiêu đề
                  <SortIcon field="title" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-2">
                  Trạng thái
                  <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>
                <div className="flex items-center gap-2">
                  Ưu tiên
                  <SortIcon field="priority" />
                </div>
              </TableHead>
              <TableHead>Người thực hiện</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('due_date')}>
                <div className="flex items-center gap-2">
                  Hạn chót
                  <SortIcon field="due_date" />
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.map((task) => {
              const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
              
              return (
                <TableRow
                  key={task.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  onClick={() => onTaskClick?.(task)}
                >
                  <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedTasks.has(task.id)}
                      onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: task.status_info?.color ? `${task.status_info.color}20` : undefined,
                        color: task.status_info?.color || undefined,
                      }}
                    >
                      {task.status_info?.name || task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Chưa giao</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.due_date ? (
                      <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(task.due_date), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Không có</span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTaskEdit?.(task)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onTaskDelete?.(task)}
                          className="text-red-600 dark:text-red-400"
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedTasks.length)} trong số {filteredAndSortedTasks.length} công việc
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


