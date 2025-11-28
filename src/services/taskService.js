const SHEET_API_URL = 'https://api.sheetapi.rest/api/v1/sheets/yz962vnf0i5l2ckhfvf013cz'

export async function fetchTasks() {
  try {
    const response = await fetch(SHEET_API_URL)
    const data = await response.json()
    
    return data.map((item, index) => ({
      id: index + 1,
      title: item['Task '] || item.Task,
      status: item.Status === 'TRUE' ? 'Completed' : 'Pending',
      person: item.Person || '',
      priority: 'Medium',
      deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

export function getEmployeeTaskCount(employeeName, allTasks) {
  if (!allTasks || !employeeName) return 0
  
  return allTasks.filter(task => {
    const taskPerson = task.person || ''
    const isAssigned = taskPerson.toLowerCase().includes(employeeName.toLowerCase()) ||
                      employeeName.toLowerCase().includes(taskPerson.toLowerCase())
    return isAssigned && task.status === 'Pending'
  }).length
}

export function getEmployeeCompletedTasks(employeeName, allTasks) {
  if (!allTasks || !employeeName) return 0
  
  return allTasks.filter(task => {
    const taskPerson = task.person || ''
    const isAssigned = taskPerson.toLowerCase().includes(employeeName.toLowerCase()) ||
                      employeeName.toLowerCase().includes(taskPerson.toLowerCase())
    return isAssigned && task.status === 'Completed'
  }).length
}

export function calculatePerformance(employeeName, allTasks) {
  const completedTasks = getEmployeeCompletedTasks(employeeName, allTasks)
  const pendingTasks = getEmployeeTaskCount(employeeName, allTasks)
  const totalTasks = completedTasks + pendingTasks
  
  // Debug logging
  console.log(`${employeeName}: Completed=${completedTasks}, Pending=${pendingTasks}, Total=${totalTasks}`)
  
  if (totalTasks === 0) {
    // No tasks assigned - return 0% performance
    return 0
  }
  
  // Has tasks assigned - calculate based on completion rate
  const completionRate = (completedTasks / totalTasks) * 100
  return Math.round(completionRate)
}

export function getEmployeeStatus(employeeName, allTasks) {
  const pendingTasks = getEmployeeTaskCount(employeeName, allTasks)
  const completedTasks = getEmployeeCompletedTasks(employeeName, allTasks)
  const totalTasks = completedTasks + pendingTasks
  
  // If no tasks assigned at all
  if (totalTasks === 0) return 'Available'
  
  // Status based on pending task load
  if (pendingTasks >= 5) return 'Overloaded'
  if (pendingTasks >= 3) return 'Busy'
  if (pendingTasks >= 1) return 'Busy'
  
  // All tasks completed (0 pending tasks but has completed tasks)
  if (pendingTasks === 0 && completedTasks > 0) return 'Available'
  
  return 'Available'
}