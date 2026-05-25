import { NavLink, Outlet } from 'react-router-dom'
import { useTodos } from '../context'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export default function Layout() {
  const { todos } = useTodos()
  const completedCount = todos.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex gap-2">
        <NavLink to="/" end data-testid="nav-dashboard" className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/calendar" data-testid="nav-calendar" className={navLinkClass}>
          Calendar
        </NavLink>
        <NavLink to="/completed" data-testid="nav-completed" className={navLinkClass}>
          Completed
          {completedCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
              {completedCount}
            </span>
          )}
        </NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
