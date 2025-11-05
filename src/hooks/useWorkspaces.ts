import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import type { Workspace, WorkspaceMember } from '@/types'
import { toast } from '@/hooks/use-toast'

const slugify = (input: string) => {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return base || `workspace-${Math.random().toString(36).slice(2, 8)}`
}

const mapWorkspaceMember = (member: any): WorkspaceMember => ({
  workspace_id: member.workspace_id,
  user_id: member.user_id,
  role: member.role ?? 'member',
  permissions: member.permissions ?? {},
  joined_at: member.joined_at ?? new Date().toISOString(),
  invited_by: member.invited_by ?? null,
  last_active_at: member.last_active_at ?? null,
  user: member.user
    ? {
        id: member.user.id,
        email: member.user.email ?? '',
        full_name: member.user.full_name ?? null,
        avatar_url: member.user.avatar_url ?? null,
        created_at: member.user.created_at ?? new Date().toISOString(),
      }
    : undefined,
})

const mapWorkspace = (workspace: any): Workspace => {
  const { workspace_members, ...rest } = workspace

  const members = Array.isArray(workspace_members)
    ? workspace_members.map(mapWorkspaceMember)
    : []

  return {
    ...rest,
    description: rest.description ?? null,
    icon: rest.icon ?? null,
    color: rest.color ?? null,
    parent_workspace_id: rest.parent_workspace_id ?? null,
    archived_at: rest.archived_at ?? null,
    settings: rest.settings ?? {},
    is_archived: Boolean(rest.is_archived),
    members,
    member_count: rest.member_count ?? members.length,
  }
}

export function useWorkspaces() {
  const queryClient = useQueryClient()

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members:workspace_members(
            workspace_id,
            user_id,
            role,
            permissions,
            invited_by,
            last_active_at,
            joined_at,
            user:profiles(id, email, full_name, avatar_url, created_at)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data ?? []).map(mapWorkspace) as Workspace[]
    },
  })

  const createWorkspace = useMutation({
    mutationFn: async (workspace: { name: string; description?: string | null }) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!user) throw new Error('Not authenticated')

      const baseSlug = slugify(workspace.name)

      const insertWorkspace = async (slug: string) =>
        supabase
          .from('workspaces')
          .insert({
            name: workspace.name,
            description: workspace.description ?? null,
            owner_id: user.id,
            slug,
          })
          .select()
          .single()

      let attempt = 0
      let slug = baseSlug
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { data: newWorkspace, error: workspaceError } = await insertWorkspace(slug)

        if (!workspaceError) {
          return mapWorkspace(newWorkspace)
        }

        if (workspaceError.code === '23505' && attempt < 3) {
          attempt += 1
          slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
          continue
        }

        throw workspaceError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      toast({
        title: 'Đã tạo workspace',
        description: 'Workspace mới đã sẵn sàng cho nhóm của bạn.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Không thể tạo workspace',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const updateWorkspace = useMutation({
    mutationFn: async ({ id, slug, ...rest }: Partial<Workspace> & { id: string }) => {
      const updates = {
        ...rest,
        slug: slug ? slugify(slug) : undefined,
      }

      const { data, error } = await supabase
        .from('workspaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return mapWorkspace(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      toast({
        title: 'Đã cập nhật workspace',
        description: 'Thông tin workspace đã được lưu lại.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Không thể cập nhật workspace',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const deleteWorkspace = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      toast({
        title: 'Đã xoá workspace',
        description: 'Workspace đã được chuyển vào thùng rác.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Không thể xoá workspace',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    workspaces,
    isLoading,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  }
}

