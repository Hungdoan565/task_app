# Kế Hoạch Dual Dashboard - Phần 3: Animation, Business Rules và Roadmap

*Tiếp theo từ [DUAL_DASHBOARD_COMPREHENSIVE_PLAN_PART2.md](./DUAL_DASHBOARD_COMPREHENSIVE_PLAN_PART2.md)*

---

## 7. ANIMATION VÀ INTERACTION DESIGN

### 7.1 Animation Principles

```typescript
// Animation Configuration
const ANIMATION_CONFIG = {
  // Duration (ms)
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  
  // Easing functions
  easing: {
    easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
    easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // Stagger delays (for list animations)
  stagger: {
    children: 50,  // ms between each child animation
    fast: 30,
    slow: 100,
  }
}

// Framer Motion Variants
const animationVariants = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  },
  
  // Slide animations
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  
  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  
  slideRight: {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  },
  
  // Scale animations
  scaleIn: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  },
  
  // List stagger animation
  staggerList: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  },
  
  listItem: {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  }
}
```

### 7.2 Component Animations

```typescript
// Animated Card Component
const AnimatedCard: React.FC<{
  children: React.ReactNode
  delay?: number
  className?: string
}> = ({ children, delay = 0, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated List with Stagger
const AnimatedList: React.FC<{
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
}> = ({ items, renderItem }) => {
  return (
    <motion.div
      variants={animationVariants.staggerList}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          variants={animationVariants.listItem}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Modal Animation
const AnimatedDialog: React.FC<DialogProps> = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent asChild>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

// Toast Notification Animation
const AnimatedToast = () => {
  return (
    <Toast asChild>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Toast content */}
      </motion.div>
    </Toast>
  )
}
```

### 7.3 Loading States

```typescript
// Skeleton Screens
const TaskCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

// Spinner Component
const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  return (
    <motion.div
      className={cn('border-2 border-primary border-t-transparent rounded-full', sizeClasses[size])}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: 'linear' 
      }}
    />
  )
}

// Progress Bar Animation
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}

// Pulse Animation for live indicators
const LiveIndicator: React.FC = () => {
  return (
    <motion.div
      className="h-2 w-2 bg-green-500 rounded-full"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}
```

### 7.4 Drag-and-Drop Animations

```typescript
// Draggable Task Card
const DraggableTaskCard: React.FC<{
  task: Task
  isDragging?: boolean
}> = ({ task, isDragging }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      drag={!isDragging}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      whileDrag={{ 
        scale: 1.05, 
        rotate: 2,
        zIndex: 999,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      }}
      transition={{
        layout: { duration: 0.2 }
      }}
    >
      <TaskCard task={task} />
    </motion.div>
  )
}

// Drop Zone Animation
const DropZone: React.FC<{
  isOver: boolean
  children: React.ReactNode
}> = ({ isOver, children }) => {
  return (
    <motion.div
      animate={{
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        scale: isOver ? 1.02 : 1
      }}
      transition={{ duration: 0.2 }}
      className="border-2 border-dashed rounded-lg p-4"
      style={{
        borderColor: isOver ? 'rgb(59, 130, 246)' : 'rgb(226, 232, 240)'
      }}
    >
      {children}
    </motion.div>
  )
}
```

### 7.5 Micro-interactions

```typescript
// Button Hover Effects
const InteractiveButton: React.FC<ButtonProps> = (props) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      {...props}
    />
  )
}

// Card Hover Effect
const InteractiveCard: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <motion.div
      whileHover={{ 
        y: -4,
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      }}
      transition={{ duration: 0.2 }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  )
}

// Checkbox Animation
const AnimatedCheckbox: React.FC<CheckboxProps> = (props) => {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
    >
      <Checkbox {...props} />
    </motion.div>
  )
}

// Success Confetti Animation
const SuccessConfetti: React.FC = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: 'spring',
        stiffness: 260,
        damping: 20
      }}
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />
    </motion.div>
  )
}
```

### 7.6 Performance Optimization

```typescript
// Use CSS transforms instead of position properties
// ✅ Good (GPU accelerated)
const OptimizedAnimation = () => {
  return (
    <motion.div
      animate={{ 
        x: 100,        // transform: translateX(100px)
        y: 50,         // transform: translateY(50px)
        scale: 1.1,    // transform: scale(1.1)
        rotate: 45     // transform: rotate(45deg)
      }}
    />
  )
}

// ❌ Bad (causes reflow)
const UnoptimizedAnimation = () => {
  return (
    <motion.div
      animate={{ 
        left: 100,     // Causes layout recalculation
        top: 50,       // Causes layout recalculation
        width: 200     // Causes layout recalculation
      }}
    />
  )
}

// Use will-change for complex animations
const ComplexAnimation: React.FC = () => {
  return (
    <motion.div
      style={{ willChange: 'transform, opacity' }}
      animate={{ 
        x: [0, 100, 0],
        opacity: [1, 0.5, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity
      }}
    />
  )
}

// Reduce motion for accessibility
const AccessibleAnimation: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.3
      }}
    />
  )
}

// Custom hook for reduced motion
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  return prefersReducedMotion
}
```

---

## 8. DATA LOGIC VÀ BUSINESS RULES

### 8.1 Validation Rules

```typescript
// Zod Schemas for Validation
import { z } from 'zod'

// Workspace Validation
const workspaceSchema = z.object({
  name: z.string()
    .min(2, 'Tên workspace phải có ít nhất 2 ký tự')
    .max(100, 'Tên workspace không được quá 100 ký tự')
    .regex(/^[a-zA-Z0-9\s\-\_]+$/, 'Tên chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới'),
  
  slug: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  
  description: z.string()
    .max(500, 'Mô tả không được quá 500 ký tự')
    .optional(),
  
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Màu sắc không hợp lệ').optional(),
})

// Task Validation
const taskSchema = z.object({
  title: z.string()
    .min(1, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được quá 200 ký tự'),
  
  description: z.string()
    .max(5000, 'Mô tả không được quá 5000 ký tự')
    .optional(),
  
  status: z.enum(['todo', 'in_progress', 'done', 'blocked', 'archived']),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  
  due_date: z.string().datetime().optional()
    .refine((date) => {
      if (!date) return true
      return new Date(date) > new Date()
    }, 'Hạn hoàn thành phải là ngày trong tương lai'),
  
  estimated_hours: z.number()
    .min(0, 'Số giờ ước tính phải lớn hơn 0')
    .max(1000, 'Số giờ ước tính không được quá 1000')
    .optional(),
  
  tags: z.array(z.string())
    .max(10, 'Không được có quá 10 tags')
    .optional(),
})

// Folder Validation
const folderSchema = z.object({
  name: z.string()
    .min(1, 'Tên folder không được để trống')
    .max(100, 'Tên folder không được quá 100 ký tự'),
  
  parent_folder_id: z.string().uuid().optional(),
  
  depth: z.number()
    .min(0)
    .max(20, 'Không thể tạo folder quá 20 cấp'),
})

// User Invite Validation
const inviteSchema = z.object({
  email: z.string()
    .email('Email không hợp lệ'),
  
  role: z.enum(['owner', 'admin', 'editor', 'viewer', 'guest']),
  
  custom_message: z.string()
    .max(500, 'Tin nhắn không được quá 500 ký tự')
    .optional(),
})
```

### 8.2 Business Logic Rules

```typescript
// Workspace Rules
const WORKSPACE_RULES = {
  // Limits per plan
  limits: {
    free: {
      max_workspaces: 3,
      max_members: 5,
      max_tasks: 100,
      max_storage_mb: 100,
    },
    pro: {
      max_workspaces: 50,
      max_members: 50,
      max_tasks: 10000,
      max_storage_mb: 10240, // 10GB
    },
    enterprise: {
      max_workspaces: -1, // unlimited
      max_members: -1,
      max_tasks: -1,
      max_storage_mb: 102400, // 100GB
    }
  },
  
  // Naming rules
  naming: {
    min_length: 2,
    max_length: 100,
    reserved_names: ['admin', 'api', 'system', 'root'],
    reserved_slugs: ['dashboard', 'settings', 'billing'],
  },
  
  // Deletion rules
  deletion: {
    grace_period_days: 30, // Soft delete duration
    can_delete_if: {
      no_active_tasks: true,
      no_pending_invites: true,
      owner_only: true,
    }
  }
}

// Task Rules
const TASK_RULES = {
  // Assignment rules
  assignment: {
    can_assign_to_non_members: false,
    auto_notify_assignee: true,
    require_due_date_for_assignment: false,
  },
  
  // Status transition rules
  status_transitions: {
    todo: ['in_progress', 'blocked'],
    in_progress: ['done', 'blocked', 'todo'],
    blocked: ['todo', 'in_progress'],
    done: ['todo'], // Can reopen
    archived: [], // Cannot change status
  },
  
  // Completion rules
  completion: {
    auto_complete_subtasks: false,
    require_subtasks_done: true, // Parent can't be done if subtasks aren't
    auto_set_completed_at: true,
  },
  
  // Deletion rules
  deletion: {
    soft_delete: true,
    cascade_to_subtasks: true,
    cascade_to_comments: true,
    move_to_trash: true,
    permanent_delete_after_days: 30,
  }
}

// Permission Rules
const PERMISSION_RULES = {
  // Role hierarchy (higher role inherits lower role permissions)
  hierarchy: ['guest', 'viewer', 'editor', 'admin', 'owner'],
  
  // Workspace permissions
  workspace: {
    owner: {
      can_delete_workspace: true,
      can_transfer_ownership: true,
      can_manage_billing: true,
      can_manage_members: true,
      can_manage_all_content: true,
    },
    admin: {
      can_delete_workspace: false,
      can_transfer_ownership: false,
      can_manage_billing: false,
      can_manage_members: true,
      can_manage_all_content: true,
    },
    editor: {
      can_create_content: true,
      can_edit_own_content: true,
      can_edit_others_content: false,
      can_delete_own_content: true,
      can_comment: true,
    },
    viewer: {
      can_view_content: true,
      can_comment: true,
      can_create_content: false,
    },
    guest: {
      can_view_shared_content: true,
      can_comment_on_shared: false,
    }
  }
}

// Implementation of business rules
class BusinessRules {
  // Check if user can create workspace
  static canCreateWorkspace(user: User, currentCount: number): boolean {
    const plan = user.subscription?.plan || 'free'
    const limit = WORKSPACE_RULES.limits[plan].max_workspaces
    
    if (limit === -1) return true // unlimited
    return currentCount < limit
  }
  
  // Check if task status transition is valid
  static canTransitionTaskStatus(
    currentStatus: TaskStatus,
    newStatus: TaskStatus
  ): boolean {
    const allowedTransitions = TASK_RULES.status_transitions[currentStatus]
    return allowedTransitions.includes(newStatus)
  }
  
  // Check if user can perform action
  static canPerformAction(
    userRole: MemberRole,
    action: string,
    resourceOwnerId?: string,
    userId?: string
  ): boolean {
    const permissions = PERMISSION_RULES.workspace[userRole]
    
    // Owner check
    if (resourceOwnerId && userId && resourceOwnerId === userId) {
      return permissions[`can_${action}_own_content`] !== false
    }
    
    return permissions[`can_${action}`] === true
  }
  
  // Calculate workspace usage
  static calculateUsage(workspace: Workspace): WorkspaceUsage {
    return {
      members: workspace.member_count || 0,
      tasks: workspace.task_count || 0,
      storage_mb: workspace.storage_used_mb || 0,
      percentage: {
        members: calculatePercentage(workspace.member_count, workspace.member_limit),
        tasks: calculatePercentage(workspace.task_count, workspace.task_limit),
        storage: calculatePercentage(workspace.storage_used_mb, workspace.storage_limit_mb),
      }
    }
  }
}
```

### 8.3 Conflict Resolution Logic

