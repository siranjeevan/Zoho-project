import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Chat from './components/Chat'
import Dashboard from './components/Dashboard'
import Employees from './components/Employees'
import AddEmployeeModal from './components/AddEmployeeModal'
import DeleteModal from './components/DeleteModal'
import EmployeeProfile from './components/EmployeeProfile'
import { useTasks } from './hooks/useTasks'

function App() {
  const { allTasks, pendingTasksCount, getEmployeeTaskCount, calculatePerformance, getEmployeeStatus, loading: tasksLoading } = useTasks()

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const getEmployeePendingTasks = (employeeName) => {
    if (!allTasks || allTasks.length === 0) return 0
    return getEmployeeTaskCount(employeeName, allTasks)
  }

  const defaultEmployees = [
    { id: 1, name: 'Alex Thompson', email: 'alex.thompson@company.com', role: 'Senior Developer', department: 'Engineering', tasks: 0, availability: 'Available', performance: 92, skills: ['React', 'Node.js'] },
    { id: 2, name: 'Jessica Park', email: 'jessica.park@company.com', role: 'UI/UX Designer', department: 'Design', tasks: 0, availability: 'Available', performance: 88, skills: ['Figma', 'Photoshop'] },
    { id: 3, name: 'Ryan Miller', email: 'ryan.miller@company.com', role: 'Project Manager', department: 'Operations', tasks: 0, availability: 'Available', performance: 85, skills: ['Agile', 'Scrum'] },
    { id: 4, name: 'Lisa Wang', email: 'lisa.wang@company.com', role: 'Marketing Specialist', department: 'Marketing', tasks: 0, availability: 'Available', performance: 90, skills: ['SEO', 'Content'] },
    { id: 5, name: 'David Chen', email: 'david.chen@company.com', role: 'DevOps Engineer', department: 'Engineering', tasks: 0, availability: 'Available', performance: 94, skills: ['AWS', 'Docker'] }
  ]
  
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees')
    if (saved) {
      const savedEmployees = JSON.parse(saved)
      // Update task counts with current pending tasks
      return savedEmployees.map(emp => ({
        ...emp,
        tasks: getEmployeePendingTasks(emp.name)
      }))
    }
    return defaultEmployees
  })
  const [newEmployee, setNewEmployee] = useState({
    name: '', email: '', phone: '', role: '', department: '', skills: [], joiningDate: '', capacity: ''
  })

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    if (!tasksLoading) {
      setEmployees(prev => prev.map(emp => {
        const pendingTasks = getEmployeePendingTasks(emp.name)
        const performance = allTasks.length > 0 ? calculatePerformance(emp.name, allTasks) : emp.performance
        const availability = allTasks.length > 0 ? getEmployeeStatus(emp.name, allTasks) : emp.availability
        
        return {
          ...emp,
          tasks: pendingTasks,
          performance: performance,
          availability: availability
        }
      }))
    }
  }, [tasksLoading, allTasks])

  const handleAddEmployee = (e) => {
    e.preventDefault()
    const newEmp = {
      id: Math.max(...employees.map(emp => emp.id), 0) + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      tasks: 0,
      availability: 'Available',
      performance: 85,
      skills: newEmployee.skills || []
    }
    setEmployees([...employees, newEmp])
    setShowAddModal(false)
    setNewEmployee({ name: '', email: '', phone: '', role: '', department: '', skills: [], joiningDate: '', capacity: '' })
  }

  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id))
    setShowDeleteModal(false)
    setEmployeeToDelete(null)
  }

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
  }



  return (
    <Router>
      <div className="app">
        <Sidebar />
        
        <div className="main-content">
          <TopBar />
          
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/chat" element={<Chat employees={employees} setEmployees={setEmployees} />} />
              <Route path="/dashboard" element={<Dashboard employees={employees} allTasks={allTasks} />} />
              <Route path="/employees" element={
                <Employees 
                  employees={employees} 
                  setShowAddModal={setShowAddModal}
                  handleDeleteEmployee={handleDeleteEmployee}
                  handleViewEmployee={handleViewEmployee}
                />
              } />
              <Route path="/employees/:id" element={
                selectedEmployee ? (
                  <EmployeeProfile 
                    employee={selectedEmployee} 
                    setSelectedEmployee={setSelectedEmployee}
                    employees={employees}
                    setEmployees={setEmployees}
                  />
                ) : <Navigate to="/employees" replace />
              } />
              <Route path="/tasks" element={
                <div className="coming-soon">
                  <h2>Task Assignment</h2>
                  <p>This section is under development</p>
                </div>
              } />
            </Routes>
            
            <AddEmployeeModal 
              showAddModal={showAddModal}
              setShowAddModal={setShowAddModal}
              newEmployee={newEmployee}
              setNewEmployee={setNewEmployee}
              handleAddEmployee={handleAddEmployee}
            />
            
            <DeleteModal 
              showDeleteModal={showDeleteModal}
              setShowDeleteModal={setShowDeleteModal}
              employeeToDelete={employeeToDelete}
              confirmDelete={confirmDelete}
            />
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App