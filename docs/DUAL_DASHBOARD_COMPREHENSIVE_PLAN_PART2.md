
# Kế Hoạch Dual Dashboard - Phần 2: Tính Năng và Triển Khai

*Tiếp theo từ [DUAL_DASHBOARD_COMPREHENSIVE_PLAN.md](./DUAL_DASHBOARD_COMPREHENSIVE_PLAN.md)*

---

## 4. TÍNH NĂNG USER DASHBOARD (Tiếp)

### 4.1.2 Content Creation and Editing (Tiếp)

```typescript
// Task Creation Dialog (Tiếp)
              <SelectContent>
                <SelectItem value="todo">Cần làm</SelectItem>
                <SelectItem value="in_progress">Đang làm</SelectItem>
                <SelectItem value="done">Hoàn thành</SelectItem>
                <SelectItem value="blocked">Bị chặn</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Priority */}
      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Độ ưu tiên</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ ưu tiên" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-600">Thấp</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600">Trung bình</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-600">Cao</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-600">Khẩn cấp</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      {/* Due Date */}
      <FormField
        control={form.control}
        name="due_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hạn hoàn thành</FormLabel>
            <DateTimePicker
              date={field.value}
              onChange={field.onChange}
              placeholder="Chọn ngày và giờ"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Assignee */}
      <FormField
        control={form.control}
        name="assigned_to"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Người thực hiện</FormLabel>
            <UserSelector
              value={field.value}
              onChange={field.onChange}
              workspaceId={workspaceId}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    
    {/* Tags */}
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <TagInput
            tags={field.value}
            onChange={field.onChange}
            placeholder="Thêm tag..."
          />
          <FormMessage />
        </FormItem>
      )}
    />
    
    {/* Attachments */}
    <div>
      <FormLabel>Tệp đính kèm</FormLabel>
      <FileUploader
        onUpload={(files) => {
          // Handle file upload
        }}
        maxSize={10 * 1024 * 1024} // 10MB
        accept={{
          'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
          'application/pdf': ['.pdf'],
          'application/msword': ['.doc', '.docx'],
          'text/*': ['.txt', '.md']
        }}
      />
    </div>
    
    <DialogFooter>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
        Hủy
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Đang tạo...' : 'Tạo công việc'}
      </Button>
    </DialogFooter>
  </form>
</Form>
</DialogContent>
</Dialog>
)
}
```

#### 4.1.3 Real-time Collaboration

