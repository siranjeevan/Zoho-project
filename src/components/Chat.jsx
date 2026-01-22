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
  const [isInIframe, setIsInIframe] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Detect if running in iframe (Zoho Cliq)
    setIsInIframe(window.self !== window.top)

    const savedHistory = localStorage.getItem('chatHistory')
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    } else {
      const welcomeMessage = window.self !== window.top
        ? 'Hello! I\'m your Smart Manager AI assistant. How can I help you today?'
        : 'Hello! I\'m your AI assistant for employee management. I can help you assign tasks, check employee workloads, and manage your team efficiently. How can I assist you today?'
      setChatHistory([{ type: 'ai', message: welcomeMessage }])
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

      const isGreeting = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'].some(greeting =>
        userMessage.toLowerCase().trim() === greeting
      )

      let prompt
      if (isGreeting) {
        const greetingResponses = [
          '🚀 Welcome to Smart Manager\'s AI-powered workforce optimization! I\'m here to revolutionize your team management experience.',
          '⚡ Greetings! Your intelligent employee management assistant is ready to maximize productivity and streamline operations.',
          '🎯 Hello! Let\'s unlock your team\'s full potential with data-driven insights and smart task allocation.',
          '💼 Welcome! I\'m your advanced AI consultant for strategic workforce management and performance optimization.'
        ]
        const randomResponse = greetingResponses[Math.floor(Math.random() * greetingResponses.length)]
        setChatHistory(prev => prev.slice(0, -1).concat({ type: 'ai', message: randomResponse }))
        return
      } else if (isTaskAssignment) {
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
        prompt = `${context}\n\nConversation history:\n${conversationHistory}\n\nUser: ${userMessage}\n\nGive a short, direct answer. Use simple sentences. Be brief and to the point. Don't explain too much. If appropriate, also provide 1-2 helpful suggestions or recommendations.`
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
    const container = messagesEndRef.current?.parentElement
    if (container) {
      container.scrollTop = container.scrollHeight
    }
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
    <div className="ai-chat-wrapper">
      <div className="ai-chat-header">
        <div className="ai-header-content">
          <div className="ai-avatar-large">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="ai-header-text">
            <h1>Smart Manager AI</h1>
            <p>Intelligent Employee & Task Management</p>
          </div>
        </div>
        <button className="clear-chat-btn" onClick={() => {
          localStorage.removeItem('chatHistory')
          setChatHistory([{ type: 'ai', message: 'Hello! I\'m your AI assistant for employee management. How can I assist you today?' }])
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
          </svg>
          Clear
        </button>
      </div>

      <div className="ai-chat-body">
        <div className="ai-messages-container">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.type}`}>
              <div className="ai-message-avatar">
                {msg.type === 'ai' ? (
                  <div className="ai-bot-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                ) : (
                  <div className="ai-user-avatar">You</div>
                )}
              </div>
              <div className="ai-message-bubble" dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}></div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-input-section">
          <form className="ai-input-form" onSubmit={handleChatSubmit}>
            <div className="ai-input-wrapper">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message here..."
                className="ai-input-field"
              />
              <button type="submit" className="ai-send-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22,2 15,22 11,13 2,9 22,2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat