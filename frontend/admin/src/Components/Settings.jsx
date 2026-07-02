import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Settings = () => {
  const [formData, setFormData] = useState({
    bot_enabled: true,
    mirror_enabled: true,
    notification_channel_id: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' }
  ]

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/api/config/')
        setFormData({
          bot_enabled: response.data?.bot_enabled ?? true,
          mirror_enabled: response.data?.mirror_enabled ?? true,
          notification_channel_id: response.data?.notification_channel_id ?? ''
        })
      } catch (error) {
        console.error('Failed to load settings', error)
        setMessage('Unable to load current settings')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      await axios.patch('/api/config/', formData)
      setMessage('Settings saved successfully')
    } catch (error) {
      console.error('Failed to save settings', error)
      setMessage('Unable to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">Discord Admin</div>
        <div className="nav-actions">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <h1>Settings</h1>
            <p className="subtitle">Configure bot behavior and preferences</p>
          </div>
        </section>

        <div className="settings-container">
          <div className="card settings-card">
            <div className="card-header">
              <h2>Bot Configuration</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="settings-group">
                  <div className="settings-item">
                    <div className="settings-control">
                      <input
                        type="checkbox"
                        id="botEnabled"
                        name="bot_enabled"
                        className="settings-checkbox"
                        checked={Boolean(formData.bot_enabled)}
                        onChange={handleChange}
                      />
                      <label htmlFor="botEnabled" className="settings-label">
                        Bot Enabled
                      </label>
                    </div>
                    <p className="settings-description">Enable or disable the Discord bot</p>
                  </div>

                  <div className="settings-item">
                    <div className="settings-control">
                      <input
                        type="checkbox"
                        id="mirrorEnabled"
                        name="mirror_enabled"
                        className="settings-checkbox"
                        checked={Boolean(formData.mirror_enabled)}
                        onChange={handleChange}
                      />
                      <label htmlFor="mirrorEnabled" className="settings-label">
                        Mirror Enabled
                      </label>
                    </div>
                    <p className="settings-description">Enable or disable message mirroring</p>
                  </div>
                </div>

                <div className="form-group row-full">
                  <label className="form-label" htmlFor="notificationChannel">
                    Notification Channel ID
                  </label>
                  <input
                    id="notificationChannel"
                    name="notification_channel_id"
                    className="form-input"
                    value={formData.notification_channel_id}
                    onChange={handleChange}
                    placeholder="Enter Discord channel ID"
                  />
                  <p className="settings-description">Channel where bot notifications will be sent</p>
                </div>

                <div className="form-actions row-full">
                  <button type="submit" className="submit-btn" disabled={saving || loading}>
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>

                {message && (
                  <p className={`form-message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
