import { useState, useEffect } from 'react'
import { fetchTasks, getEmployeeTaskCount, calculatePerformance, getEmployeeStatus } from '../services/taskService'

export function useTasks() {
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await fetchTasks()
      setAllTasks(tasks)
      setLoading(false)
    }
    loadTasks()
  }, [])

  const pendingTasksCount = allTasks.filter(task => task.status === 'Pending').length

  return { allTasks, pendingTasksCount, loading, getEmployeeTaskCount, calculatePerformance, getEmployeeStatus }
}