```typescript
// Conflict Resolution Strategies
enum ConflictStrategy {
  SERVER_WINS = 'server_wins',
  CLIENT_WINS = 'client_wins',
  MANUAL_MERGE = 'manual_merge',
  AUTOMATIC_MERGE = 'automatic_merge',
}

class ConflictResolver {
  // Detect conflicts between local and remote changes
  static detectConflict(
    localVersion: any,
    remoteVersion: any
  ): boolean {
    return localVersion.updated_at !== remoteVersion.updated_at ||
           localVersion.version !== remoteVersion.version
  }
  
  // Resolve conflict based on strategy
  static resolve(
    localChanges: any,
    remoteChanges: any,
    strategy: ConflictStrategy = ConflictStrategy.MANUAL_MERGE
  ): any {
    switch (strategy) {
      case ConflictStrategy.SERVER_WINS:
        return remoteChanges
      
      case ConflictStrategy.CLIENT_WINS:
        return localChanges
      
      case ConflictStrategy.AUTOMATIC_MERGE:
        return this.autoMerge(localChanges, remoteChanges)
      
      case ConflictStrategy.MANUAL_MERGE:
        throw new ConflictError('Manual merge required', {
          local: localChanges,
          remote: remoteChanges
        })
      
      default:
        return remoteChanges
    }
  }
  
  // Automatic merge (field-level merge)
  private static autoMerge(local: any, remote: any): any {
    const merged = { ...remote }
    
    // Merge non-conflicting fields
    for (const [key, localValue] of Object.entries(local)) {
      const remoteValue = remote[key]
      
      // If values are the same, no conflict
      if (JSON.stringify(localValue) === JSON.stringify(remoteValue)) {
        continue
      }
      
      // If remote value hasn't changed, use local value
      if (remoteValue === undefined) {
        merged[key] = localValue
      }
      
      // If local value is newer, use it
      if (local.updated_at > remote.updated_at) {
        merged[key] = localValue
      }
    }
    
    return merged
  }
  
  // Three-way merge (with base version)
  static threeWayMerge(
    base: any,
    local: any,
    remote: any
  ): any {
    const merged = { ...base }
    
    for (const key of Object.keys(base)) {
      const baseValue = base[key]
      const localValue = local[key]
      const remoteValue = remote[key]
      
      // No changes
      if (localValue === baseValue && remoteValue === baseValue) {
        continue
      }
      
      // Only local changed
      if (localValue !== baseValue && remoteValue === baseValue) {
        merged[key] = localValue
      }
      
      // Only remote changed
      if (localValue === baseValue && remoteValue !== baseValue) {
        merged[key] = remoteValue
      }
      
      // Both changed to same value
      if (localValue === remoteValue) {
        merged[key] = localValue
      }
      
      // Both changed to different values - conflict!
      if (localValue !== baseValue && remoteValue !== baseValue && localValue !== remoteValue) {
        throw new ConflictError(`Conflict on field: ${key}`)
      }
    }
    
    return merged
  }
}
```

### 8.4 Data Retention Policies

```typescript
// Data Retention Configuration
const DATA_RETENTION = {
  // Soft-deleted items
  trash: {
    tasks: 30,           // days
    workspaces: 30,
    folders: 30,
    comments: 30,
  },
  
  // Archived items
  archive: {
    tasks: 365,          // 1 year
    workspaces: -1,      // permanent
    activity_logs: 90,   // 90 days
  },
  
  // Logs and analytics
  logs: {
    audit_logs: 365,     // 1 year
    activity_logs: 90,
    system_logs: 30,
    access_logs: 30,
  },
  
  // Session and temporary data
  temporary: {
    sessions: 7,         // days
    invite_tokens: 7,
    reset_tokens: 1,
    uploads_temp: 1,
  }
}

// Auto-cleanup job
async function runDataRetentionCleanup() {
  const now = new Date()
  
  // Clean soft-deleted tasks
  const taskDeleteDate = subDays(now, DATA_RETENTION.trash.tasks)
  await supabase
    .from('tasks')
    .delete()
    .eq('is_deleted', true)
    .lt('deleted_at', taskDeleteDate.toISOString())
  
  // Clean old activity logs
  const activityDeleteDate = subDays(now, DATA_RETENTION.archive.activity_logs)
  await supabase
    .from('activity_logs')
    .delete()
    .lt('created_at', activityDeleteDate.toISOString())
  
  // Clean expired invite tokens
  await supabase
    .from('workspace_invites')
    .delete()
    .lt('expires_at', now.toISOString())
    .is('accepted_at', null)
  
  // Clean old sessions
  const sessionDeleteDate = subDays(now, DATA_RETENTION.temporary.sessions)
  await supabase.auth.admin.deleteExpiredSessions(sessionDeleteDate)
}

// Schedule cleanup job (run daily)
// In production, use a cron job or scheduled function
setInterval(runDataRetentionCleanup, 24 * 60 * 60 * 1000)
```

---

## 9. IMPLEMENTATION ROADMAP

### 9.1 Phase 1: Foundation (Weeks 1-4)

#### Sprint 1.1: Database và Backend Setup (Week 1)
```yaml
Tasks:
  - Setup Supabase project và environment
  - Implement database schema (workspaces, folders, tasks)
  - Create RLS policies
  - Setup Row Level Security
  - Create database functions và triggers
  - Write database migration scripts
  
Deliverables:
  - Complete database schema
  - RLS policies implemented
  - Migration scripts ready
  
Testing:
  - Unit tests for database functions
  - RLS policy testing
  - Performance testing for queries
```