```typescript
// Real-time Presence System
interface UserPresence {
  user_id: string
  workspace_id: string
  page: string
  status: 'active' | 'idle' | 'offline'
  cursor_position?: { x: number; y: number }
  editing_entity?: { type: string; id: string }
  last_seen: string
}

function usePresence(workspaceId: string) {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
  const { user } = useAuth()
  
  useEffect(() => {
    if (!workspaceId || !user) return
    
    // Subscribe to presence channel
    const channel = supabase.channel(`workspace:${workspaceId}:presence`)
    
    // Track own presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.values(state).flat() as UserPresence[]
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Send own presence
          await channel.track({
            user_id: user.id,
            workspace_id: workspaceId,
            page: window.location.pathname,
            status: 'active',
            last_seen: new Date().toISOString()
          })
        }
      })
    
    // Update presence on page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        channel.track({ status: 'idle' })
      } else {
        channel.track({ status: 'active' })
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Cleanup
    return () => {
      channel.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [workspaceId, user])
  
  return { onlineUsers }
}

// Collaborative Cursors Component
const CollaborativeCursors: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { onlineUsers } = usePresence(workspaceId)
  const { user } = useAuth()
  
  // Filter out current user
  const otherUsers = onlineUsers.filter(u => u.user_id !== user?.id)
  
  return (
    <>
      {otherUsers.map(presence => (
        presence.cursor_position && (
          <motion.div
            key={presence.user_id}
            className="fixed pointer-events-none z-50"
            style={{
              left: presence.cursor_position.x,
              top: presence.cursor_position.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M5.65376 12.3673L13.0888 5.18826C13.8178 4.48311 15 5.00502 15 6.00763V17.9924C15 18.9951 13.8178 19.5169 13.0888 18.8118L5.65376 11.6327C5.29546 11.2849 5.29546 10.7151 5.65376 10.3673Z"
                  fill={getUserColor(presence.user_id)}
                />
              </svg>
              <div className="absolute left-6 top-2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-lg text-xs font-medium">
                {presence.user?.full_name || 'Anonymous'}
              </div>
            </div>
          </motion.div>
        )
      ))}
    </>
  )
}

// Real-time Comment System
const CommentsSection: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { comments, isLoading } = useComments(taskId)
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()
  
  // Subscribe to new comments
  useEffect(() => {
    const subscription = supabase
      .channel(`comments:task:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `task_id=eq.${taskId}`
        },
        (payload) => {
          // Add new comment to list
          queryClient.invalidateQueries(['comments', taskId])
          
          // Show toast notification if not from current user
          if (payload.new.user_id !== user?.id) {
            toast.info(`${payload.new.user?.full_name} đã thêm bình luận mới`)
          }
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [taskId, user])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    try {
      await createComment({
        task_id: taskId,
        content: newComment
      })
      setNewComment('')
    } catch (error) {
      toast.error('Không thể thêm bình luận')
    }
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bình luận ({comments?.length || 0})</h3>
      
      {/* Comment List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments?.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      
      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Avatar>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Thêm bình luận..."
            className="min-h-[80px]"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="submit" size="sm">
              Gửi bình luận
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
```

### 4.2 Search and Filtering

```typescript
// Advanced Search Component
const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    types: ['tasks', 'workspaces', 'folders'],
    workspaces: [],
    dateRange: null,
    assignees: []
  })
  const [isOpen, setIsOpen] = useState(false)
  
  const { data: results, isLoading } = useSearch(query, filters, {
    enabled: query.length >= 2
  })
  
  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-64 justify-start text-muted-foreground">
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm... <kbd className="ml-auto">⌘K</kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Tìm kiếm công việc, workspace, folder..."
            value={query}
            onValueChange={setQuery}
          />
          
          <CommandList>
            <CommandEmpty>
              Không tìm thấy kết quả cho "{query}"
            </CommandEmpty>
            
            {/* Tasks */}
            {results?.tasks && results.tasks.length > 0 && (
              <CommandGroup heading="Công việc">
                {results.tasks.map(task => (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      navigate(`/tasks/${task.id}`)
                      setIsOpen(false)
                    }}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {task.workspace?.name} • {task.folder?.name}
                      </div>
                    </div>
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {/* Workspaces */}
            {results?.workspaces && results.workspaces.length > 0 && (
              <CommandGroup heading="Workspaces">
                {results.workspaces.map(workspace => (
                  <CommandItem
                    key={workspace.id}
                    onSelect={() => {
                      navigate(`/workspaces/${workspace.id}`)
                      setIsOpen(false)
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{workspace.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {workspace.task_count} công việc
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {/* Folders */}
            {results?.folders && results.folders.length > 0 && (
              <CommandGroup heading="Folders">
                {results.folders.map(folder => (
                  <CommandItem
                    key={folder.id}
                    onSelect={() => {
                      navigate(`/folders/${folder.id}`)
                      setIsOpen(false)
                    }}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">{folder.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {folder.path}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          
          {/* Advanced Filters */}
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc nâng cao
            </Button>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

// Search API with PostgreSQL Full-Text Search
async function searchContent(
  query: string,
  filters: SearchFilters
): Promise<SearchResults> {
  const { data, error } = await supabase.rpc('search_content', {
    search_query: query,
    filter_types: filters.types,
    filter_workspaces: filters.workspaces,
    filter_date_from: filters.dateRange?.from,
    filter_date_to: filters.dateRange?.to,
    filter_assignees: filters.assignees
  })
  
  if (error) throw error
  return data
}

-- SQL Function for Full-Text Search
CREATE OR REPLACE FUNCTION search_content(
  search_query TEXT,
  filter_types TEXT[],
  filter_workspaces UUID[],
  filter_date_from TIMESTAMP,
  filter_date_to TIMESTAMP,
  filter_assignees UUID[]
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'tasks', (
      SELECT COALESCE(json_agg(t.*), '[]'::json)
      FROM (
        SELECT 
          id, title, description, status, priority, workspace_id, folder_id,
          ts_rank(
            to_tsvector('simple', title || ' ' || COALESCE(description, '')),
            plainto_tsquery('simple', search_query)
          ) AS rank
        FROM tasks
        WHERE 'tasks' = ANY(filter_types)
          AND to_tsvector('simple', title || ' ' || COALESCE(description, '')) 
            @@ plainto_tsquery('simple', search_query)
          AND (CARDINALITY(filter_workspaces) = 0 OR workspace_id = ANY(filter_workspaces))
          AND (filter_date_from IS NULL OR created_at >= filter_date_from)
          AND (filter_date_to IS NULL OR created_at <= filter_date_to)
          AND (CARDINALITY(filter_assignees) = 0 OR assigned_to = ANY(filter_assignees))
        ORDER BY rank DESC
        LIMIT 20
      ) t
    ),
    'workspaces', (
      SELECT COALESCE(json_agg(w.*), '[]'::json)
      FROM (
        SELECT id, name, description, slug
        FROM workspaces
        WHERE 'workspaces' = ANY(filter_types)
          AND to_tsvector('simple', name || ' ' || COALESCE(description, ''))
            @@ plainto_tsquery('simple', search_query)
        LIMIT 10
      ) w
    ),
    'folders', (
      SELECT COALESCE(json_agg(f.*), '[]'::json)
      FROM (
        SELECT id, name, path, workspace_id
        FROM folders
        WHERE 'folders' = ANY(filter_types)
          AND to_tsvector('simple', name || ' ' || path)
            @@ plainto_tsquery('simple', search_query)
        LIMIT 10
      ) f
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### 4.3 Notifications System

```typescript
// Notification Types
type NotificationType = 
  | 'task_assigned'
  | 'task_mentioned'
  | 'task_comment'
  | 'task_due_soon'
  | 'task_overdue'
  | 'workspace_invite'
  | 'member_joined'
  | 'file_uploaded'

interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  action_url?: string
  entity_type?: string
  entity_id?: string
  is_read: boolean
  created_at: string
  metadata?: Record<string, any>
}

// Notification Center Component
const NotificationCenter: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-96">
          {notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Chưa có thông báo nào
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications?.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full">
            Xem tất cả thông báo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification
  onRead: () => void
}> = ({ notification, onRead }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    onRead()
    if (notification.action_url) {
      navigate(notification.action_url)
    }
  }
  
  const getIcon = () => {
    switch (notification.type) {
      case 'task_assigned':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'task_mentioned':
        return <AtSign className="h-5 w-5 text-purple-500" />
      case 'task_comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case 'task_due_soon':
        return <Clock className="h-5 w-5 text-orange-500" />
      case 'task_overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'workspace_invite':
        return <UserPlus className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex gap-3 p-4 cursor-pointer hover:bg-accent transition-colors",
        !notification.is_read && "bg-blue-50 dark:bg-blue-950"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
      
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
      )}
    </motion.div>
  )
}

// Real-time notification subscription
function useNotifications() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!user) return
    
    const subscription = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Invalidate queries to fetch new notifications
          queryClient.invalidateQueries(['notifications'])
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(payload.new.title, {
              body: payload.new.message,
              icon: '/logo.png'
            })
          }
          
          // Play notification sound
          playNotificationSound()
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [user, queryClient])
  
  // ... rest of the hook
}
```

### 4.4 Activity Feeds

```typescript
// Activity Feed Component
const ActivityFeed: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const { activities, isLoading, fetchNextPage, hasNextPage } = useActivities(workspaceId)
  const { ref, inView } = useInView()
  
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.data.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </Fragment>
            ))}
            
            {hasNextPage && (
              <div ref={ref} className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Activity Item Component
const ActivityItem: React.FC<{ activity: ActivityLog }> = ({ activity }) => {
  const getActivityMessage = () => {
    const user = activity.user?.full_name || 'Someone'
    
    switch (activity.action) {
      case 'created':
        return `${user} đã tạo ${activity.entity_type}`
      case 'updated':
        return `${user} đã cập nhật ${activity.entity_type}`
      case 'deleted':
        return `${user} đã xóa ${activity.entity_type}`
      case 'moved':
        return `${user} đã di chuyển ${activity.entity_type}`
      case 'shared':
        return `${user} đã chia sẻ ${activity.entity_type}`
      case 'archived':
        return `${user} đã lưu trữ ${activity.entity_type}`
      default:
        return `${user} đã thực hiện ${activity.action}`
    }
  }
  
  const getActivityIcon = () => {
    switch (activity.action) {
      case 'created':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'updated':
        return <Edit className="h-4 w-4 text-blue-500" />
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />
      case 'moved':
        return <Move className="h-4 w-4 text-purple-500" />
      case 'shared':
        return <Share2 className="h-4 w-4 text-indigo-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }
  
  return (
    <div className="flex gap-3 items-start">
      <Avatar className="h-8 w-8">
        <AvatarImage src={activity.user?.avatar_url} />
        <AvatarFallback>
          {activity.user?.full_name?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {getActivityIcon()}
          <p className="text-sm">
            {getActivityMessage()}
          </p>
        </div>
        
        {activity.changes && (
          <div className="mt-2 text-xs text-muted-foreground">
            <ChangesDiff changes={activity.changes} />
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(activity.created_at)}
        </p>
      </div>
    </div>
  )
}
```

---

## 5. TÍNH NĂNG ADMIN DASHBOARD

### 5.1 User Management

```typescript
// Admin User Management Page
const AdminUsersPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({
    role: null,
    status: null,
    search: ''
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  
  const { users, isLoading } = useAdminUsers(filters)
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý người dùng"
        description="Quản lý tài khoản và quyền truy cập của người dùng"
      >
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Mời người dùng mới
        </Button>
      </PageHeader>
      
      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="max-w-md"
              />
            </div>
            
            <Select
              value={filters.role || 'all'}
              onValueChange={(value) => setFilters({ ...filters, role: value === 'all' ? null : value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? null : value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users?.length}
                  onCheckedChange={(checked) => {
                    setSelectedUsers(checked ? users?.map(u => u.id) || [] : [])
                  }}
                />
              </TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tham gia</TableHead>
              <TableHead>Hoạt động cuối</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      setSelectedUsers(
                        checked
                          ? [...selectedUsers, user.id]
                          : selectedUsers.filter(id => id !== user.id)
                      )
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatRelativeTime(user.last_active_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Phân quyền
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="h-4 w-4 mr-2" />
                        Reset mật khẩu
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Ban className="h-4 w-4 mr-2" />
                        Tạm khóa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa tài khoản
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="fixed bottom-6 left-1/2 -translate-x-1/2 shadow-lg">
          <CardContent className="py-3 px-6">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">
                Đã chọn {selectedUsers.length} người dùng
              </p>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi email
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Phân quyền
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  Tạm khóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

### 5.2 Role-Based Access Control (RBAC)

```typescript
// Permission Matrix
const PERMISSIONS = {
  // User permissions
  'users.view': ['owner', 'admin'],
  'users.create': ['owner', 'admin'],
  'users.update': ['owner', 'admin'],
  'users.delete': ['owner'],
  
  // Workspace permissions
  'workspaces.view': ['owner', 'admin', 'editor', 'viewer'],
  'workspaces.create': ['owner', 'admin'],
  'workspaces.update': ['owner', 'admin'],
  'workspaces.delete': ['owner'],
  
  // Task permissions
  'tasks.view': ['owner', 'admin', 'editor', 'viewer'],
  'tasks.create': ['owner', 'admin', 'editor'],
  'tasks.update': ['owner', 'admin', 'editor'],
  'tasks.delete': ['owner', 'admin', 'editor'],
  
  // Analytics permissions
  'analytics.view': ['owner', 'admin'],
  
  // System permissions
  'system.config': ['owner'],
  'system.audit': ['owner', 'admin'],
  'system.billing': ['owner'],
} as const

// Permission check hook
function usePermission(permission: keyof typeof PERMISSIONS): boolean {
  const { user } = useAuth()
  const { currentWorkspace } = useStore()
  
  if (!user || !currentWorkspace) return false
  
  // Get user role in current workspace
  const member = currentWorkspace.members?.find(m => m.user_id === user.id)
  if (!member) return false
  
  // Check if role has permission
  return PERMISSIONS[permission]?.includes(member.role) || false
}

// Permission gate component
const PermissionGate: React.FC<{
  permission: keyof typeof PERMISSIONS
  children: React.ReactNode
  fallback?: React.ReactNode
}> = ({ permission, children, fallback = null }) => {
  const hasPermission = usePermission(permission)
  
  return hasPermission ? <>{children}</> : <>{fallback}</>
}

// Usage examples
const AdminPanel = () => {
  return (
    <div>
      <PermissionGate permission="users.view">
        <UserManagement />
      </PermissionGate>
      
      <PermissionGate 
        permission="analytics.view"
        fallback={<UpgradePrompt />}
      >
        <AnalyticsDashboard />
      </PermissionGate>
    </div>
  )
}
```

### 5.3 Analytics and Reporting

```typescript
// Admin Analytics Dashboard
const AdminAnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  
  const { metrics, isLoading } = useAdminMetrics(dateRange)
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Tổng quan về hoạt động và hiệu suất hệ thống"
      >
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </PageHeader>
      
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng người dùng"
          value={metrics?.total_users}
          change={metrics?.users_growth}
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Người dùng hoạt động"
          value={metrics?.active_users}
          change={metrics?.active_users_growth}
          icon={UserCheck}
          trend="up"
        />
        <MetricCard
          title="Tổng công việc"
          value={metrics?.total_tasks}
          change={metrics?.tasks_growth}
          icon={CheckSquare}
          trend="up"
        />
        <MetricCard
          title="Tỷ lệ hoàn thành"
          value={`${metrics?.completion_rate}%`}
          change={metrics?.completion_rate_change}
          icon={Target}
          trend={metrics?.completion_rate_change > 0 ? 'up' : 'down'}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={metrics?.user_growth_data}
              index="date"
              categories={['total_users', 'active_users']}
              colors={['blue', 'green']}
              valueFormatter={(value) => value.toLocaleString()}
              height="h-80"
            />
          </CardContent>
        </Card>
        
        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ công việc</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={metrics?.task_distribution}
              category="count"
              index="status"
              colors={['amber', 'blue', 'green', 'red']}
              valueFormatter={(value) => value.toLocaleString()}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Workspace Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace hoạt động nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={metrics?.workspace_activity}
            index="name"
            categories={['task_count', 'member_count', 'activity_count']}
            colors={['blue', 'green', 'purple']}
            layout="horizontal"
            height="h-96"
          />
        </CardContent>
      </Card>
      
      {/* User Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>DAU / MAU</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {((metrics?.dau / metrics?.mau) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Daily Active / Monthly Active Users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(metrics?.avg_session_duration)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Thời gian trung bình mỗi phiên
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate (D7)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics?.retention_d7}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Người dùng quay lại sau 7 ngày
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Metric Card Component
const MetricCard: React.FC<{
  title: string
  value: number | string
  change?: number
  icon: LucideIcon
  trend: 'up' | 'down'
}> = ({ title, value, change, icon: Icon, trend }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {change !== undefined && (
              <p className={cn(
                "text-xs mt-2 flex items-center gap-1",
                trend === 'up' ? "text-green-600" : "text-red-600"
              )}>
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(change)}% so với kỳ trước
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 5.4 Audit Logs

```typescript
// Audit Logs Table
const AuditLogsTable: React.FC = () => {
  const [filters, setFilters] = useState<AuditLogFilters>({
    user_id: null,
    action: null,
    entity_type: null,
    date_from: subDays(new Date(), 7),
    date_to: new Date()
  })
  
  const { logs, isLoading } = useAuditLogs(filters)
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Nhật ký hoạt động và thay đổi hệ thống"
      />
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filters.action || 'all'}
              onValueChange={(value) => setFilters({ ...filters, action: value === 'all' ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hành động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="moved">Moved</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.entity_type || 'all'}
              onValueChange={(value) => setFilters({ ...filters, entity_type: value === 'all' ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Loại entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="folder">Folder</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
            
            <DateRangePicker
              value={{ from: filters.date_from, to: filters.date_to }}
              onChange={(range) => setFilters({ ...filters, date_from: range.from, date_to: range.to })}
            />
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất CSV
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Logs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Hành động</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Chi tiết</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Xem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map(log => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">
                  {formatDateTime(log.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={log.user?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {log.user?.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{log.user?.full_name || 'System'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getActionVariant(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {log.entity_type}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                  {getActivityDescription(log)}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {log.ip_address || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewLogDetails(log)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

// Log Details Dialog
const AuditLogDetailsDialog: React.FC<{
  log: ActivityLog
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ log, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết Audit Log</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Thời gian</label>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(log.created_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Người dùng</label>
              <p className="text-sm text-muted-foreground">
                {log.user?.full_name} ({log.user?.email})
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Hành động</label>
              <p className="text-sm text-muted-foreground">{log.action}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Entity</label>
              <p className="text-sm text-muted-foreground">
                {log.entity_type} (ID: {log.entity_id})
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">IP Address</label>
              <p className="text-sm text-muted-foreground">{log.ip_address || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">User Agent</label>
              <p className="text-sm text-muted-foreground truncate">{log.user_agent || 'N/A'}</p>
            </div>
          </div>
          
          {log.changes && (
            <div>
              <label className="text-sm font-medium">Thay đổi</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Trước</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto max-h-64">
                      {JSON.stringify(log.changes.before, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Sau</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto max-h-64">
                      {JSON.stringify(log.changes.after, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 6. KIẾN TRÚC KỸ THUẬT

### 6.1 Database Schema (Hoàn chỉnh)

```sql
-- Additional Admin Tables

-- System Configuration
CREATE TABLE system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature Flags
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_users UUID[],
  target_workspaces UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing Plans
CREATE TABLE billing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_monthly DECIMAL(10,2),
  price_annual DECIMAL(10,2),
  features JSONB NOT NULL,
  limits JSONB NOT NULL, -- {max_users, max_workspaces, max_storage_gb}
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace Subscriptions
CREATE TABLE workspace_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES billing_plans(id),
  status TEXT CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Metrics (for billing)
CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'storage', 'api_calls', 'active_users'
  value BIGINT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(workspace_id, metric_type, date)
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  entity_type TEXT,
  entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_feature_flags_enabled ON feature_flags(enabled) WHERE enabled = TRUE;
CREATE INDEX idx_usage_metrics_workspace_date ON usage_metrics(workspace_id, date DESC);
```

### 6.2 API Design Patterns

```typescript
// API Route Structure
const API_ROUTES = {
  // User Dashboard APIs
  user: {
    workspaces: '/api/workspaces',
    