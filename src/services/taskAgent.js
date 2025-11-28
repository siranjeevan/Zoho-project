import { getWorkingModel } from './aiService'

import { sendEmail } from './emailService'

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
      setEmployees(prev => prev.map(emp => 
        emp.id === employee.id 
          ? { 
              ...emp, 
              tasks: emp.tasks + 1,
              availability: emp.tasks >= 10 ? 'Overloaded' : emp.tasks >= 7 ? 'Busy' : 'Available'
            }
          : emp
      ))
      
      // Send task assignment email
      const emailBody = `🎯 NEW TASK ASSIGNMENT

📋 Task: ${taskDescription}
👤 Assigned to: ${employee.name}
🏢 Role: ${employee.role}
📊 Current Tasks: ${employee.tasks + 1}
⚡ Status: ${employee.tasks >= 10 ? 'Overloaded' : employee.tasks >= 7 ? 'Busy' : 'Available'}

📈 PROJECT OVERVIEW:
Zoho Smart Client & Schedule Manager - Employee Management System

🎯 Project Goals:
• Intelligent task assignment based on skills and workload
• Real-time employee performance monitoring
• Automated workflow management
• Team productivity optimization

💼 System Features:
• AI-powered task distribution
• Employee availability tracking
• Performance analytics dashboard
• Automated email notifications

📊 Current Team Status:
${employees.map(emp => `• ${emp.name} (${emp.role}): ${emp.tasks} tasks - ${emp.availability}`).join('\n')}

⏰ Assignment Time: ${new Date().toLocaleString()}

Please acknowledge receipt and begin work on this task.`
      
      await sendEmail({
        to: 'siranjeevan20@gmail.com',
        subject: `Task Assignment: ${taskDescription}`,
        body: emailBody
      })
      
      return `✅ **Task Created & Assigned**\n\n**Task:** ${taskDescription}\n**Assigned to:** ${employee.name}\n**New task count:** ${employee.tasks + 1}\n📧 **Email sent to siranjeevan20@gmail.com**`
    }
    
    return "❌ Could not assign task - no suitable employee found"
    
  } catch (error) {
    return "❌ Error creating task"
  }
}