#### Sprint 1.2: Authentication và User Management (Week 2)
```yaml
Tasks:
  - Implement Supabase Auth integration
  - Create user registration flow
  - Setup email/password authentication
  - Add OAuth providers (Google, GitHub)
  - Implement password reset
  - Create user profile management
  
Deliverables:
  - Working authentication system
  - User profile CRUD
  - OAuth integration
  
Testing:
  - Auth flow testing
  - Security testing
  - Session management testing
```

#### Sprint 1.3: Core UI Components (Week 3)
```yaml
Tasks:
  - Setup shadcn/ui components
  - Create design system
  - Implement layout components (Navbar, Sidebar)
  - Build form components
  - Create reusable UI elements
  - Setup dark mode
  
Deliverables:
  - Complete component library
  - Design system documentation
  - Storybook (optional)
  
Testing:
  - Component unit tests
  - Accessibility testing
  - Responsive design testing
```

#### Sprint 1.4: Workspace Management (Week 4)
```yaml
Tasks:
  - Create workspace CRUD operations
  - Implement workspace list và detail views
  - Add workspace member management
  - Create workspace settings
  - Implement workspace switching
  
Deliverables:
  - Working workspace management
  - Member invitation system
  - Workspace settings UI
  
Testing:
  - Integration tests
  - Permission testing
  - Multi-workspace scenarios
```

### 9.2 Phase 2: Core Features (Weeks 5-8)

#### Sprint 2.1: Folder Hierarchy System (Week 5)
```yaml
Tasks:
  - Implement folder CRUD operations
  - Create folder tree UI component
  - Add drag-and-drop functionality
  - Implement folder permissions
  - Add folder navigation breadcrumbs
  
Deliverables:
  - Working folder hierarchy
  - Drag-and-drop interface
  - Permission system
  
Testing:
  - Deep nesting tests
  - Performance testing with large trees
  - Permission inheritance tests
```

#### Sprint 2.2: Task Management (Week 6-7)
```yaml
Tasks:
  - Implement task CRUD operations
  - Create task list views (list, kanban, calendar)
  - Add task detail page
  - Implement rich text editor for descriptions
  - Add file attachments
  - Create comment system
  - Add task assignment và notifications
  
Deliverables:
  - Complete task management system
  - Multiple view options
  - Collaboration features
  
Testing:
  - Task workflow testing
  - Real-time updates testing
  - File upload testing
```

#### Sprint 2.3: Real-time Collaboration (Week 8)
```yaml
Tasks:
  - Setup Supabase Realtime subscriptions
  - Implement presence system
  - Add real-time task updates
  - Create live notifications
  - Add collaborative cursors (optional)
  - Implement conflict resolution
  
Deliverables:
  - Real-time sync across clients
  - Presence indicators
  - Conflict resolution system
  
Testing:
  - Multi-user scenarios
  - Conflict resolution testing
  - Network failure handling
```

### 9.3 Phase 3: Admin Dashboard (Weeks 9-11)

#### Sprint 3.1: Admin UI và Navigation (Week 9)
```yaml
Tasks:
  - Create admin layout và navigation
  - Implement admin routing
  - Add role-based access control
  - Create admin dashboard overview
  - Design admin-specific components
  
Deliverables:
  - Admin layout framework
  - RBAC implementation
  - Dashboard overview
  
Testing:
  - Permission testing
  - Access control testing
  - UI/UX testing
```

#### Sprint 3.2: User và Workspace Management (Week 10)
```yaml
Tasks:
  - Create user management interface
  - Add bulk user operations
  - Implement workspace oversight
  - Create role management
  - Add user activity tracking
  
Deliverables:
  - Admin user management
  - Workspace administration
  - Activity monitoring
  
Testing:
  - Bulk operation testing
  - Performance testing
  - Data integrity testing
```

#### Sprint 3.3: Analytics và Reporting (Week 11)
```yaml
Tasks:
  - Implement analytics dashboard
  - Add metrics visualization (charts)
  - Create audit log viewer
  - Add export functionality
  - Implement usage monitoring
  
Deliverables:
  - Analytics dashboard
  - Audit log system
  - Export features
  
Testing:
  - Data accuracy testing
  - Chart rendering testing
  - Export functionality testing
```

