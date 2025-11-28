import emailjs from '@emailjs/browser'

export async function sendEmail({ to, subject, body }) {
  try {
    const templateParams = {
      name: 'Employee Management System',
      time: new Date().toLocaleString(),
      message: body
    }

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_v5o6u02',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_egam742', 
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )

    return {
      success: true,
      message: `✅ Email sent successfully to ${to || 'siranjeevan20@gmail.com'}`,
      details: { to: to || 'siranjeevan20@gmail.com', subject, body }
    }
  } catch (error) {
    console.error('Email error:', error)
    return {
      success: false,
      message: `❌ Failed to send email: ${error.text || error.message}`,
      error: error.message
    }
  }
}