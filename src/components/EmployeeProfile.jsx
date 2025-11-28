import { useState, useEffect } from 'react'
import { fetchTasks } from '../services/taskService'

const EmployeeProfile = ({ employee, setSelectedEmployee, employees, setEmployees }) => {
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({
    name: employee.name,
    email: employee.email,
    role: employee.role,
    department: employee.department,
    performance: employee.performance
  })
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await fetchTasks()
      const employeeTasks = allTasks.filter(task => {
        const taskPerson = task.person || ''
        return taskPerson.toLowerCase().includes(employee.name.toLowerCase()) ||
               employee.name.toLowerCase().includes(taskPerson.toLowerCase())
      })
      setTasks(employeeTasks)
      setLoading(false)
    }
    loadTasks()
  }, [employee.name])

  const handleSave = () => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employee.id ? { ...emp, ...editData } : emp
    ))
    setEditMode(false)
  }



  return (
    <div className="employee-profile">
      <div className="profile-header">
        <button className="back-btn" onClick={() => setSelectedEmployee(null)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back
        </button>
        <div className="profile-info">
          <div className="profile-avatar large">{employee.name.charAt(0)}</div>
          <div>
            <h2>{editMode ? (
              <input 
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="edit-input"
              />
            ) : employee.name}</h2>
            <p>{editMode ? (
              <select 
                value={editData.role}
                onChange={(e) => setEditData({...editData, role: e.target.value})}
                className="edit-select"
              >
                <option>Senior Developer</option>
                <option>UI/UX Designer</option>
                <option>Project Manager</option>
                <option>Marketing Specialist</option>
                <option>DevOps Engineer</option>
              </select>
            ) : employee.role} • {editMode ? (
              <select 
                value={editData.department}
                onChange={(e) => setEditData({...editData, department: e.target.value})}
                className="edit-select"
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            ) : employee.department}</p>
          </div>
        </div>
        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-toggle-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              {editMode ? (
                <input 
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="edit-input"
                />
              ) : (
                <span>{employee.email}</span>
              )}
            </div>
            <div className="info-item">
              <label>Performance Score</label>
              {editMode ? (
                <input 
                  type="number"
                  value={editData.performance}
                  onChange={(e) => setEditData({...editData, performance: parseInt(e.target.value)})}
                  className="edit-input"
                  min="0" max="100"
                />
              ) : (
                <span>{employee.performance}%</span>
              )}
            </div>
            <div className="info-item">
              <label>Pending Tasks</label>
              <span>{employee.tasks} pending tasks</span>
            </div>
            <div className="info-item">
              <label>Completed Tasks</label>
              <span>{tasks.filter(t => t.status === 'Completed').length} completed</span>
            </div>
            <div className="info-item">
              <label>Availability</label>
              <span className={`status-badge ${employee.availability.toLowerCase()}`}>
                {employee.availability}
              </span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Assigned Tasks ({tasks.length})</h3>
          {loading ? (
            <div className="loading-tasks">Loading tasks from database...</div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-header">
                    <span className="task-title">{task.title}</span>
                    <span className={`task-priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="task-details">
                    <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                    <span className="task-deadline">Due: {task.deadline}</span>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="no-tasks">No tasks assigned yet</div>
              )}
            </div>
          )}
        </div>
        
        <div className="profile-section">
          <h3>Skills & Expertise</h3>
          <div className="skills-grid">
            {employee.skills.map((skill, index) => (
              <span key={index} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile