import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export default function Layout() {
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
        </NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
