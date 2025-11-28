import { useNavigate } from 'react-router-dom'

const Employees = ({ employees, setShowAddModal, handleDeleteEmployee, handleViewEmployee }) => {
  const navigate = useNavigate()
  return (
    <div className="employees-section">
      <div className="section-header">
        <h2>Employee Management</h2>
        <button className="add-employee-btn" onClick={() => setShowAddModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Employee
        </button>
      </div>
      
      <div className="employee-table">
        <div className="table-header">
          <div className="th">Employee</div>
          <div className="th">Role</div>
          <div className="th">Department</div>
          <div className="th">Task Load</div>
          <div className="th">Status</div>
          <div className="th">Performance</div>
          <div className="th">Actions</div>
        </div>
        
        {employees.map(employee => (
          <div key={employee.id} className="table-row">
            <div className="td employee-cell">
              <div className="employee-avatar">{employee.name.charAt(0)}</div>
              <div className="employee-details">
                <span className="employee-name">{employee.name}</span>
                <span className="employee-email">{employee.email}</span>
              </div>
            </div>
            <div className="td">{employee.role}</div>
            <div className="td">{employee.department}</div>
            <div className="td">
              <span className="task-count">{employee.tasks} pending tasks</span>
            </div>
            <div className="td">
              <span className={`status-badge ${employee.availability.toLowerCase()}`}>
                {employee.availability}
              </span>
            </div>
            <div className="td">
              <div className="performance-score">
                <span>{employee.performance}%</span>
                <div className="performance-bar">
                  <div className="performance-fill" style={{width: `${employee.performance}%`}}></div>
                </div>
              </div>
            </div>
            <div className="td actions">
              <button className="action-btn edit" onClick={() => handleViewEmployee(employee)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button className="action-btn view" onClick={() => {
                handleViewEmployee(employee)
                navigate(`/employees/${employee.id}`)
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button className="action-btn remove" onClick={() => handleDeleteEmployee(employee)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Employees