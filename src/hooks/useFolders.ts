import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'
import { WorkspaceFolder } from '@/types'
import { toast } from '@/hooks/use-toast'

type CreateFolderInput = {
  workspaceId: string
  name: string
  parentId?: string | null
  description?: string | null
  icon?: string | null
  color?: string | null
}

type UpdateFolderInput = {
  id: string
  workspaceId: string
  name?: string
  description?: string | null
  icon?: string | null
  color?: string | null
  is_archived?: boolean
  parentId?: string | null
}

type MoveFolderInput = {
  id: string
  workspaceId: string
  parentId?: string | null
  position?: number
}

type DeleteFolderInput = {
  id: string
  workspaceId: string
}

interface UseFoldersOptions {
  workspaceId?: string
  includeArchived?: boolean
}

interface FolderTreeNode extends WorkspaceFolder {
  children: FolderTreeNode[]
}

const mapFolder = (folder: any): WorkspaceFolder => ({
  ...folder,
  parent_id: folder.parent_id ?? null,
  description: folder.description ?? null,
  icon: folder.icon ?? null,
  color: folder.color ?? null,
  path: Array.isArray(folder.path) ? folder.path.map((id: unknown) => String(id)) : [],
  created_by: folder.created_by ?? null,
  updated_by: folder.updated_by ?? null,
})

const buildFolderTree = (folders: WorkspaceFolder[]): FolderTreeNode[] => {
  const nodeMap = new Map<string, FolderTreeNode>()

  folders.forEach((folder) => {
    nodeMap.set(folder.id, {
      ...folder,
      children: [],
    })
  })

  const roots: FolderTreeNode[] = []

  nodeMap.forEach((node) => {
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      nodeMap.get(node.parent_id)?.children.push(node)
    } else {
      roots.push(node)
    }
  })

  const sortNodes = (nodes: FolderTreeNode[]) => {
    nodes.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
    nodes.forEach((child) => sortNodes(child.children))
  }

  sortNodes(roots)
  return roots
}

export function useFolders({ workspaceId, includeArchived = false }: UseFoldersOptions = {}) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['workspace-folders', workspaceId, includeArchived],
    queryFn: async () => {
      if (!workspaceId) return []

      let query = supabase
        .from('workspace_folders')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('depth', { ascending: true })
        .order('position', { ascending: true })

      if (!includeArchived) {
        query = query.eq('is_archived', false)
      }

      const { data: rows, error: foldersError } = await query
      if (foldersError) throw foldersError

      return (rows ?? []).map(mapFolder) as WorkspaceFolder[]
    },
    enabled: Boolean(workspaceId),
  })

  const folders = data ?? []

  const folderTree = useMemo(() => buildFolderTree(folders), [folders])

  const invalidateFolders = () => {
    queryClient.invalidateQueries({ queryKey: ['workspace-folders', workspaceId] })
  }

  const createFolder = useMutation({
    mutationFn: async (payload: CreateFolderInput) => {
      const { workspaceId: inputWorkspaceId, ...rest } = payload

      const { data: created, error: createError } = await supabase
        .from('workspace_folders')
        .insert({
          workspace_id: inputWorkspaceId,
          parent_id: rest.parentId ?? null,
          name: rest.name,
          description: rest.description,
          icon: rest.icon,
          color: rest.color,
        })
        .select()
        .single()

      if (createError) throw createError

      return mapFolder(created)
    },
    onSuccess: (created) => {
      invalidateFolders()
      toast({
        title: 'Folder created',
        description: `Đã tạo thư mục “${created.name}” thành công`,
      })
    },
    onError: (createError: Error) => {
      toast({
        title: 'Tạo thư mục thất bại',
        description: createError.message,
        variant: 'destructive',
      })
    },
  })

  const updateFolder = useMutation({
    mutationFn: async ({ id, workspaceId: inputWorkspaceId, ...updates }: UpdateFolderInput) => {
      const payload = {
        ...updates,
        parent_id: updates.parentId ?? undefined,
      }

      const { data: updated, error: updateError } = await supabase
        .from('workspace_folders')
        .update(payload)
        .eq('id', id)
        .eq('workspace_id', inputWorkspaceId)
        .select()
        .single()

      if (updateError) throw updateError

      return mapFolder(updated)
    },
    onSuccess: (updated) => {
      invalidateFolders()
      toast({
        title: 'Folder updated',
        description: `Đã cập nhật thư mục “${updated.name}”`,
      })
    },
    onError: (updateError: Error) => {
      toast({
        title: 'Cập nhật thư mục thất bại',
        description: updateError.message,
        variant: 'destructive',
      })
    },
  })

  const moveFolder = useMutation({
    mutationFn: async ({ id, workspaceId: inputWorkspaceId, parentId = null, position }: MoveFolderInput) => {
      const { data: moved, error: moveError } = await supabase
        .from('workspace_folders')
        .update({
          parent_id: parentId,
          // Setting position to null lets trigger recalculate if not provided
          position: position ?? null,
        })
        .eq('id', id)
        .eq('workspace_id', inputWorkspaceId)
        .select()
        .single()

      if (moveError) throw moveError

      return mapFolder(moved)
    },
    onSuccess: (moved) => {
      invalidateFolders()
      toast({
        title: 'Folder moved',
        description: `Đã di chuyển thư mục “${moved.name}”`,
      })
    },
    onError: (moveError: Error) => {
      toast({
        title: 'Di chuyển thư mục thất bại',
        description: moveError.message,
        variant: 'destructive',
      })
    },
  })

  const deleteFolder = useMutation({
    mutationFn: async ({ id, workspaceId: inputWorkspaceId }: DeleteFolderInput) => {
      const { error: deleteError } = await supabase
        .from('workspace_folders')
        .delete()
        .eq('id', id)
        .eq('workspace_id', inputWorkspaceId)

      if (deleteError) throw deleteError
    },
    onSuccess: () => {
      invalidateFolders()
      toast({
        title: 'Đã xoá thư mục',
        description: 'Thư mục và các thư mục con đã được xoá',
      })
    },
    onError: (deleteError: Error) => {
      toast({
        title: 'Xoá thư mục thất bại',
        description: deleteError.message,
        variant: 'destructive',
      })
    },
  })

  return {
    folders,
    folderTree,
    isLoading,
    error,
    createFolder,
    updateFolder,
    moveFolder,
    deleteFolder,
  }
}

