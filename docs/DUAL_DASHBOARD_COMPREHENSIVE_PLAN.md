
# Kế Hoạch Thiết Kế và Triển Khai Hệ Thống Dual Dashboard
**Phiên bản:** 1.0  
**Ngày tạo:** 04/11/2025  
**Cấp độ:** Enterprise Production-Grade

---

## 📋 MỤC LỤC

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Kiến Trúc UI/UX](#2-kiến-trúc-uiux)
3. [Cấu Trúc Workspace và Folder](#3-cấu-trúc-workspace-và-folder)
4. [Tính Năng User Dashboard](#4-tính-năng-user-dashboard)
5. [Tính Năng Admin Dashboard](#5-tính-năng-admin-dashboard)
6. [Kiến Trúc Kỹ Thuật](#6-kiến-trúc-kỹ-thuật)
7. [Animation và Interaction Design](#7-animation-và-interaction-design)
8. [Data Logic và Business Rules](#8-data-logic-và-business-rules)
9. [Implementation Roadmap](#9-implementation-roadmap)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Mục Tiêu Dự Án

Xây dựng hệ thống dual dashboard cấp enterprise với khả năng:
- **User Dashboard**: Quản lý công việc, workspace, collaboration
- **Admin Dashboard**: Quản trị hệ thống, users, analytics, security
- **Workspace Management**: Hỗ trợ cấu trúc phân cấp không giới hạn độ sâu
- **Real-time Collaboration**: Đồng bộ đa thiết bị, giải quyết conflicts
- **Enterprise Features**: RBAC, audit logs, analytics, security controls

### 1.2 Phạm Vi Dự Án

**Bao gồm:**
- ✅ Dual dashboard architecture (User + Admin)
- ✅ Hierarchical workspace/folder structure
- ✅ Advanced permission system (RBAC)
- ✅ Real-time collaboration features
- ✅ Professional animations (60fps)
- ✅ Responsive design (mobile-first)
- ✅ Dark/Light theme support
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Analytics và reporting
- ✅ Security controls và audit logs

**Không bao gồm:**
- ❌ Mobile native apps (React Native)
- ❌ Desktop apps (Electron)
- ❌ AI/ML features (Phase sau)
- ❌ Video conferencing integration

### 1.3 Tech Stack

```typescript
// Frontend Core
{
  framework: "React 18.2+ with TypeScript 5.0+",
  bundler: "Vite 5.0+",
  routing: "React Router v6",
  state: "Zustand + TanStack Query v5"
}

// UI & Styling
{
  css: "TailwindCSS 3.4+",
  components: "shadcn/ui + Radix UI",
  icons: "Lucide React",
  animations: "Framer Motion",
  charts: "Recharts / Tremor"
}

// Backend & Database
{
  backend: "Supabase (PostgreSQL 15+)",
  auth: "Supabase Auth (JWT + RLS)",
  storage: "Supabase Storage",
  realtime: "Supabase Realtime (WebSocket)"
}

// Additional Libraries
{
  forms: "React Hook Form + Zod",
  dnd: "@dnd-kit/core + @dnd-kit/sortable",
  editor: "Tiptap v2",
  calendar: "React Big Calendar",
  tables: "@tanstack/react-table"
}
```

---

## 2. KIẾN TRÚC UI/UX

### 2.1 Design System Foundation

#### 2.1.1 Typography Scale

```typescript
// Type System
const typography = {
  // Display (Hero sections)
  display: {
    xl: "text-6xl font-bold tracking-tight",    // 60px
    lg: "text-5xl font-bold tracking-tight",    // 48px
    md: "text-4xl font-bold tracking-tight",    // 36px
  },
  
  // Headings
  heading: {
    h1: "text-3xl font-bold",                   // 30px
    h2: "text-2xl font-semibold",               // 24px
    h3: "text-xl font-semibold",                // 20px
    h4: "text-lg font-semibold",                // 18px
  },
  
  // Body Text
  body: {
    xl: "text-lg leading-relaxed",              // 18px
    lg: "text-base leading-relaxed",            // 16px
    md: "text-sm leading-normal",               // 14px
    sm: "text-xs leading-normal",               // 12px
  },
  
  // Special
  label: "text-xs font-semibold uppercase tracking-wider", // Labels
  code: "font-mono text-sm",                    // Code blocks
  caption: "text-xs text-muted-foreground",     // Captions
}
```

#### 2.1.2 Color Palette

```typescript
// Light Theme
const lightTheme = {
  primary: {
    50: "#f0f9ff",   // Lightest
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",  // Base
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",  // Darkest
  },
  
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
  
  semantic: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  }
}

// Dark Theme
const darkTheme = {
  background: {
    primary: "#0a0a0a",     // Main bg
    secondary: "#1a1a1a",   // Cards
    tertiary: "#2a2a2a",    // Elevated
  },
  
  text: {
    primary: "#fafafa",
    secondary: "#a3a3a3",
    tertiary: "#737373",
  },
  
  border: {
    subtle: "#2a2a2a",
    default: "#404040",
    emphasis: "#525252",
  }
}
```

#### 2.1.3 Spacing Scale

```typescript
// Spacing System (4px base)
const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
}

// Component Spacing
const componentSpacing = {
  button: {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3",
    xl: "px-8 py-4",
  },
  
  card: {
    padding: "p-6",
    gap: "space-y-4",
  },
  
  section: {
    padding: "py-16 lg:py-24",
    gap: "space-y-8 lg:space-y-12",
  }
}
```

#### 2.1.4 Shadow System

```typescript
const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  
  // Special shadows
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  focus: "0 0 0 3px rgb(59 130 246 / 0.5)",
}
```

### 2.2 Layout Architecture

#### 2.2.1 User Dashboard Layout

```
┌──────────────────────────────────────────────────────┐
│  Navbar (Fixed)                                      │
│  Logo | Search | Notifications | Profile             │
├────────┬─────────────────────────────────────────────┤
│        │                                              │
│ Side   │  Main Content Area                          │
│ bar    │  ┌────────────────────────────────────────┐ │
│        │  │                                        │ │
│ Nav    │  │  Page Header                          │ │
│ Items  │  │  --------------------------------      │ │
│        │  │                                        │ │
│ - Home │  │  Content Cards                         │ │
│ - Tasks│  │  ┌──────┐ ┌──────┐ ┌──────┐          │ │
│ - Proj │  │  │Card 1│ │Card 2│ │Card 3│          │ │
│ - Team │  │  └──────┘ └──────┘ └──────┘          │ │
│ - Cal  │  │                                        │ │
│ - File │  │  Data Table / Kanban / Calendar        │ │
│        │  │  ┌──────────────────────────────────┐ │ │
│        │  │  │                                  │ │ │
│        │  │  │                                  │ │ │
│        │  │  └──────────────────────────────────┘ │ │
│        │  └────────────────────────────────────────┘ │
└────────┴─────────────────────────────────────────────┘
```

**Specifications:**
- **Navbar**: 64px height, backdrop-blur, sticky top
- **Sidebar**: 256px width (desktop), collapsible to 64px (icon-only)
- **Main Content**: max-width: 1440px, centered, padding: 24px
- **Responsive**: 
  - Mobile: Sidebar becomes drawer (overlay)
  - Tablet: Sidebar auto-collapses to icons
  - Desktop: Full sidebar visible

#### 2.2.2 Admin Dashboard Layout

```
┌──────────────────────────────────────────────────────┐
│  Admin Navbar (Red accent)                           │
│  Logo | Environment | Quick Actions | Admin Profile  │
├──────────┬───────────────────────────────────────────┤
│          │                                            │
│ Admin    │  Dashboard / Stats Overview               │
│ Sidebar  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│          │  │Users │ │Active│ │Tasks │ │Usage │    │
│ Sections │  │ 1.2K │ │  856 │ │ 5.4K │ │ 78% │    │
│ -------- │  └──────┘ └──────┘ └──────┘ └──────┘    │
│          │                                            │
│ Overview │  Charts Area                              │
│ Users    │  ┌─────────────────────────────────────┐  │
│ Worksp.  │  │ Growth Chart (Line/Area)            │  │
│ Tasks    │  │                                     │  │
│ Analytics│  └─────────────────────────────────────┘  │
│ Settings │                                            │
│ Audit    │  Recent Activity / Logs Table             │
│ Security │  ┌─────────────────────────────────────┐  │
│ Billing  │  │ Time │ User │ Action │ Details      │  │
│          │  ├──────┼──────┼────────┼─────────────┤  │
│          │  │ ...  │ ...  │  ...   │    ...      │  │
│          │  └─────────────────────────────────────┘  │
└──────────┴───────────────────────────────────────────┘
```

**Specifications:**
- **Admin Navbar**: Red/Orange accent color to differentiate
- **Sidebar**: Admin-specific navigation, role badges
- **Dashboard**: Heavy use of charts, metrics, tables
- **Security**: All admin actions logged and auditable

### 2.3 Component Hierarchy

#### 2.3.1 Core Components

```typescript
// Layout Components
AppLayout
├── Navbar
│   ├── Logo
│   ├── GlobalSearch
│   ├── NotificationBell
│   ├── ThemeToggle
│   └── UserMenu
├── Sidebar
│   ├── WorkspaceSelector
│   ├── NavigationMenu
│   ├── QuickActions
│   └── UserProfile
└── MainContent
    ├── PageHeader
    ├── Breadcrumbs
    └── PageContent

// Admin Components
AdminLayout
├── AdminNavbar
│   ├── EnvironmentBadge
│   ├── QuickActions
│   └── AdminMenu
├── AdminSidebar
│   ├── AdminNavigation
│   └── SystemStatus
└── AdminContent
    ├── MetricCards
    ├── Charts
    └── DataTables
```

#### 2.3.2 Shared Components

```typescript
// UI Components (shadcn/ui extended)
Button
Card
Dialog
DropdownMenu
Input
Select
Table
Tabs
Toast
Tooltip
Avatar
Badge
Checkbox
Progress
Separator
Sheet
Skeleton

// Custom Components
EmptyState
ErrorBoundary
LoadingSpinner
ConfirmDialog
ImageUploader
FilePreview
RichTextEditor
DateTimePicker
ColorPicker
IconPicker
```

### 2.4 Navigation Patterns

#### 2.4.1 User Dashboard Navigation

```typescript
interface UserNavigation {
  primary: [
    {
      label: "Tổng quan",
      icon: "LayoutDashboard",
      href: "/dashboard",
      badge?: number,
    },
    {
      label: "Công việc",
      icon: "CheckSquare",
      href: "/tasks",
      children: [
        { label: "Tất cả", href: "/tasks/all" },
        { label: "Của tôi", href: "/tasks/mine" },
        { label: "Đã giao", href: "/tasks/assigned" },
      ]
    },
    {
      label: "Dự án",
      icon: "Folders",
      href: "/projects",
      badge: "Pro",
    },
    {
      label: "Nhóm",
      icon: "Users",
      href: "/team",
    },
    {
      label: "Lịch",
      icon: "Calendar",
      href: "/calendar",
    },
    {
      label: "Tệp đính kèm",
      icon: "Paperclip",
      href: "/files",
    },
  ],
  
  secondary: [
    {
      label: "Cài đặt",
      icon: "Settings",
      href: "/settings",
    },
    {
      label: "Trợ giúp",
      icon: "HelpCircle",
      href: "/help",
    },
  ]
}
```

#### 2.4.2 Admin Dashboard Navigation

```typescript
interface AdminNavigation {
  sections: [
    {
      title: "Tổng quan",
      items: [
        { label: "Dashboard", icon: "BarChart3", href: "/admin" },
        { label: "Analytics", icon: "TrendingUp", href: "/admin/analytics" },
      ]
    },
    {
      title: "Quản lý",
      items: [
        { label: "Người dùng", icon: "Users", href: "/admin/users" },
        { label: "Workspace", icon: "Briefcase", href: "/admin/workspaces" },
        { label: "Công việc", icon: "ListTodo", href: "/admin/tasks" },
        { label: "Vai trò", icon: "Shield", href: "/admin/roles" },
      ]
    },
    {
      title: "Hệ thống",
      items: [
        { label: "Cấu hình", icon: "Settings", href: "/admin/config" },
        { label: "Audit Logs", icon: "FileText", href: "/admin/audit" },
        { label: "Bảo mật", icon: "Lock", href: "/admin/security" },
        { label: "Billing", icon: "CreditCard", href: "/admin/billing" },
      ]
    },
  ]
}
```

### 2.5 Responsive Design Strategy

#### 2.5.1 Breakpoints

```typescript
const breakpoints = {
  sm: "640px",   // Mobile landscape
  md: "768px",   // Tablet
  lg: "1024px",  // Desktop
  xl: "1280px",  // Large desktop
  "2xl": "1536px", // Extra large
}

// Usage in Tailwind
"text-sm md:text-base lg:text-lg"
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
"p-4 md:p-6 lg:p-8"
```

#### 2.5.2 Mobile-First Approach

```typescript
// Layout Adaptations
const responsiveLayout = {
  mobile: {
    navbar: "Fixed bottom navigation (5 icons)",
    sidebar: "Drawer (overlay)",
    content: "Full width, single column",
    cards: "Stack vertically",
  },
  
  tablet: {
    navbar: "Top fixed",
    sidebar: "Collapsible (icon-only)",
    content: "Max-width: 768px, 2 columns",
    cards: "2 columns grid",
  },
  
  desktop: {
    navbar: "Top fixed with full features",
    sidebar: "Permanent, expanded",
    content: "Max-width: 1440px, 3-4 columns",
    cards: "3-4 columns grid",
  }
}
```

### 2.6 Dark Mode Implementation

```typescript
// Theme Toggle Component
interface ThemeConfig {
  light: {
    background: "bg-white",
    text: "text-slate-900",
    border: "border-slate-200",
    card: "bg-white shadow-sm",
  },
  
  dark: {
    background: "bg-slate-950",
    text: "text-slate-50",
    border: "border-slate-800",
    card: "bg-slate-900 shadow-lg",
  }
}

// Implementation
const ThemeProvider = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### 2.7 Accessibility Standards

#### 2.7.1 WCAG 2.1 AA Compliance

```typescript
// Accessibility Checklist
const a11yRequirements = {
  perceivable: [
    "Alt text for all images",
    "Color contrast ≥ 4.5:1 (normal text)",
    "Color contrast ≥ 3:1 (large text)",
    "No information by color alone",
    "Text resizable to 200%",
  ],
  
  operable: [
    "All functionality keyboard accessible",
    "Focus indicators visible",
    "Skip to main content link",
    "No keyboard traps",
    "Sufficient time for interactions",
  ],
  
  understandable: [
    "Page language specified (lang='vi')",
    "Clear form labels",
    "Descriptive error messages",
    "Consistent navigation",
    "Predictable behavior",
  ],
  
  robust: [
    "Valid HTML/ARIA",
    "Compatible with assistive tech",
    "Semantic HTML elements",
    "ARIA landmarks",
    "Screen reader tested",
  ]
}
```

#### 2.7.2 ARIA Implementation

```tsx
// Example: Accessible Button
<button
  type="button"
  aria-label="Tạo công việc mới"
  aria-expanded={isOpen}
  aria-controls="task-form"
  aria-describedby="task-description"
>
  <Plus className="h-4 w-4" aria-hidden="true" />
  <span>Tạo công việc</span>
</button>

// Example: Accessible Dialog
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogContent role="dialog" aria-modal="true">
    <DialogHeader>
      <DialogTitle id="dialog-title">Tạo workspace mới</DialogTitle>
      <DialogDescription id="dialog-description">
        Nhập thông tin để tạo workspace mới
      </DialogDescription>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

---

## 3. CẤU TRÚC WORKSPACE VÀ FOLDER

### 3.1 Data Model

#### 3.1.1 Database Schema

```sql
-- Workspaces Table (Enhanced)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL, -- For URLs
  icon TEXT, -- Icon name or emoji
  color TEXT, -- Theme color
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}', -- Workspace-specific settings
  is_archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT workspace_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT workspace_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100)
);

-- Folders Table (New - For hierarchical organization)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  position INTEGER DEFAULT 0, -- For manual ordering
  path TEXT, -- Materialized path for quick queries (e.g., /root/folder1/subfolder2)
  depth INTEGER DEFAULT 0, -- Nesting level (0 = root)
  is_archived BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT folder_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  CONSTRAINT folder_max_depth CHECK (depth <= 20), -- Prevent infinite nesting
  CONSTRAINT folder_unique_name_per_parent UNIQUE (workspace_id, parent_folder_id, name)
);

-- Tasks Table (Enhanced with folder support)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE, -- For subtasks
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  tags TEXT[], -- Array of tags
  custom_fields JSONB DEFAULT '{}',
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Workspace Members (Enhanced with more granular roles)
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer', 'guest')),
  permissions JSONB DEFAULT '{}', -- Custom permissions per user
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  last_active_at TIMESTAMP WITH TIME ZONE,
  
  PRIMARY KEY (workspace_id, user_id)
);

-- Folder Permissions (New - For granular access control)
CREATE TABLE folder_permissions (
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permission_level TEXT CHECK (permission_level IN ('view', 'edit', 'admin')),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (folder_id, user_id)
);

-- Activity Logs (New - For audit trail)
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'moved', 'shared'
  entity_type TEXT NOT NULL, -- 'task', 'folder', 'workspace', 'member'
  entity_id UUID NOT NULL,
  changes JSONB, -- Old and new values
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_folders_workspace ON folders(workspace_id);
CREATE INDEX idx_folders_parent ON folders(parent_folder_id);
CREATE INDEX idx_folders_path ON folders USING GIN (to_tsvector('simple', path));
CREATE INDEX idx_tasks_folder ON tasks(folder_id);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX idx_activity_logs_workspace ON activity_logs(workspace_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

#### 3.1.2 TypeScript Interfaces

```typescript
// Enhanced Workspace Interface
interface Workspace {
  id: string
  name: string
  description?: string
  slug: string
  icon?: string
  color?: string
  owner_id: string
  parent_workspace_id?: string
  settings: WorkspaceSettings
  is_archived: boolean
  archived_at?: string
  created_at: string
  updated_at: string
  
  // Computed/Joined fields
  owner?: User
  member_count?: number
  task_count?: number
  folder_count?: number
  members?: WorkspaceMember[]
  role?: MemberRole
}

interface WorkspaceSettings {
  theme?: 'light' | 'dark' | 'auto'
  default_view?: 'list' | 'kanban' | 'calendar'
  task_prefix?: string // e.g., "PROJ-"
  working_hours?: {
    start: string // "09:00"
    end: string // "17:00"
    timezone: string
  }
  notifications?: {
    email: boolean
    push: boolean
    slack?: string
  }
  features?: {
    time_tracking: boolean
    subtasks: boolean
    custom_fields: boolean
  }
}

// Folder Interface
interface Folder {
  id: string
  workspace_id: string
  parent_folder_id?: string
  name: string
  description?: string
  icon?: string
  color?: string
  position: number
  path: string
  depth: number
  is_archived: boolean
  created_by: string
  created_at: string
  updated_at: string
  
  // Computed/Joined fields
  workspace?: Workspace
  parent_folder?: Folder
  children?: Folder[]
  task_count?: number
  permissions?: FolderPermission[]
  user_permission?: 'view' | 'edit' | 'admin'
}

// Enhanced Task Interface
interface Task {
  id: string
  workspace_id: string
  folder_id?: string
  parent_task_id?: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  start_date?: string
  category_id?: string
  assigned_to?: string
  created_by: string
  position: number
  estimated_hours?: number
  actual_hours?: number
  completion_percentage: number
  tags?: string[]
  custom_fields?: Record<string, any>
  is_template: boolean
  created_at: string
  updated_at: string
  completed_at?: string
  
  // Computed/Joined fields
  workspace?: Workspace
  folder?: Folder
  parent_task?: Task
  subtasks?: Task[]
  category?: Category
  assignee?: User
  creator?: User
  comments?: Comment[]
  attachments?: Attachment[]
  watchers?: User[]
}

type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked' | 'archived'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// Member Role (Enhanced)
type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'

interface WorkspaceMember {
  workspace_id: string
  user_id: string
  role: MemberRole
  permissions: MemberPermissions
  joined_at: string
  invited_by?: string
  last_active_at?: string
  
  // Joined data
  user?: User
  inviter?: User
}

interface MemberPermissions {
  can_create_tasks?: boolean
  can_edit_tasks?: boolean
  can_delete_tasks?: boolean
  can_manage_members?: boolean
  can_manage_folders?: boolean
  can_view_analytics?: boolean
  can_export_data?: boolean
}

// Folder Permission
interface FolderPermission {
  folder_id: string
  user_id: string
  permission_level: 'view' | 'edit' | 'admin'
  granted_by: string
  granted_at: string
  
  // Joined data
  folder?: Folder
  user?: User
  granter?: User
}

// Activity Log
interface ActivityLog {
  id: string
  workspace_id: string
  user_id?: string
  action: ActivityAction
  entity_type: EntityType
  entity_id: string
  changes?: {
    before?: any
    after?: any
  }
  ip_address?: string
  user_agent?: string
  created_at: string
  
  // Joined data
  workspace?: Workspace
  user?: User
}

type ActivityAction = 'created' | 'updated' | 'deleted' | 'moved' | 'shared' | 'archived' | 'restored'
type EntityType = 'task' | 'folder' | 'workspace' | 'member' | 'comment' | 'attachment'
```

### 3.2 Hierarchical Structure Features

#### 3.2.1 Unlimited Nesting Depth

```typescript
// Recursive folder tree structure
interface FolderTree {
  folder: Folder
  children: FolderTree[]
  taskCount: number
  totalTaskCount: number // Including all descendants
}

// Fetch folder tree with depth
async function getFolderTree(
  workspaceId: string,
  maxDepth: number = 20
): Promise<FolderTree[]> {
  const { data, error } = await supabase.rpc('get_folder_tree', {
    p_workspace_id: workspaceId,
    p_max_depth: maxDepth
  })
  
  if (error) throw error
  return buildTreeStructure(data)
}

// SQL Function for recursive tree query
CREATE OR REPLACE FUNCTION get_folder_tree(
  p_workspace_id UUID,
  p_max_depth INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  parent_folder_id UUID,
  depth INTEGER,
  path TEXT,
  task_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE folder_tree AS (
    -- Base case: root folders
    SELECT 
      f.id,
      f.name,
      f.parent_folder_id,
      f.depth,
      f.path,
      COUNT(t.id) as task_count
    FROM folders f
    LEFT JOIN tasks t ON t.folder_id = f.id
    WHERE f.workspace_id = p_workspace_id 
      AND f.parent_folder_id IS NULL
      AND f.is_archived = FALSE
    GROUP BY f.id
    
    UNION ALL
    
    -- Recursive case: child folders
    SELECT 
      f.id,
      f.name,
      f.parent_folder_id,
      f.depth,
      f.path,
      COUNT(t.id) as task_count
    FROM folders f
    INNER JOIN folder_tree ft ON f.parent_folder_id = ft.id
    LEFT JOIN tasks t ON t.folder_id = f.id
    WHERE f.depth < p_max_depth
      AND f.is_archived = FALSE
    GROUP BY f.id
  )
  SELECT * FROM folder_tree
  ORDER BY path, name;
END;
$$ LANGUAGE plpgsql;
```

#### 3.2.2 Drag-and-Drop Reordering

```typescript
// Using @dnd-kit for folder reordering
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface DnDFolderTreeProps {
  folders: Folder[]
  onReorder: (folderId: string, newPosition: number, newParentId?: string) => Promise<void>
}

const DnDFolderTree: React.FC<DnDFolderTreeProps> = ({ folders, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) return
    
    const activeFolder = folders.find(f => f.id === active.id)
    const overFolder = folders.find(f => f.id === over.id)
    
    if (!activeFolder) return
    
    // Prevent moving folder into its own descendant
    if (overFolder && isDescendant(overFolder, activeFolder)) {
      toast.error('Không thể di chuyển folder vào folder con của nó')
      return
    }
    
    // Calculate new position and parent
    const newParentId = overFolder?.id
    const newPosition = calculateNewPosition(folders, activeFolder, overFolder)
    
    await onReorder(activeFolder.id, newPosition, newParentId)
  }
  
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={folders.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {folders.map(folder => (
          <SortableFolderItem key={folder.id} folder={folder} />
        ))}
      </SortableContext>
    </DndContext>
  )
}

// Helper function to check if folder is descendant
function isDescendant(folder: Folder, potentialAncestor: Folder): boolean {
  return folder.path.startsWith(potentialAncestor.path + '/')
}

// Update folder position and parent
async function updateFolderPosition(
  folderId: string,
  newPosition: number,
  newParentId?: string
): Promise<void> {
  const { error } = await supabase.rpc('move_folder', {
    p_folder_id: folderId,
    p_new_parent_id: newParentId,
    p_new_position: newPosition
  })
  
  if (error) throw error
}
```

#### 3.2.3 Permission Inheritance

```typescript
// Permission inheritance logic
interface EffectivePermissions {
  workspace: MemberPermissions
  folder?: FolderPermission
  inherited: boolean
}

async function getEffectivePermissions(
  userId: string,
  folderId: string
): Promise<EffectivePermissions> {
  // 1. Get workspace-level permissions
  const workspacePermissions = await getWorkspacePermissions(userId, folder.workspace_id)
  
  // 2. Get folder-specific permissions
  const folderPermissions = await getFolderPermissions(userId, folderId)
  
  // 3. If folder has explicit permissions, use them
  if (folderPermissions) {
    return {
      workspace: workspacePermissions,
      folder: folderPermissions,
      inherited: false
    }
  }
  
  // 4. Otherwise, traverse up to find inherited permissions
  const inheritedPermissions = await findInheritedPermissions(userId, folder.parent_folder_id)
  
  return {
    workspace: workspacePermissions,
    folder: inheritedPermissions,
    inherited: true
  }
}

// SQL function for permission checking
CREATE OR REPLACE FUNCTION check_folder_access(
  p_user_id UUID,
  p_folder_id UUID,
  p_required_level TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_workspace_id UUID;
  v_workspace_role TEXT;
  v_folder_permission TEXT;
BEGIN
  -- Get workspace ID
  SELECT workspace_id INTO v_workspace_id
  FROM folders
  WHERE id = p_folder_id;
  
  -- Check workspace membership
  SELECT role INTO v_workspace_role
  FROM workspace_members
  WHERE workspace_id = v_workspace_id AND user_id = p_user_id;
  
  -- Owner and admin have full access
  IF v_workspace_role IN ('owner', 'admin') THEN
    RETURN TRUE;
  END IF;
  
  -- Check folder-specific permissions (including inherited)
  WITH RECURSIVE folder_hierarchy AS (
    SELECT id, parent_folder_id, 0 as level
    FROM folders
    WHERE id = p_folder_id
    
    UNION ALL
    
    SELECT f.id, f.parent_folder_id, fh.level + 1
    FROM folders f
    INNER JOIN folder_hierarchy fh ON f.id = fh.parent_folder_id
    WHERE fh.level < 20
  )
  SELECT fp.permission_level INTO v_folder_permission
  FROM folder_permissions fp
  INNER JOIN folder_hierarchy fh ON fp.folder_id = fh.id
  WHERE fp.user_id = p_user_id
  ORDER BY fh.level ASC
  LIMIT 1;
  
  -- Check permission level
  RETURN CASE
    WHEN p_required_level = 'view' THEN 
      v_folder_permission IN ('view', 'edit', 'admin')
    WHEN p_required_level = 'edit' THEN 
      v_folder_permission IN ('edit', 'admin')
    WHEN p_required_level = 'admin' THEN 
      v_folder_permission = 'admin'
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.3 Conflict Resolution

#### 3.3.1 Optimistic Locking

```typescript
// Version-based optimistic locking
interface VersionedEntity {
  id: string
  version: number
  updated_at: string
}

async function updateWithOptimisticLock<T extends VersionedEntity>(
  table: string,
  id: string,
  currentVersion: number,
  updates: Partial<T>
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .update({
      ...updates,
      version: currentVersion + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('version', currentVersion)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      throw new ConflictError('Dữ liệu đã được cập nhật bởi người khác')
    }
    throw error
  }
  
  return data
}

// Conflict resolution UI
const ConflictResolutionDialog: React.FC<{
  localChanges: any
  serverChanges: any
  onResolve: (resolution: 'local' | 'server' | 'merge') => void
}> = ({ localChanges, serverChanges, onResolve }) => {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phát hiện xung đột</DialogTitle>
          <DialogDescription>
            Dữ liệu đã được cập nhật bởi người khác trong khi bạn đang chỉnh sửa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Thay đổi của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <DiffView changes={localChanges} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Thay đổi từ server</CardTitle>
            </CardHeader>
            <CardContent>
              <DiffView changes={serverChanges} />
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onResolve('server')}>
            Giữ phiên bản server
          </Button>
          <Button onClick={() => onResolve('local')}>
            Ghi đè bằng thay đổi của tôi
          </Button>
          <Button onClick={() => onResolve('merge')}>
            Merge cả hai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 3.3.2 Real-time Conflict Detection

```typescript
// Using Supabase Realtime for conflict detection
function useConflictDetection(entityType: string, entityId: string) {
  const [hasConflict, setHasConflict] = useState(false)
  const [remoteVersion, setRemoteVersion] = useState<any>(null)
  
  useEffect(() => {
    const subscription = supabase
      .channel(`${entityType}:${entityId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: entityType,
          filter: `id=eq.${entityId}`
        },
        (payload) => {
          setRemoteVersion(payload.new)
          setHasConflict(true)
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [entityType, entityId])
  
  return { hasConflict, remoteVersion }
}

// Usage in form
const TaskEditForm: React.FC<{ task: Task }> = ({ task }) => {
  const { hasConflict, remoteVersion } = useConflictDetection('tasks', task.id)
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  
  useEffect(() => {
    if (hasConflict) {
      setShowConflictDialog(true)
    }
  }, [hasConflict])
  
  // Form implementation...
}
```

### 3.4 Sharing Mechanisms

```typescript
// Workspace sharing
interface WorkspaceInvite {
  id: string
  workspace_id: string
  email: string
  role: MemberRole
  token: string
  expires_at: string
  invited_by: string
  accepted_at?: string
  created_at: string
}

async function inviteToWorkspace(
  workspaceId: string,
  email: string,
  role: MemberRole,
  customMessage?: string
): Promise<WorkspaceInvite> {
  // Generate invite token
  const token = generateSecureToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry
  
  // Create invite
  const { data: invite, error } = await supabase
    .from('workspace_invites')
    .insert({
      workspace_id: workspaceId,
      email,
      role,
      token,
      expires_at: expiresAt.toISOString(),
      invited_by: currentUser.id
    })
    .single()
  
  if (error) throw error
  
  // Send email
  await sendInviteEmail({
    to: email,
    workspace: workspace,
    inviter: currentUser,
    role,
    token,
    customMessage
  })
  
  return invite
}

// Public sharing link
interface PublicShareLink {
  id: string
  entity_type: 'workspace' | 'folder' | 'task'
  entity_id: string
  token: string
  permission_level: 'view' | 'edit'
  expires_at?: string
  password?: string
  access_count: number
  max_access_count?: number
  created_by: string
  created_at: string
}

async function createPublicShareLink(
  entityType: string,
  entityId: string,
  options: {
    permission: 'view' | 'edit'
    expiresIn?: number // days
    password?: string
    maxAccessCount?: number
  }
): Promise<PublicShareLink> {
  const token = generateSecureToken(32)
  
  const expiresAt = options.expiresIn
    ? new Date(Date.now() + options.expiresIn * 24 * 60 * 60 * 1000)
    : null
  
  const { data, error } = await supabase
    .from('public_share_links')
    .insert({
      entity_type: entityType,
      entity_id: entityId,
      token,
      permission_level: options.permission,
      expires_at: expiresAt?.toISOString(),
      password: options.password ? await hashPassword(options.password) : null,
      max_access_count: options.maxAccessCount,
      created_by: currentUser.id
    })
    .single()
  
  if (error) throw error
  
  return data
}

// Access public link
async function accessPublicLink(
  token: string,
  password?: string
): Promise<{ entity: any, permission: string }> {
  // Verify link
  const { data: link, error } = await supabase
    .from('public_share_links')
    .select('*')
    .eq('token', token)
    .single()
  
  if (error || !link) {
    throw new Error('Link không tồn tại hoặc đã hết hạn')
  }
  
  // Check expiry
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    throw new Error('Link đã hết hạn')
  }
  
  // Check access count
  if (link.max_access_count && link.access_count >= link.max_access_count) {
    throw new Error('Link đã đạt giới hạn truy cập')
  }
  
  // Verify password
  if (link.password && !await verifyPassword(password, link.password)) {
    throw new Error('Mật khẩu không đúng')
  }
  
  // Increment access count
  await supabase
    .from('public_share_links')
    .update({ access_count: link.access_count + 1 })
    .eq('id', link.id)
  
  // Fetch entity
  const entity = await fetchEntity(link.entity_type, link.entity_id)
  
  return {
    entity,
    permission: link.permission_level
  }
}
```

---

## 4. TÍNH NĂNG USER DASHBOARD

### 4.1 Core Features

#### 4.1.1 Workspace Browsing

```typescript
// Workspace List Component
const WorkspaceList: React.FC = () => {
  const { workspaces, isLoading } = useWorkspaces()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'tasks'>('recent')
  const [filterArchived, setFilterArchived] = useState(false)
  
  const sortedWorkspaces = useMemo(() => {
    let filtered = filterArchived
      ? workspaces
      : workspaces?.filter(w => !w.is_archived)
    
    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'recent':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'tasks':
          return (b.task_count || 0) - (a.task_count || 0)
        default:
          return 0
      }
    })
  }, [workspaces, sortBy, filterArchived])
  
  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Gần đây</SelectItem>
              <SelectItem value="name">Tên A-Z</SelectItem>
              <SelectItem value="tasks">Số công việc</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterArchived(!filterArchived)}
          >
            {filterArchived ? 'Ẩn' : 'Hiện'} đã lưu trữ
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-accent' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-accent' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Workspace Grid/List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWorkspaces?.map(workspace => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedWorkspaces?.map(workspace => (
            <WorkspaceListItem key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  )
}

// Workspace Card Component
const WorkspaceCard: React.FC<{ workspace: Workspace }> = ({ workspace }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: workspace.color + '20' }}
            >
              {workspace.icon || '📁'}
            </div>
            <div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {workspace.name}
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {workspace.description || 'Không có mô tả'}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Thành viên
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Archive className="h-4 w-4 mr-2" />
                Lưu trữ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Công việc</p>
            <p className="text-2xl font-semibold">{workspace.task_count || 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Thành viên</p>
            <p className="text-2xl font-semibold">{workspace.member_count || 0}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <AvatarGroup users={workspace.members?.map(m => m.user)} max={4} />
          <span className="text-xs text-muted-foreground">
            Cập nhật {formatRelativeTime(workspace.updated_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### 4.1.2 Content Creation and Editing

```typescript
// Task Creation Dialog with Rich Features
const CreateTaskDialog: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  folderId?: string
}> = ({ open, onOpenChange, workspaceId, folderId }) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      folder_id: folderId,
      tags: [],
      custom_fields: {}
    }
  })
  
  const { mutateAsync: createTask, isLoading } = useCreateTask()
  
  const onSubmit = async (values: TaskFormValues) => {
    try {
      await createTask({
        ...values,
        workspace_id: workspaceId
      })
      toast.success('Tạo công việc thành công')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo công việc mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho công việc của bạn
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập tiêu đề công việc..."
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description (Rich Text Editor) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Thêm mô tả chi tiết..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">Cần làm</SelectItem>
                        <SelectItem value="in_progress