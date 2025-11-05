import { useStore } from '@/store/useStore'
import { useTasks } from '@/hooks/useTasks'
import { useWorkspaceStatuses } from '@/hooks/useWorkspaceStatuses'
import KanbanBoard from '@/components/tasks/kanban/KanbanBoard'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Plus, Settings } from 'lucide-react'
import { Task, WorkspaceStatus } from '@/types'
import { toast } from '@/hooks/use-toast'
import { KanbanSkeleton } from '@/components/tasks/kanban/KanbanSkeleton'

export default function Kanban() {
  const { currentWorkspace, setTaskDialogOpen } = useStore()
  const {
    tasks,
    isLoading: tasksLoading,
    isFetching: tasksFetching,
    updateTask,
  } = useTasks({ workspaceId: currentWorkspace?.id })
  const { statuses, isLoading: statusesLoading } = useWorkspaceStatuses(currentWorkspace?.id)

  const handleTaskMove = async (taskId: string, newStatusId: string, newPosition: number) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        updates: {
          status_id: newStatusId,
          position: newPosition,
        },
      })
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật vị trí task',
      })
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể di chuyển task',
        variant: 'destructive',
      })
    }
  }

  const handleTaskClick = (task: Task) => {
    // TODO: Open task detail modal
    console.log('Open task:', task)
  }

  const handleTaskEdit = (task: Task) => {
    // TODO: Open task edit modal
    console.log('Edit task:', task)
  }

  const handleTaskDelete = async (task: Task) => {
    // TODO: Implement delete confirmation
    console.log('Delete task:', task)
  }

  const handleTaskArchive = async (task: Task) => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        updates: {
          is_archived: true,
          archived_at: new Date().toISOString(),
        },
      })
      toast({
        title: 'Thành công',
        description: 'Đã lưu trữ task',
      })
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu trữ task',
        variant: 'destructive',
      })
    }
  }

  const handleAddTask = (statusId: string) => {
    setTaskDialogOpen(true)
    console.log('Add task to status:', statusId)
  }

  const handleEditStatus = (status: WorkspaceStatus) => {
    // TODO: Open edit status modal
    console.log('Edit status:', status)
  }

  const handleDeleteStatus = (status: WorkspaceStatus) => {
    // TODO: Implement delete status confirmation
    console.log('Delete status:', status)
  }

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Vui lòng chọn một workspace để xem Kanban board
          </p>
        </div>
      </div>
    )
  }

  const activeStatuses = statuses.filter((s) => s.is_active).sort((a, b) => a.position - b.position)
  const initialLoading = tasksLoading || statusesLoading
  const refreshing = tasksFetching && !initialLoading

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Kanban Board"
        description={`Quản lý công việc trong ${currentWorkspace.name}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Kanban' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt cột
            </Button>
            <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo task
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-hidden">
        {initialLoading ? (
          <KanbanSkeleton />
        ) : activeStatuses.length > 0 ? (
          <div className="relative h-full">
            {refreshing && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
                <div className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow dark:bg-slate-900 dark:text-slate-400">
                  Đang đồng bộ...
                </div>
              </div>
            )}
            <KanbanBoard
              tasks={tasks || []}
              statuses={activeStatuses}
              onTaskMove={handleTaskMove}
              onTaskClick={handleTaskClick}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
              onTaskArchive={handleTaskArchive}
              onAddTask={handleAddTask}
              onEditStatus={handleEditStatus}
              onDeleteStatus={handleDeleteStatus}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                Chưa có cột trạng thái nào
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo cột đầu tiên
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


