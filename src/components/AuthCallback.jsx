import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle OAuth callback from Zoho Cliq
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    if (code) {
      // Store auth code and redirect to chat
      localStorage.setItem('zoho_auth_code', code)
      if (state) {
        localStorage.setItem('zoho_auth_state', state)
      }
      
      // Redirect to chat after successful auth
      navigate('/chat')
    } else {
      // If no code, redirect to chat anyway
      navigate('/chat')
    }
  }, [navigate])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Authenticating...</h2>
        <p>Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}

export default AuthCallback