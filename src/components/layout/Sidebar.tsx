import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ListTodo, Calendar, Settings, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, currentWorkspace, setCurrentWorkspace } = useStore()
  const { workspaces } = useWorkspaces()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kanban', href: '/kanban', icon: ListTodo },
    { name: 'List View', href: '/tasks', icon: ListTodo },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  if (!sidebarOpen) return null

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r overflow-y-auto hidden md:block">
      <div className="p-4 space-y-6">
        {/* Workspace Selector */}
        <div data-tour="workspace-selector" tabIndex={-1} aria-label="Workspace selector">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Workspace
          </h3>
          {workspaces && workspaces.length > 0 ? (
            <div className="space-y-1">
              {workspaces.map((workspace) => (
                <Button
                  key={workspace.id}
                  variant={currentWorkspace?.id === workspace.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setCurrentWorkspace(workspace)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {workspace.name}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-2">No workspaces yet</p>
          )}
        </div>

        {/* Navigation */}
        {currentWorkspace && (
          <nav
            className="space-y-1"
            data-tour="navigation"
            tabIndex={-1}
            aria-label="Workspace navigation"
          >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Navigation
            </h3>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </aside>
  )
}

