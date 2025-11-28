import { useState, useEffect, useRef } from 'react'
import { getWorkingModel, MODEL_CANDIDATES } from '../services/aiService'
import { createAndAssignTask } from '../services/taskAgent'
import { sendEmail } from '../services/emailService'

const Chat = ({ employees, setEmployees }) => {
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingTask, setPendingTask] = useState(null)
  const [pendingEmail, setPendingEmail] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory')
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    } else {
      setChatHistory([{ type: 'ai', message: 'Hello! I\'m your AI assistant for employee management. I can help you assign tasks, check employee workloads, and manage your team efficiently. How can I assist you today?' }])
    }
  }, [])

  useEffect(() => {
    const initModel = async () => {
      try {
        const workingModel = await getWorkingModel(MODEL_CANDIDATES)
        setModel(workingModel)
        setLoading(false)
      } catch (e) {
        setError(e.message)
        setLoading(false)
      }
    }
    initModel()
  }, [])

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
    }
  }, [chatHistory])

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatMessage.trim() || !model) return
    
    const userMessage = chatMessage
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }])
    setChatMessage('')
    
    // Check if user is confirming a pending task
    const isConfirmation = ['yes', 'ok', 'confirm', 'do it', 'proceed', 'y'].some(word => 
      userMessage.toLowerCase().trim() === word
    )
    
    if (isConfirmation && pendingTask) {
      setChatHistory(prev => [...prev, { type: 'ai', message: 'Creating and assigning task...', isTyping: true }])
      
      const result = await createAndAssignTask(pendingTask, employees, setEmployees)
      setChatHistory(prev => prev.slice(0, -1).concat({ type: 'ai', message: result }))
      setPendingTask(null)
      return
    }
    
    if (isConfirmation && pendingEmail) {
      setChatHistory(prev => [...prev, { type: 'ai', message: 'Sending email...', isTyping: true }])
      
      const result = await sendEmail(pendingEmail)
      setChatHistory(prev => prev.slice(0, -1).concat({ type: 'ai', message: result.message }))
      setPendingEmail(null)
      return
    }
    
    setChatHistory(prev => [...prev, { type: 'ai', message: 'Thinking...', isTyping: true }])
    
    try {
      const context = `You are an AI assistant for employee management. Current employees: ${JSON.stringify(employees.map(emp => ({
        name: emp.name,
        role: emp.role,
        department: emp.department,
        tasks: emp.tasks,
        availability: emp.availability,
        performance: emp.performance
      })))}`
      
      const conversationHistory = chatHistory.slice(-6).map(msg => `${msg.type}: ${msg.message}`).join('\n')
      
      const isTaskAssignment = userMessage.toLowerCase().includes('create') || userMessage.toLowerCase().includes('build') || userMessage.toLowerCase().includes('develop') || userMessage.toLowerCase().includes('task') || userMessage.toLowerCase().includes('assign')
      
      const isEmailRequest = userMessage.toLowerCase().includes('send email') || userMessage.toLowerCase().includes('send mail') || userMessage.toLowerCase().includes('email') && (userMessage.toLowerCase().includes('send') || userMessage.toLowerCase().includes('mail'))
      
      let prompt
      if (isTaskAssignment) {
        setPendingTask(userMessage)
        prompt = `${context}\n\nTask request: "${userMessage}"\n\nYou must respond in this EXACT format:\n\n**Task:** [clear task name]\n**Skills Needed:** [list required skills]\n**Best Match:** [employee name] ([role]) - [reason based on skills and availability]\n\nShould I create and assign this task? Reply 'yes' to confirm.`
      } else if (isEmailRequest) {
        const emailData = extractEmailData(userMessage)
        if (emailData.to && emailData.subject && emailData.body) {
          setPendingEmail(emailData)
          prompt = `Email request: "${userMessage}"\n\nEmail details:\n**To:** ${emailData.to}\n**Subject:** ${emailData.subject}\n**Body:** ${emailData.body}\n\nShould I send this email? Reply 'yes' to confirm.`
        } else {
          prompt = `Email request: "${userMessage}"\n\nI need more details. Please provide:\n- Recipient email address\n- Subject (if not provided, I'll generate one)\n- Message content`
        }
      } else {
        prompt = `${context}\n\nUser: ${userMessage}\n\nGive a short, helpful response about the team. Be direct and simple.`
      }
      
      const result = await model.generateContent(prompt)
      const aiResponse = result.response.text()
      
      // Check if AI assigned a task and update employee data
      if (isTaskAssignment && aiResponse.toLowerCase().includes('assigned to')) {
        const assignedEmployeeName = extractAssignedEmployee(aiResponse)
        if (assignedEmployeeName) {
          updateEmployeeTaskCount(assignedEmployeeName)
        }
      }
      
      setChatHistory(prev => prev.slice(0, -1).concat({ type: 'ai', message: aiResponse }))
    } catch (error) {
      setChatHistory(prev => prev.slice(0, -1).concat({ 
        type: 'ai', 
        message: 'Sorry, I encountered an error. Please try again.' 
      }))
    }
  }

  const extractAssignedEmployee = (response) => {
    const employees = ['Alex Thompson', 'Jessica Park', 'Ryan Miller', 'Lisa Wang', 'David Chen']
    return employees.find(name => response.includes(name))
  }

  const updateEmployeeTaskCount = (employeeName) => {
    setEmployees(prev => prev.map(emp => 
      emp.name === employeeName 
        ? { ...emp, tasks: emp.tasks + 1, availability: emp.tasks >= 10 ? 'Overloaded' : emp.tasks >= 7 ? 'Busy' : 'Available' }
        : emp
    ))
  }

  const extractEmailData = (message) => {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    const emailMatch = message.match(emailRegex)
    
    let to = emailMatch ? emailMatch[1] : 'siranjeevan20@gmail.com' // Default test email
    let subject = ''
    let body = ''
    
    // Extract subject and body from common patterns
    if (message.toLowerCase().includes('late')) {
      subject = 'Late arrival notification'
      body = 'I will be late today due to unforeseen circumstances. Sorry for the inconvenience.'
    } else if (message.toLowerCase().includes('meeting')) {
      subject = 'Meeting update'
      body = message
    } else {
      subject = 'Message from employee management system'
      body = message
    }
    
    return { to, subject, body }
  }

  const formatMessage = (message) => {
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*?)$/gm, '<li>$1</li>')
      .replace(/^(\d+\.)\s(.*?)$/gm, '<div class="numbered-item">$1 $2</div>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n/g, '<br>')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h1>AI Assistant</h1>
          <p>Initializing AI model...</p>
        </div>
        <div className="chat-loading">
          <div className="loading-spinner"></div>
          <p>Setting up your AI assistant</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h1>AI Assistant</h1>
          <p>Unable to connect to AI service</p>
        </div>
        <div className="chat-error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Assistant</h1>
        <p>Get intelligent help with employee management and task assignments</p>
        <button className="clear-chat-btn" onClick={() => {
          localStorage.removeItem('chatHistory')
          setChatHistory([{ type: 'ai', message: 'Hello! I\'m your AI assistant for employee management. How can I assist you today?' }])
        }}>
          Clear Chat
        </button>
      </div>
      
      <div className="chat-messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-avatar">
              {msg.type === 'ai' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                </svg>
              ) : 'You'}
            </div>
            <div className="message-content" dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}></div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleChatSubmit}>
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Ask about employees, tasks, or team management..."
        />
        <button type="submit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22,2 15,22 11,13 2,9 22,2"/>
          </svg>
        </button>
      </form>
    </div>
  )
}

export default Chat