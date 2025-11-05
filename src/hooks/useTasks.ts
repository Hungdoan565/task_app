import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import type { Task, TaskPriority, TaskStatus } from '@/types'
import { toast } from '@/hooks/use-toast'

export interface UseTasksOptions {
  workspaceId?: string
  folderId?: string | null
  includeArchived?: boolean
}

type CreateTaskInput = {
  workspace_id: string
  title: string
  status?: TaskStatus
  status_id?: string | null
  priority?: TaskPriority
  description?: string | null
  folder_id?: string | null
  parent_task_id?: string | null
  due_date?: string | null
  start_date?: string | null
  category_id?: string | null
  assigned_to?: string | null
  position?: number
  estimated_hours?: number | null
  actual_hours?: number | null
  completion_percentage?: number
  tags?: string[]
  custom_fields?: Record<string, unknown>
  is_template?: boolean
}

type UpdateTaskInput = {
  id: string
  updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'creator' | 'assignee' | 'category' | 'folder' | 'parent_task' | 'subtasks' | 'watchers'>>
}

const mapTask = (task: any): Task => ({
  ...task,
  folder_id: task.folder_id ?? null,
  parent_task_id: task.parent_task_id ?? null,
  description: task.description ?? null,
  due_date: task.due_date ?? null,
  start_date: task.start_date ?? null,
  category_id: task.category_id ?? null,
  assigned_to: task.assigned_to ?? null,
  estimated_hours: task.estimated_hours ?? null,
  actual_hours: task.actual_hours ?? null,
  completion_percentage: task.completion_percentage ?? 0,
  tags: Array.isArray(task.tags) ? task.tags : [],
  custom_fields: task.custom_fields ?? {},
  is_template: Boolean(task.is_template),
  completed_at: task.completed_at ?? null,
  archived_at: task.archived_at ?? null,
  is_archived: Boolean(task.is_archived),
})

export function useTasks({ workspaceId, folderId, includeArchived = false }: UseTasksOptions = {}) {
  const queryClient = useQueryClient()

  const queryKey = ['tasks', workspaceId, folderId ?? 'all', includeArchived]

  const {
    data: tasks,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!workspaceId) return []

      let query = supabase
        .from('tasks')
        .select(
          `
            *,
            category:categories(id, name, color),
            folder:workspace_folders!tasks_folder_id_fkey(id, name, slug, parent_id, depth, position, path, icon, color),
            assignee:profiles!tasks_assigned_to_fkey(id, full_name, avatar_url),
            creator:profiles!tasks_created_by_fkey(id, full_name, avatar_url),
            parent_task:tasks!tasks_parent_task_id_fkey(id, title, status, priority),
            status_info:workspace_statuses!tasks_status_id_fkey(id, key, name, color, position)
          `
        )
        .eq('workspace_id', workspaceId)
        .order('position', { ascending: true })
        .order('updated_at', { ascending: true })

      if (!includeArchived) {
        query = query.eq('is_archived', false)
      }

      if (folderId === null) {
        query = query.is('folder_id', null)
      } else if (folderId) {
        query = query.eq('folder_id', folderId)
      }

      const { data, error } = await query
      if (error) throw error

      return (data ?? []).map(mapTask)
    },
    enabled: Boolean(workspaceId),
  })

  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey })
  }

  const createTask = useMutation({
    mutationFn: async (task: CreateTaskInput) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          workspace_id: task.workspace_id,
          title: task.title,
          status: task.status ?? 'todo',
          status_id: task.status_id ?? null,
          priority: task.priority ?? 'medium',
          description: task.description ?? null,
          folder_id: task.folder_id ?? null,
          parent_task_id: task.parent_task_id ?? null,
          due_date: task.due_date ?? null,
          start_date: task.start_date ?? null,
          category_id: task.category_id ?? null,
          assigned_to: task.assigned_to ?? null,
          position: task.position,
          estimated_hours: task.estimated_hours ?? null,
          actual_hours: task.actual_hours ?? null,
          completion_percentage: task.completion_percentage ?? 0,
          tags: task.tags ?? [],
          custom_fields: task.custom_fields ?? {},
          is_template: task.is_template ?? false,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return mapTask(data)
    },
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) ?? []

      const optimisticTask: Task = {
        id: `optimistic-${Date.now()}`,
        workspace_id: task.workspace_id,
        folder_id: task.folder_id ?? null,
        parent_task_id: task.parent_task_id ?? null,
        title: task.title,
        description: task.description ?? null,
        status: task.status ?? 'todo',
        status_id: task.status_id ?? null,
        priority: task.priority ?? 'medium',
        due_date: task.due_date ?? null,
        start_date: task.start_date ?? null,
        category_id: task.category_id ?? null,
        assigned_to: task.assigned_to ?? null,
        created_by: 'optimistic',
        position: task.position ?? previousTasks.length + 1,
        estimated_hours: task.estimated_hours ?? null,
        actual_hours: task.actual_hours ?? null,
        completion_percentage: task.completion_percentage ?? 0,
        tags: task.tags ?? [],
        custom_fields: task.custom_fields ?? {},
        is_template: task.is_template ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        archived_at: null,
        is_archived: false,
        category: undefined,
        folder: undefined,
        parent_task: undefined,
        assignee: undefined,
        creator: undefined,
        subtasks: [],
        watchers: [],
        status_info: undefined,
      }

      queryClient.setQueryData<Task[]>(queryKey, (current = []) => [optimisticTask, ...current])

      return { previousTasks }
    },
    onSuccess: () => {
      queryClient.setQueryData<Task[]>(queryKey, (current = []) =>
        current.filter((task) => !task.id.startsWith('optimistic-'))
      )
      invalidateTasks()
      toast({
        title: 'Đã tạo công việc',
        description: 'Công việc mới đã được thêm vào workspace của bạn.',
      })
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks)
      }
      toast({
        title: 'Không thể tạo công việc',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: UpdateTaskInput) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          folder_id: updates.folder_id ?? undefined,
          parent_task_id: updates.parent_task_id ?? undefined,
          tags: updates.tags ?? undefined,
          custom_fields: updates.custom_fields ?? undefined,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return mapTask(data)
    },
    onSuccess: () => {
      invalidateTasks()
    },
    onError: (error: Error) => {
      toast({
        title: 'Không thể cập nhật công việc',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      invalidateTasks()
      toast({
        title: 'Đã xoá công việc',
        description: 'Công việc đã được đưa vào thùng rác.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Không thể xoá công việc',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    tasks,
    isLoading,
    isFetching,
    createTask,
    updateTask,
    deleteTask,
  }
}

