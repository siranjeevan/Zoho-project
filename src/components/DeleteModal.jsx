const DeleteModal = ({ showDeleteModal, setShowDeleteModal, employeeToDelete, confirmDelete }) => {
  if (!showDeleteModal) return null

  return (
    <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h3>Remove Employee</h3>
        <p>Are you sure you want to remove <strong>{employeeToDelete?.name}</strong> from the system?</p>
        <div className="delete-actions">
          <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="delete-btn" onClick={confirmDelete}>Remove Employee</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal