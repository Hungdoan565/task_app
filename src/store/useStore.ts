import { create } from 'zustand'

import type { Workspace, WorkspaceFolder } from '@/types'

interface FolderDialogTrigger {
  workspaceId: string
  parentId?: string | null
  mode: 'create'
  timestamp: number
}

interface AppState {
  currentWorkspace: Workspace | null
  setCurrentWorkspace: (workspace: Workspace | null) => void
  currentFolder: WorkspaceFolder | null
  setCurrentFolder: (folder: WorkspaceFolder | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  createWorkspaceOpen: boolean
  setCreateWorkspaceOpen: (open: boolean) => void
  taskDialogOpen: boolean
  setTaskDialogOpen: (open: boolean) => void
  inviteDialogOpen: boolean
  setInviteDialogOpen: (open: boolean) => void
  folderDialogTrigger: FolderDialogTrigger | null
  setFolderDialogTrigger: (trigger: FolderDialogTrigger | null) => void
}

export const useStore = create<AppState>((set) => ({
  currentWorkspace: null,
  currentFolder: null,
  setCurrentWorkspace: (workspace) =>
    set({
      currentWorkspace: workspace,
      currentFolder: null,
    }),
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  createWorkspaceOpen: false,
  setCreateWorkspaceOpen: (open) => set({ createWorkspaceOpen: open }),
  taskDialogOpen: false,
  setTaskDialogOpen: (open) => set({ taskDialogOpen: open }),
  inviteDialogOpen: false,
  setInviteDialogOpen: (open) => set({ inviteDialogOpen: open }),
  folderDialogTrigger: null,
  setFolderDialogTrigger: (trigger) => set({ folderDialogTrigger: trigger }),
}))

