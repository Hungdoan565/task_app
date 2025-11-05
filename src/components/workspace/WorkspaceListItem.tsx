import { useMemo } from 'react'
import {
  ArrowRight,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Workspace } from '@/types'

interface WorkspaceListItemProps {
  workspace: Workspace
  isActive: boolean
  canRename: boolean
  canInvite: boolean
  canDelete: boolean
  isDeleting?: boolean
  onOpen: (workspace: Workspace) => void
  onRename: (workspace: Workspace) => void
  onInvite: (workspace: Workspace) => void
  onDelete: (workspace: Workspace) => void
}

interface WorkspaceAction {
  key: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  disabled?: boolean
  destructive?: boolean
  handler: (workspace: Workspace) => void
}

export function WorkspaceListItem({
  workspace,
  isActive,
  canRename,
  canInvite,
  canDelete,
  isDeleting,
  onOpen,
  onRename,
  onInvite,
  onDelete,
}: WorkspaceListItemProps) {
  const actions = useMemo<WorkspaceAction[]>(
    () => [
      {
        key: 'open',
        label: 'Mở workspace',
        icon: LayoutDashboard,
        handler: onOpen,
      },
      {
        key: 'rename',
        label: 'Đổi tên & mô tả',
        icon: Pencil,
        disabled: !canRename,
        handler: onRename,
      },
      {
        key: 'invite',
        label: 'Mời thành viên',
        icon: UserPlus,
        disabled: !canInvite,
        handler: onInvite,
      },
      {
        key: 'delete',
        label: 'Xoá workspace',
        icon: Trash2,
        disabled: !canDelete || isDeleting,
        destructive: true,
        handler: onDelete,
      },
    ],
    [onOpen, onRename, onInvite, onDelete, canRename, canInvite, canDelete, isDeleting],
  )

  const handleOpen = () => onOpen(workspace)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }

  const renderContextMenuItems = () =>
    actions.map((action) => (
      <ContextMenuItem
        key={action.key}
        disabled={action.disabled}
        onSelect={(event) => {
          event.preventDefault()
          if (action.disabled) return
          action.handler(workspace)
        }}
        className={cn(action.destructive && 'text-destructive focus:text-destructive')}
      >
        <action.icon className="mr-2 h-4 w-4" />
        <span>{action.label}</span>
      </ContextMenuItem>
    ))

  const renderDropdownMenuItems = () =>
    actions.map((action) => (
      <DropdownMenuItem
        key={action.key}
        disabled={action.disabled}
        onSelect={(event) => {
          event.preventDefault()
          if (action.disabled) return
          action.handler(workspace)
        }}
        className={cn(action.destructive && 'text-destructive focus:text-destructive')}
      >
        <action.icon className="mr-2 h-4 w-4" />
        <span>{action.label}</span>
      </DropdownMenuItem>
    ))

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
            isActive
              ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground',
          )}
          aria-current={isActive ? 'true' : undefined}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
            {workspace.icon || workspace.name?.charAt(0) || 'W'}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-medium text-foreground">{workspace.name}</span>
            {workspace.description ? (
              <span className="truncate text-xs text-muted-foreground">{workspace.description}</span>
            ) : (
              <span className="text-xs text-muted-foreground">Workspace riêng tư</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isActive && <ArrowRight className="h-4 w-4 text-primary" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Workspace actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {renderDropdownMenuItems()}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Một số thao tác yêu cầu quyền quản trị.
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">{renderContextMenuItems()}</ContextMenuContent>
    </ContextMenu>
  )
}

export default WorkspaceListItem


