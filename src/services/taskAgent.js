import { getWorkingModel } from './aiService'
import { sendEmail } from './emailService'
import { createTask } from './taskService'

export async function createAndAssignTask(taskDescription, employees, setEmployees) {
  try {
    const model = await getWorkingModel()
    
    const context = `Employees: ${JSON.stringify(employees.map(emp => ({
      name: emp.name,
      role: emp.role,
      skills: emp.skills,
      tasks: emp.tasks,
      availability: emp.availability,
      performance: emp.performance
    })))}`
    
    const prompt = `${context}

Task to create: ${taskDescription}

Analyze and return ONLY the best employee name who should get this task based on skills and availability.`
    
    const result = await model.generateContent(prompt)
    const assignedEmployee = result.response.text().trim()
    
    // Find employee and update their tasks
    const employee = employees.find(emp => 
      assignedEmployee.toLowerCase().includes(emp.name.toLowerCase())
    )
    
    if (employee) {
      // Store task in Google Sheets
      await createTask(taskDescription, employee.name)
      
      setEmployees(prev => prev.map(emp => 
        emp.id === employee.id 
          ? { 
              ...emp, 
              tasks: emp.tasks + 1,
              availability: emp.tasks >= 10 ? 'Overloaded' : emp.tasks >= 7 ? 'Busy' : 'Available'
            }
          : emp
      ))
      
      return `✅ **Task Created & Assigned**\n\n**Task:** ${taskDescription}\n**Assigned to:** ${employee.name}\n**New task count:** ${employee.tasks + 1}\n\n📧 **Send email notification?** Type 'yes' to send email to siranjeevan20@gmail.com`
    }
    
    return "❌ Could not assign task - no suitable employee found"
    
  } catch (error) {
    return "❌ Error creating task"
  }
}