### 9.4 Phase 4: Advanced Features (Weeks 12-14)

#### Sprint 4.1: Search và Filtering (Week 12)
```yaml
Tasks:
  - Implement full-text search
  - Add advanced filtering
  - Create saved searches
  - Add search suggestions
  - Optimize search performance
  
Deliverables:
  - Global search functionality
  - Advanced filters
  - Search optimization
  
Testing:
  - Search accuracy testing
  - Performance testing
  - Edge case testing
```

#### Sprint 4.2: Notifications và Activity Feeds (Week 13)
```yaml
Tasks:
  - Create notification system
  - Add email notifications
  - Implement activity feeds
  - Add notification preferences
  - Create notification center UI
  
Deliverables:
  - Complete notification system
  - Activity feed
  - Email integration
  
Testing:
  - Notification delivery testing
  - Email testing
  - Real-time notification testing
```

#### Sprint 4.3: Polish và Optimization (Week 14)
```yaml
Tasks:
  - Add animations và transitions
  - Optimize performance
  - Implement error boundaries
  - Add loading states
  - Improve accessibility
  - Code review và refactoring
  
Deliverables:
  - Polished UI/UX
  - Performance optimizations
  - Accessibility improvements
  
Testing:
  - Performance audits
  - Accessibility audits
  - User acceptance testing
```

### 9.5 Phase 5: Testing và Launch (Weeks 15-16)

#### Sprint 5.1: Comprehensive Testing (Week 15)
```yaml
Tasks:
  - End-to-end testing
  - Security audit
  - Performance testing
  - Cross-browser testing
  - Mobile testing
  - Load testing
  
Deliverables:
  - Test reports
  - Bug fixes
  - Performance benchmarks
  
Testing:
  - All critical paths
  - Security vulnerabilities
  - Performance bottlenecks
```

#### Sprint 5.2: Documentation và Launch (Week 16)
```yaml
Tasks:
  - Write user documentation
  - Create admin guides
  - Prepare API documentation
  - Setup monitoring và logging
  - Deploy to production
  - Launch announcement
  
Deliverables:
  - Complete documentation
  - Production deployment
  - Monitoring setup
  
Post-Launch:
  - Monitor system health
  - Gather user feedback
  - Plan next iteration
```

### 9.6 Success Metrics

```typescript
// KPIs to track
const SUCCESS_METRICS = {
  // Performance Metrics
  performance: {
    lighthouse_score: 90,        // Target: >90
    lcp: 2.5,                    // Target: <2.5s (Largest Contentful Paint)
    fid: 100,                    // Target: <100ms (First Input Delay)
    cls: 0.1,                    // Target: <0.1 (Cumulative Layout Shift)
    ttfb: 600,                   // Target: <600ms (Time to First Byte)
  },
  
  // User Engagement
  engagement: {
    dau_mau_ratio: 0.4,          // Target: >40%
    session_duration: 15,         // Target: >15 min average
    retention_d7: 60,            // Target: >60% (7-day retention)
    retention_d30: 40,           // Target: >40% (30-day retention)
  },
  
  // Business Metrics
  business: {
    activation_rate: 70,         // Target: >70% (complete onboarding)
    conversion_rate: 15,         // Target: >15% (free to paid)
    churn_rate: 5,               // Target: <5% monthly
    nps_score: 50,               // Target: >50 (Net Promoter Score)
  },
  
  // Technical Metrics
  technical: {
    uptime: 99.9,                // Target: >99.9%
    error_rate: 0.1,             // Target: <0.1%
    api_response_time: 200,      // Target: <200ms (p95)
    database_query_time: 50,     // Target: <50ms (p95)
  }
}
```

### 9.7 Risk Management

