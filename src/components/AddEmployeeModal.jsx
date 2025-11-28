const AddEmployeeModal = ({ showAddModal, setShowAddModal, newEmployee, setNewEmployee, handleAddEmployee }) => {
  if (!showAddModal) return null

  return (
    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Employee</h3>
          <button className="close-btn" onClick={() => setShowAddModal(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleAddEmployee} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Role / Designation</label>
              <select 
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                required
              >
                <option value="">Select Role</option>
                <option>Senior Developer</option>
                <option>UI/UX Designer</option>
                <option>Project Manager</option>
                <option>Marketing Specialist</option>
                <option>DevOps Engineer</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select 
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                required
              >
                <option value="">Select Department</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Operations</option>
              </select>
            </div>
            <div className="form-group">
              <label>Joining Date</label>
              <input 
                type="date" 
                value={newEmployee.joiningDate}
                onChange={(e) => setNewEmployee({...newEmployee, joiningDate: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Workload Capacity (tasks per week)</label>
            <input 
              type="number" 
              value={newEmployee.capacity}
              onChange={(e) => setNewEmployee({...newEmployee, capacity: e.target.value})}
              min="1" max="20"
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployeeModal