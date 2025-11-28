const Dashboard = ({ employees, allTasks }) => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <p>Monitor your team performance and manage employee workloads efficiently.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{employees.length}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
              <path d="M9 7V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{employees.reduce((sum, emp) => sum + emp.tasks, 0)}</h3>
            <p>Active Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>7</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
        <div className="stat-card overloaded">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{employees.filter(emp => emp.availability === 'Overloaded').length}</h3>
            <p>Overloaded Employees</p>
          </div>
        </div>
        <div className="stat-card available">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{employees.filter(emp => emp.availability === 'Available').length}</h3>
            <p>Available Employees</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h3>Team Performance Overview</h3>
          <div className="performance-list">
            {employees.map((employee) => (
              <div key={employee.id} className="performance-item">
                <div className="employee-info">
                  <div className="employee-avatar">{employee.name.charAt(0)}</div>
                  <div>
                    <span className="employee-name">{employee.name}</span>
                    <span className="employee-role">{employee.role}</span>
                  </div>
                </div>
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-value">{employee.performance}%</span>
                    <span className="metric-label">Performance</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{employee.tasks}</span>
                    <span className="metric-label">Tasks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h3>Recent Activity - Pending Tasks</h3>
          <div className="activity-list">
            {allTasks && allTasks.filter(task => task.status === 'Pending').map((task, index) => (
              <div key={task.id} className="activity-item">
                <span className="activity-time">Pending</span>
                <span className="activity-text">
                  <strong>{task.title}</strong> assigned to {task.person || 'Unassigned'}
                </span>
              </div>
            ))}
            {(!allTasks || allTasks.filter(task => task.status === 'Pending').length === 0) && (
              <div className="activity-item">
                <span className="activity-time">-</span>
                <span className="activity-text">No pending tasks</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard