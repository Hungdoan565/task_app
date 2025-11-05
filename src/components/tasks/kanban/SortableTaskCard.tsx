import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types'
import TaskCard from '../TaskCard'

interface SortableTaskCardProps {
  task: Task
  onClick?: (task: Task) => void
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onArchive?: (task: Task) => void
}

export default function SortableTaskCard({
  task,
  onClick,
  onEdit,
  onDelete,
  onArchive,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCard
        task={task}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
        onArchive={onArchive}
      />
    </div>
  )
}


