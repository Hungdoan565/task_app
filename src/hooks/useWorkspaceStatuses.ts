import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { WorkspaceStatus } from '@/types'
import { toast } from '@/hooks/use-toast'

export function useWorkspaceStatuses(workspaceId?: string) {
  const queryClient = useQueryClient()

  const { data: statuses, isLoading, error } = useQuery<WorkspaceStatus[], Error>({
    queryKey: ['workspace-statuses', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return []
      
      const { data, error } = await supabase
        .from('workspace_statuses')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('position', { ascending: true })
      
      if (error) throw error
      return data as WorkspaceStatus[]
    },
    enabled: !!workspaceId,
  })

  const createStatus = useMutation<WorkspaceStatus, Error, Omit<WorkspaceStatus, 'id' | 'created_at' | 'updated_at'>>({
    mutationFn: async (newStatus) => {
      const { data, error } = await supabase
        .from('workspace_statuses')
        .insert(newStatus)
        .select()
        .single()
      
      if (error) throw error
      return data as WorkspaceStatus
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-statuses', workspaceId] })
      toast({ title: 'Thành công', description: 'Đã tạo trạng thái mới.' })
    },
    onError: (err) => {
      toast({ title: 'Lỗi', description: err.message, variant: 'destructive' })
    },
  })

  const updateStatus = useMutation<WorkspaceStatus, Error, Partial<WorkspaceStatus> & { id: string }>({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('workspace_statuses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as WorkspaceStatus
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-statuses', workspaceId] })
      toast({ title: 'Thành công', description: 'Đã cập nhật trạng thái.' })
    },
    onError: (err) => {
      toast({ title: 'Lỗi', description: err.message, variant: 'destructive' })
    },
  })

  const deleteStatus = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('workspace_statuses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-statuses', workspaceId] })
      toast({ title: 'Thành công', description: 'Đã xóa trạng thái.' })
    },
    onError: (err) => {
      toast({ title: 'Lỗi', description: err.message, variant: 'destructive' })
    },
  })

  const reorderStatuses = useMutation<void, Error, { id: string; position: number }[]>({
    mutationFn: async (updates) => {
      const promises = updates.map(({ id, position }) =>
        supabase
          .from('workspace_statuses')
          .update({ position })
          .eq('id', id)
      )
      
      const results = await Promise.all(promises)
      const errors = results.filter(r => r.error)
      if (errors.length > 0) throw new Error('Failed to reorder statuses')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-statuses', workspaceId] })
    },
    onError: (err) => {
      toast({ title: 'Lỗi', description: err.message, variant: 'destructive' })
    },
  })

  return {
    statuses: statuses || [],
    isLoading,
    error,
    createStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
  }
}


