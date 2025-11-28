import { sendEmail } from './emailService'

export async function sendTaskEmail(taskDescription, employee, employees) {
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
  
  try {
    await sendEmail({
      to: 'siranjeevan20@gmail.com',
      subject: `Task Assignment: ${taskDescription}`,
      body: emailBody
    })
    return '✅ Email sent successfully!'
  } catch (error) {
    return '❌ Failed to send email'
  }
}