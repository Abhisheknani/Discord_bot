import { useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    Cookies.set('token', 'demo-admin-token', { expires: 1 })
    navigate('/dashboard')
  }

  return (
    <div className="app-shell login-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="glass-card login-card">
        <div className="login-hero">
          <p className="eyebrow">Discord Command Center</p>
          <h1>Welcome back, moderator.</h1>
          <p className="subtle-text">
            Securely review incidents, monitor bot health, and keep your community flowing smoothly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@discord.dev"
            required
          />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />

          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
