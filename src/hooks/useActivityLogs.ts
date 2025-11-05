import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import { ActivityLog } from '@/types'

export interface UseActivityLogsOptions {
  workspaceId?: string
  limit?: number
  entityType?: string
  entityId?: string
}

export function useActivityLogs({
  workspaceId,
  limit = 20,
  entityType,
  entityId,
}: UseActivityLogsOptions = {}) {
  const queryClient = useQueryClient()

  const queryKey = useMemo(
    () => ['activity-logs', workspaceId, limit, entityType, entityId] as const,
    [workspaceId, limit, entityType, entityId],
  )

  const { data: activities, isLoading, error } = useQuery<ActivityLog[], Error>({
    queryKey,
    queryFn: async () => {
      if (!workspaceId) return []

      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          user:profiles!activity_logs_user_id_fkey(id, full_name, avatar_url)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (entityType) {
        query = query.eq('entity_type', entityType)
      }

      if (entityId) {
        query = query.eq('entity_id', entityId)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data as ActivityLog[]
    },
    enabled: !!workspaceId,
  })

  useEffect(() => {
    if (!workspaceId) return

    const channel = supabase
      .channel(`workspace-activity-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        async (payload) => {
          const refreshRecord = async (id?: string | null) => {
            if (!id) return null

            const { data, error: fetchError } = await supabase
              .from('activity_logs')
              .select(`
                *,
                user:profiles!activity_logs_user_id_fkey(id, full_name, avatar_url)
              `)
              .eq('id', id)
              .maybeSingle()

            if (fetchError || !data) return null
            if (entityType && data.entity_type !== entityType) return null
            if (entityId && data.entity_id !== entityId) return null
            return data as ActivityLog
          }

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newActivity = await refreshRecord(payload.new?.id as string | undefined)
            if (!newActivity) return

            queryClient.setQueryData<ActivityLog[]>(queryKey, (current = []) => {
              const existingIndex = current.findIndex((item) => item.id === newActivity.id)
              const next = [...current]

              if (existingIndex >= 0) {
                next[existingIndex] = newActivity
              } else {
                next.unshift(newActivity)
              }

              return next
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, limit ?? next.length)
            })
          }

          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id as string | undefined
            if (!deletedId) return

            queryClient.setQueryData<ActivityLog[]>(queryKey, (current = []) =>
              current.filter((item) => item.id !== deletedId),
            )
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, entityType, entityId, limit, queryClient, queryKey])

  return {
    activities: activities || [],
    isLoading,
    error,
  }
}


