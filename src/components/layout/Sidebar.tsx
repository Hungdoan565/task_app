import { Link, useLocation } from 'react-router-dom'
import { useCallback } from 'react'
import { LayoutDashboard, ListTodo, Calendar, Settings, Plus, ChevronDown, Check, Building2, Kanban, FolderPlus, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/store/useStore'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { cn } from '@/lib/utils'
import FolderTree from '@/components/workspace/FolderTree'
import WorkspaceListItem from '@/components/workspace/WorkspaceListItem'
import WorkspaceEditorDialog from '@/components/workspace/WorkspaceEditorDialog'
import { useConfirmDialog } from '@/components/providers/ConfirmDialogProvider'
import { useAuth } from '@/hooks/useAuth'
import { Workspace } from '@/types'

export default function Sidebar() {
  const location = useLocation()
  const {
    sidebarOpen,
    currentWorkspace,
    setCurrentWorkspace,
    setTaskDialogOpen,
    setInviteDialogOpen,
    setCreateWorkspaceOpen,
    openWorkspaceEditor,
    setFolderDialogTrigger,
  } = useStore()
  const { user } = useAuth()
  const { confirm } = useConfirmDialog()
  const { workspaces, deleteWorkspace } = useWorkspaces()

  const navigation = [
    { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kanban', href: '/kanban', icon: Kanban },
    { name: 'Danh sách', href: '/tasks', icon: ListTodo },
    { name: 'Lịch', href: '/calendar', icon: Calendar },
    { name: 'Cài đặt', href: '/settings', icon: Settings },
  ]

  const handleWorkspaceChange = useCallback(
    (workspace: Workspace) => {
      setCurrentWorkspace(workspace)
    },
    [setCurrentWorkspace],
  )

  const handleQuickCreateTask = useCallback(() => {
    if (!currentWorkspace) {
      setCreateWorkspaceOpen(true)
      return
    }
    setTaskDialogOpen(true)
  }, [currentWorkspace, setCreateWorkspaceOpen, setTaskDialogOpen])

  const handleQuickCreateFolder = useCallback(() => {
    if (!currentWorkspace) {
      setCreateWorkspaceOpen(true)
      return
    }
    setFolderDialogTrigger({
      workspaceId: currentWorkspace.id,
      parentId: null,
      mode: 'create',
      timestamp: Date.now(),
    })
  }, [currentWorkspace, setCreateWorkspaceOpen, setFolderDialogTrigger])

  const handleQuickInvite = useCallback(() => {
    if (!currentWorkspace) {
      setCreateWorkspaceOpen(true)
      return
    }
    setInviteDialogOpen(true)
  }, [currentWorkspace, setCreateWorkspaceOpen, setInviteDialogOpen])

  const handleRenameWorkspace = useCallback(
    (workspace: Workspace) => {
      openWorkspaceEditor(workspace)
    },
    [openWorkspaceEditor],
  )

  const handleInviteWorkspaceMembers = useCallback(
    (workspace: Workspace) => {
      setCurrentWorkspace(workspace)
      setInviteDialogOpen(true)
    },
    [setCurrentWorkspace, setInviteDialogOpen],
  )

  const handleDeleteWorkspace = useCallback(
    async (workspace: Workspace) => {
      const confirmed = await confirm({
        title: `Xoá workspace “${workspace.name}”?`,
        description: 'Toàn bộ công việc, thư mục và hoạt động liên quan sẽ bị xoá vĩnh viễn.',
        confirmText: 'Xoá workspace',
        confirmVariant: 'destructive',
      })

      if (!confirmed) return

      try {
        await deleteWorkspace.mutateAsync(workspace.id)

        if (currentWorkspace?.id === workspace.id) {
          const remaining = workspaces?.filter((entry) => entry.id !== workspace.id) ?? []
          if (remaining.length > 0) {
            setCurrentWorkspace(remaining[0])
          } else {
            setCurrentWorkspace(null)
            setCreateWorkspaceOpen(true)
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    [confirm, deleteWorkspace, currentWorkspace?.id, workspaces, setCurrentWorkspace, setCreateWorkspaceOpen],
  )

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 space-y-4 flex-1">
          {/* Workspace Selector */}
          <div data-tour="workspace-selector" tabIndex={-1} aria-label="Workspace selector">
            {workspaces && workspaces.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {currentWorkspace?.icon || currentWorkspace?.name?.charAt(0) || 'W'}
                      </div>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="font-medium text-sm truncate max-w-[140px]">
                          {currentWorkspace?.name || 'Chọn workspace'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {currentWorkspace ? 'Workspace' : 'Không có workspace'}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel className="text-xs text-gray-500">Workspaces của bạn</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => handleWorkspaceChange(workspace)}
                      className="flex items-center gap-3 py-2 cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {workspace.icon || workspace.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{workspace.name}</div>
                        {workspace.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {workspace.description}
                          </div>
                        )}
                      </div>
                      {currentWorkspace?.id === workspace.id && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCreateWorkspaceOpen(true)} className="flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span>Tạo workspace mới</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/workspaces" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      <span>Quản lý workspaces</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="text-center p-4 border-2 border-dashed rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Chưa có workspace</p>
                <Button size="sm" className="w-full" onClick={() => setCreateWorkspaceOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo workspace
                </Button>
              </div>
            )}
          </div>

          {workspaces && workspaces.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Workspaces của bạn</span>
                <span>{workspaces.length}</span>
              </div>
              <div className="space-y-1" role="list" aria-label="Danh sách workspace">
                {workspaces.map((workspace) => {
                  const membership = workspace.members?.find((member) => member.user_id === user?.id)
                  const role = membership?.role ?? (workspace.owner_id === user?.id ? 'owner' : undefined)
                  const canManageMembers = role === 'owner' || role === 'admin'
                  const canManageWorkspace = role === 'owner' || role === 'admin'

                  return (
                    <WorkspaceListItem
                      key={workspace.id}
                      workspace={workspace}
                      isActive={currentWorkspace?.id === workspace.id}
                      canRename={canManageWorkspace}
                      canInvite={canManageMembers}
                      canDelete={workspace.owner_id === user?.id}
                      isDeleting={deleteWorkspace.isPending}
                      onOpen={handleWorkspaceChange}
                      onRename={handleRenameWorkspace}
                      onInvite={handleInviteWorkspaceMembers}
                      onDelete={handleDeleteWorkspace}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {currentWorkspace && (
            <>
              {/* Quick Actions */}
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full justify-start gap-2"
                  data-tour="create-task"
                  onClick={handleQuickCreateTask}
                >
                  <Plus className="h-4 w-4" />
                  Tạo công việc
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleQuickCreateFolder}
                >
                  <FolderPlus className="h-4 w-4" />
                  Tạo thư mục
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleQuickInvite}
                >
                  <UserPlus className="h-4 w-4" />
                  Mời thành viên
                </Button>
              </div>

              <Separator />

              {/* Navigation */}
              <nav
                className="space-y-1"
                data-tour="navigation"
                tabIndex={-1}
                aria-label="Workspace navigation"
              >
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link key={item.name} to={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start font-normal',
                          isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                        )}
                        size="sm"
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  )
                })}
              </nav>

              <Separator />

              {/* Folder Tree */}
              <FolderTree workspaceId={currentWorkspace.id} />
            </>
          )}
        </div>

        {/* Footer */}
        {currentWorkspace && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Tasks</span>
                <span className="font-medium">{currentWorkspace.task_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Folders</span>
                <span className="font-medium">{currentWorkspace.folder_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Members</span>
                <span className="font-medium">{currentWorkspace.member_count || 1}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <WorkspaceEditorDialog />
    </aside>
  )
}

