import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useStore } from '@/store/useStore'

export default function AppLayout() {
  const { sidebarOpen } = useStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