```typescript
// Identified Risks và Mitigation
const RISKS = [
  {
    risk: 'Database performance degradation with large datasets',
    impact: 'High',
    probability: 'Medium',
    mitigation: [
      'Implement proper indexing strategy',
      'Use materialized views for complex queries',
      'Implement pagination for large result sets',
      'Setup query performance monitoring',
      'Plan for database scaling (read replicas)'
    ]
  },
  {
    risk: 'Real-time sync conflicts in collaborative editing',
    impact: 'High',
    probability: 'High',
    mitigation: [
      'Implement optimistic locking',
      'Add conflict detection và resolution UI',
      'Use operational transformation for text editing',
      'Implement automatic conflict resolution where possible',
      'Provide clear user feedback on conflicts'
    ]
  },
  {
    risk: 'Security vulnerabilities in RBAC system',
    impact: 'Critical',
    probability: 'Low',
    mitigation: [
      'Implement comprehensive RLS policies',
      'Regular security audits',
      'Penetration testing',
      'Keep dependencies updated',
      'Implement rate limiting và DDoS protection'
    ]
  },
  {
    risk: 'Poor mobile experience',
    impact: 'Medium',
    probability: 'Medium',
    mitigation: [
      'Mobile-first design approach',
      'Extensive mobile testing',
      'Progressive Web App features',
      'Touch-optimized UI components',
      'Responsive design testing on multiple devices'
    ]
  },
  {
    risk: 'Scope creep và timeline delays',
    impact: 'High',
    probability: 'High',
    mitigation: [
      'Clear MVP definition',
      'Strict sprint planning',
      'Regular stakeholder communication',
      'Feature prioritization framework',
      'Buffer time in schedule'
    ]
  }
]
```

---

## 10. TỔNG KẾT

### 10.1 Technology Stack Summary

```yaml
Frontend:
  Framework: React 18.2+ with TypeScript 5.0+
  Build: Vite 5.0+
  UI: TailwindCSS + shadcn/ui + Radix UI
  State: Zustand + TanStack Query
  Animation: Framer Motion
  Forms: React Hook Form + Zod
  DnD: @dnd-kit
  
Backend:
  Platform: Supabase (PostgreSQL 15+)
  Auth: Supabase Auth (JWT + RLS)
  Storage: Supabase Storage
  Realtime: Supabase Realtime (WebSocket)
  
DevOps:
  Hosting: Vercel / Netlify
  CI/CD: GitHub Actions
  Monitoring: Sentry
  Analytics: Google Analytics / PostHog
```

### 10.2 Estimated Costs

```yaml
Development:
  Team: 2-3 developers + 1 designer
  Duration: 16 weeks (4 months)
  Cost: $80,000 - $120,000 (depending on team rates)

Infrastructure (Monthly):
  Supabase: $25 - $99 (Pro plan)
  Hosting: $20 - $50 (Vercel/Netlify)
  Monitoring: $29 (Sentry)
  Email: $15 (SendGrid/Mailgun)
  CDN: $10 - $30
  Total: ~$100 - $220/month

Post-Launch:
  Maintenance: 20-30% of development cost annually
  Support: 1-2 developers part-time
  Ongoing features: Sprint-based development
```

### 10.3 Next Steps

```markdown
1. **Week 1-2: Planning và Setup**
   - Review và approve detailed requirements
   - Setup development environment
   - Initialize project repositories
   - Configure Supabase project
   - Setup CI/CD pipeline

2. **Week 3-4: Design Phase**
   - Finalize UI/UX designs
   - Create design system
   - Design component library
   - Prototype key flows

3. **Week 5+: Development**
   - Follow sprint-based roadmap
   - Regular demos và feedback
   - Iterative improvements
   - Continuous testing

4. **Week 15-16: Launch Preparation**
   - Final testing
   - Documentation
   - Production deployment
   - Launch announcement
```

### 10.4 Support và Maintenance

```yaml
Post-Launch Support:
  - 24/7 monitoring và alerting
  - Weekly performance reviews
  - Monthly security audits
  - Quarterly feature releases
  - Continuous bug fixes
  - User feedback analysis
  - Regular dependency updates

Documentation:
  - User guides
  - Admin documentation
  - API documentation
  - Developer guides
  - Video tutorials
  - FAQ và troubleshooting

Training:
  - Admin training sessions
  - User onboarding materials
  - Self-service resources
  - Support ticket system
```

---

## 📚 REFERENCES

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Framer Motion API](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)

---

**Tài liệu này là bản kế hoạch chi tiết cho việc xây dựng hệ thống Dual Dashboard cấp enterprise. Mọi feedback và điều chỉnh đều được hoan nghênh để đảm bảo dự án đáp ứng đầy đủ các yêu cầu kinh doanh và kỹ thuật.**

**Phiên bản:** 1.0  
**Ngày cập nhật:** 04/11/2025  
**Tác giả:** Development Team