import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Zoho Smart Client</h2>
        <p>Schedule Manager</p>
      </div>
      
      <nav className="nav-menu">
        <Link to="/chat" className={location.pathname === '/chat' ? 'nav-item active' : 'nav-item'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          AI Assistant
        </Link>
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-item active' : 'nav-item'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Dashboard
        </Link>
        <Link to="/employees" className={location.pathname === '/employees' ? 'nav-item active' : 'nav-item'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Employees
        </Link>
        <Link to="/tasks" className={location.pathname === '/tasks' ? 'nav-item active' : 'nav-item'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
            <path d="M9 7V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
          </svg>
          Task Assignment
        </Link>
      </nav>
    </div>
  )
}

export default Sidebar