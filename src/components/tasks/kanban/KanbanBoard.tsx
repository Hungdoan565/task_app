import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Task, WorkspaceStatus } from '@/types'
import KanbanColumn from './KanbanColumn'
import TaskCard from '../TaskCard'

interface KanbanBoardProps {
  tasks: Task[]
  statuses: WorkspaceStatus[]
  onTaskMove?: (taskId: string, newStatusId: string, newPosition: number) => void
  onTaskClick?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (task: Task) => void
  onTaskArchive?: (task: Task) => void
  onAddTask?: (statusId: string) => void
  onEditStatus?: (status: WorkspaceStatus) => void
  onDeleteStatus?: (status: WorkspaceStatus) => void
}

export default function KanbanBoard({
  tasks,
  statuses,
  onTaskMove,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onTaskArchive,
  onAddTask,
  onEditStatus,
  onDeleteStatus,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    
    statuses.forEach((status) => {
      grouped[status.id] = tasks
        .filter((task) => task.status_id === status.id)
        .sort((a, b) => a.position - b.position)
    })
    
    return grouped
  }, [tasks, statuses])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the containers (status columns)
    const activeContainer = Object.keys(tasksByStatus).find((statusId) =>
      tasksByStatus[statusId].some((task) => task.id === activeId)
    )
    const overContainer =
      tasksByStatus[overId]
        ? overId
        : Object.keys(tasksByStatus).find((statusId) =>
            tasksByStatus[statusId].some((task) => task.id === overId)
          )

    if (!activeContainer || !overContainer) return
    if (activeContainer === overContainer) return

    // Move task to new status (temporary, will be finalized in handleDragEnd)
    // This is just for visual feedback
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find which status column the task was dropped into
    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // Check if dropped on a status column directly
    const targetStatus = statuses.find((s) => s.id === overId)
    const targetStatusId = targetStatus
      ? targetStatus.id
      : Object.keys(tasksByStatus).find((statusId) =>
          tasksByStatus[statusId].some((task) => task.id === overId)
        )

    if (!targetStatusId) return

    const targetTasks = tasksByStatus[targetStatusId]
    const overTaskIndex = targetTasks.findIndex((task) => task.id === overId)
    
    // Calculate new position
    let newPosition: number
    if (overTaskIndex === -1) {
      // Dropped on the column itself, add to end
      newPosition = targetTasks.length > 0 ? targetTasks[targetTasks.length - 1].position + 1 : 0
    } else {
      // Dropped on a specific task
      newPosition = targetTasks[overTaskIndex].position
    }

    // Call the callback
    if (onTaskMove) {
      onTaskMove(activeId, targetStatusId, newPosition)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {statuses.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            tasks={tasksByStatus[status.id] || []}
            onTaskClick={onTaskClick}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            onTaskArchive={onTaskArchive}
            onAddTask={onAddTask}
            onEditStatus={onEditStatus}
            onDeleteStatus={onDeleteStatus}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}


