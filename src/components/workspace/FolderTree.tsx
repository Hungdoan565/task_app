import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Folder as FolderIcon,
  FolderOpen,
  FolderPlus,
  MoreHorizontal,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useConfirmDialog } from '@/components/providers/ConfirmDialogProvider'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { useFolders } from '@/hooks/useFolders'
import type { WorkspaceFolder } from '@/types'

import FolderDialog from './FolderDialog'

type DialogState =
  | { open: false }
  | {
      open: true
      mode: 'create' | 'rename'
      parentId?: string | null
      parentName?: string
      folder?: WorkspaceFolder | null
    }

interface FolderTreeProps {
  workspaceId: string
}

export default function FolderTree({ workspaceId }: FolderTreeProps) {
  const { confirm } = useConfirmDialog()
  const {
    currentFolder,
    setCurrentFolder,
    folderDialogTrigger,
    setFolderDialogTrigger,
  } = useStore()
  const { folderTree, isLoading, createFolder, updateFolder, deleteFolder } = useFolders({ workspaceId })

  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set())
  const [dialogState, setDialogState] = useState<DialogState>({ open: false })

  const handleToggle = useCallback((folderId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }, [])

  const openCreateDialog = useCallback(
    (parent?: WorkspaceFolder | null) => {
      setDialogState({
        open: true,
        mode: 'create',
        parentId: parent?.id ?? null,
        parentName: parent?.name,
        folder: parent ?? null,
      })
    },
    [],
  )

  const openRenameDialog = useCallback(
    (folder: WorkspaceFolder) => {
      setDialogState({
        open: true,
        mode: 'rename',
        parentId: folder.parent_id ?? null,
        folder,
      })
    },
    [],
  )

  const handleDialogSubmit = async ({ name, description }: { name: string; description?: string | null }) => {
    if (!dialogState.open) return

    if (dialogState.mode === 'create') {
      await createFolder.mutateAsync({
        workspaceId,
        name,
        parentId: dialogState.parentId ?? null,
        description: description ?? null,
      })
    } else if (dialogState.mode === 'rename' && dialogState.folder) {
      await updateFolder.mutateAsync({
        id: dialogState.folder.id,
        workspaceId,
        name,
        description: description ?? null,
      })
    }
  }

  const handleDelete = async (folder: WorkspaceFolder) => {
    const confirmed = await confirm({
      title: `Xoá thư mục “${folder.name}”?`,
      description:
        'Tất cả thư mục con và công việc bên trong sẽ bị xoá hoặc được đưa về trạng thái chưa phân loại.',
      confirmText: 'Xoá thư mục',
      cancelText: 'Giữ lại',
      confirmVariant: 'destructive',
    })

    if (!confirmed) return

    await deleteFolder.mutateAsync({ id: folder.id, workspaceId })

    if (currentFolder?.id === folder.id) {
      setCurrentFolder(null)
    }
  }

  const flattenedIds = useMemo(() => {
    const ids: string[] = []
    const traverse = (nodes: WorkspaceFolder[]) => {
      nodes.forEach((node) => {
        ids.push(node.id)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(folderTree)
    return ids
  }, [folderTree])

  // Remove collapsed ids that no longer exist
  useEffect(() => {
    setCollapsedIds((prev) => {
      const next = new Set(Array.from(prev).filter((id) => flattenedIds.includes(id)))
      // Only update if the set actually changed to prevent infinite loop
      if (next.size === prev.size && Array.from(next).every((id) => prev.has(id))) {
        return prev
      }
      return next
    })
  }, [flattenedIds])

  const findFolderById = useCallback(
    (nodes: WorkspaceFolder[], id: string): WorkspaceFolder | null => {
      for (const node of nodes) {
        if (node.id === id) return node
        if (node.children && node.children.length > 0) {
          const childMatch = findFolderById(node.children, id)
          if (childMatch) return childMatch
        }
      }
      return null
    },
    [],
  )

  useEffect(() => {
    if (!folderDialogTrigger) return
    if (folderDialogTrigger.workspaceId !== workspaceId) return

    if (folderDialogTrigger.mode === 'create') {
      const parent = folderDialogTrigger.parentId
        ? findFolderById(folderTree, folderDialogTrigger.parentId)
        : null
      openCreateDialog(parent ?? null)
    }

    setFolderDialogTrigger(null)
  }, [
    folderDialogTrigger,
    workspaceId,
    folderTree,
    findFolderById,
    openCreateDialog,
    setFolderDialogTrigger,
  ])

  const renderNodes = (nodes: WorkspaceFolder[], depth = 0) => {
    return nodes.map((node) => {
      const hasChildren = (node.children?.length ?? 0) > 0
      const isCollapsed = collapsedIds.has(node.id)
      const isActive = currentFolder?.id === node.id

      return (
        <ContextMenu key={node.id}>
          <ContextMenuTrigger asChild>
            <div
              className={cn(
                'group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
              style={{ paddingLeft: 8 + depth * 16 }}
            >
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleToggle(node.id)}
                  aria-label={isCollapsed ? 'Mở rộng thư mục' : 'Thu gọn thư mục'}
                >
                  {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              ) : (
                <span className="inline-flex h-4 w-4" />
              )}

              <button
                type="button"
                className={cn('flex items-center gap-2 text-left', isActive && 'font-semibold')}
                onClick={() => setCurrentFolder(node)}
              >
                {isCollapsed ? (
                  <FolderIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="truncate max-w-[140px]">{node.name}</span>
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Tuỳ chọn thư mục</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => openCreateDialog(node)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Thêm thư mục con
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openRenameDialog(node)}>
                  Đổi tên
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(node)}>
                  Xoá thư mục
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuItem onClick={() => openCreateDialog(node)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Thêm thư mục con
            </ContextMenuItem>
            <ContextMenuItem onClick={() => openRenameDialog(node)}>Đổi tên</ContextMenuItem>
            <ContextMenuItem className="text-destructive" onClick={() => handleDelete(node)}>
              Xoá thư mục
            </ContextMenuItem>
          </ContextMenuContent>

          {hasChildren && !isCollapsed && (
            <div className="space-y-1">{renderNodes(node.children ?? [], depth + 1)}</div>
          )}
        </ContextMenu>
      )
    })
  }

  return (
    <div className="space-y-3" data-tour="folder-tree">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Thư mục</h3>
        <Button size="icon" variant="ghost" onClick={() => openCreateDialog(null)} aria-label="Thêm thư mục cấp cao nhất">
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        <button
          type="button"
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted',
            !currentFolder && 'bg-primary/10 text-primary'
          )}
          onClick={() => setCurrentFolder(null)}
        >
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
          Tất cả công việc
        </button>

        {isLoading ? (
          <div className="space-y-1 pt-2">
            <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-[90%] animate-pulse rounded-md bg-muted" />
          </div>
        ) : folderTree.length > 0 ? (
          <div className="space-y-1">{renderNodes(folderTree)}</div>
        ) : (
          <p className="px-2 py-2 text-sm text-muted-foreground">
            Chưa có thư mục nào. Hãy tạo thư mục đầu tiên để sắp xếp công việc.
          </p>
        )}
      </div>

      {dialogState.open && (
        <FolderDialog
          open={dialogState.open}
          mode={dialogState.mode}
          parentName={dialogState.parentName}
          defaultValues={
            dialogState.mode === 'rename'
              ? {
                  name: dialogState.folder?.name,
                  description: dialogState.folder?.description ?? undefined,
                }
              : undefined
          }
          onOpenChange={(open) => {
            if (!open) {
              setDialogState({ open: false })
            }
          }}
          onSubmit={handleDialogSubmit}
        />
      )}
    </div>
  )
}

