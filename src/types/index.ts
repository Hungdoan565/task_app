// User types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

// Workspace types
export interface Workspace {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
}

// Category types
export interface Category {
  id: string
  workspace_id: string
  name: string
  color?: string
  created_at: string
}

// Task types
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  workspace_id: string
  title: string
  description?: string // Rich text JSON
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  category_id?: string
  assigned_to?: string
  created_by: string
  position: number
  created_at: string
  updated_at: string
  // Joined data
  category?: Category
  assignee?: User
  creator?: User
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
export type MemberRole = 'owner' | 'admin' | 'member'

export interface WorkspaceMember {
  workspace_id: string
  user_id: string
  role: MemberRole
  joined_at: string
  // Joined data
  user?: User
}

