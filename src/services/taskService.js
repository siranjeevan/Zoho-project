const SHEET_API_URL = 'https://api.sheetapi.rest/api/v1/sheets/yz962vnf0i5l2ckhfvf013cz'
const FALLBACK_API_URL = 'https://sheetdb.io/api/v1/vfw6opo9eet4z'
//https://api.sheetapi.rest/api/v1/sheets/yz962vnf0i5l2ckhfvf013cz

export async function fetchTasks() {
  // Try primary API first
  try {
    const response = await fetch(SHEET_API_URL)
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          id: index + 1,
          title: item['Task '] || item.Task,
          status: item.Status === 'TRUE' ? 'Completed' : 'Pending',
          person: item.Person || '',
          priority: 'Medium',
          deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }))
      }
    }
  } catch (error) {
    console.warn('Primary API failed:', error.message)
  }
  
  // Try fallback API
  try {
    console.log('🔄 Fallback API is being called - Primary API failed')
    const response = await fetch(FALLBACK_API_URL)
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          id: index + 1,
          title: item['Task '] || item.Task,
          status: item.Status === 'TRUE' ? 'Completed' : 'Pending',
          person: item.Person || '',
          priority: 'Medium',
          deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }))
      }
    }
  } catch (error) {
    console.error('Fallback API failed:', error.message)
  }
  
  // Return empty array if both fail
  return []
}

export async function createTask(taskTitle, assignedPerson) {
  const taskData = {
    'Status': 'FALSE',
    'Task': taskTitle,
    'Person': assignedPerson
  }
  
  console.log('📝 Creating task:', taskData)
  
  try {
    const response = await fetch(SHEET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    })
    
    console.log('📡 Response status:', response.status)
    const responseText = await response.text()
    console.log('📡 Response body:', responseText)
    
    if (response.ok) {
      console.log('✅ Task created successfully in Google Sheets')
      return true
    } else {
      console.error('❌ API Error:', response.status, responseText)
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
  
  return false
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