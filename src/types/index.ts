// User types
export interface User {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  created_at: string
}
// Workspace types
export type WorkspaceVisibility = 'private' | 'team' | 'public'
export interface WorkspaceSettings {
  theme?: 'light' | 'dark' | 'system'
  default_view?: 'list' | 'kanban' | 'calendar'
  task_prefix?: string | null
  working_hours?: {
    start?: string | null
    end?: string | null
    timezone?: string | null
  }
  notifications?: {
    email?: boolean
    push?: boolean
    slack?: string | null
  }
  features?: {
    time_tracking?: boolean
    subtasks?: boolean
    custom_fields?: boolean
  }
  [key: string]: unknown
}
export interface Workspace {
  id: string
  name: string
  description?: string | null
  owner_id: string
  slug: string
  icon?: string | null
  color?: string | null
  parent_workspace_id?: string | null
  visibility: WorkspaceVisibility
  settings: WorkspaceSettings
  is_archived: boolean
  archived_at?: string | null
  created_at: string
  updated_at: string
  // Joined / computed fields
  owner?: User
  parent_workspace?: Workspace
  member_count?: number
  task_count?: number
  folder_count?: number
  members?: WorkspaceMember[]
}

export interface WorkspaceRole {
  key: string
  name: string
  description?: string | null
  priority: number
  is_default: boolean
  created_at: string
}

export interface WorkspacePermissionInfo {
  key: string
  category: string
  description?: string | null
  created_at: string
}

export type WorkspaceInvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked'

export interface WorkspaceInvitation {
  id: string
  workspace_id: string
  email: string
  role_key: string
  permissions: string[]
  message?: string | null
  status: WorkspaceInvitationStatus
  token: string
  invited_by?: string | null
  invited_at: string
  responded_at?: string | null
  updated_at: string
}

export interface WorkspaceStatus {
  id: string
  workspace_id: string
  key: string
  name: string
  description?: string | null
  color?: string | null
  wip_limit?: number | null
  position: number
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

// Workspace folder types
export interface WorkspaceFolder {
  id: string
  workspace_id: string
  parent_id?: string | null
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  color?: string | null
  path: string[]
  depth: number
  position: number
  is_archived: boolean
  created_by?: string | null
  updated_by?: string | null
  created_at: string
  updated_at: string
  // Joined / computed
  parent?: WorkspaceFolder
  children?: WorkspaceFolder[]
  workspace?: Workspace
  task_count?: number
}

export type FolderPermissionLevel = 'view' | 'edit' | 'admin'

export interface FolderPermission {
  folder_id: string
  user_id: string
  permission_level: FolderPermissionLevel
  granted_by?: string | null
  granted_at: string
  // Joined data
  folder?: WorkspaceFolder
  user?: User
  granter?: User
}

// Category types
export interface Category {
  id: string
  workspace_id: string
  name: string
  color?: string | null
  created_at: string
}

// Task types
export type TaskStatus = string
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  workspace_id: string
  folder_id?: string | null
  parent_task_id?: string | null
  title: string
  description?: string | null // Rich text JSON
  status: TaskStatus
  status_id?: string | null
  priority: TaskPriority
  due_date?: string | null
  start_date?: string | null
  category_id?: string | null
  assigned_to?: string | null
  created_by: string
  position: number
  estimated_hours?: number | null
  actual_hours?: number | null
  completion_percentage: number
  tags: string[]
  custom_fields: Record<string, unknown>
  is_template: boolean
  created_at: string
  updated_at: string
  completed_at?: string | null
  archived_at?: string | null
  is_archived: boolean
  // Joined data
  category?: Category
  folder?: WorkspaceFolder
  parent_task?: Task
  assignee?: User
  creator?: User
  subtasks?: Task[]
  watchers?: User[]
  status_info?: WorkspaceStatus
}

// Comment types
export interface Comment {
  id: string
  task_id: string
  user_id: string
  content: string
  created_at: string
  // Joined data
  user?: User
}

// Attachment types
export interface Attachment {
  id: string
  task_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_by: string
  created_at: string
  // Joined data
  uploader?: User
}

// Workspace Member types
export type MemberRole = 'owner' | 'admin' | 'editor' | 'member' | 'viewer' | 'guest'

export type WorkspaceMemberPermissions = Record<string, boolean>

export interface WorkspaceMember {
  workspace_id: string
  user_id: string
  role: MemberRole
  permissions: WorkspaceMemberPermissions
  joined_at: string
  invited_by?: string | null
  last_active_at?: string | null
  // Joined data
  user?: User
  inviter?: User
}

// Activity log types
export interface ActivityLog {
  id: string
  workspace_id: string
  user_id?: string | null
  action: string
  entity_type: string
  entity_id?: string | null
  metadata: Record<string, unknown>
  changes?: Record<string, unknown>
  request_id?: string | null
  ip_address?: string | null
  user_agent?: string | null
  created_at: string
  // Joined data
  user?: User
}



