import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [reports, setReports] = useState([])
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' }
  ]

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reportsResponse, configResponse] = await Promise.all([
        axios.get('/api/reports/'),
        axios.get('/api/config/')
      ])
      setReports(reportsResponse.data || [])
      setConfig(configResponse.data)
    } catch (error) {
      console.error('Failed to load dashboard data', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setLogoutOpen(true)
  }

  const confirmLogout = () => {
    Cookies.remove('token')
    setLogoutOpen(false)
    navigate('/login')
  }

  const cancelLogout = () => {
    setLogoutOpen(false)
  }

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      detail: reports.length > 0 ? 'Live report count' : 'No reports yet'
    },
    {
      label: 'Bot Status',
      value: config?.bot_enabled ? 'Online' : 'Offline',
      detail: config?.bot_enabled ? 'Slash commands are active' : 'Bot is disabled'
    },
    {
      label: 'Mirror Channel',
      value: config?.notification_channel_id || 'Not set',
      detail: config?.mirror_enabled ? 'Mirror enabled' : 'Mirror disabled'
    }
  ]

  const recentReports = reports.slice(0, 5)

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">Discord Admin</div>
        <div className="nav-actions">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <button className="nav-btn logout-btn" onClick={handleLogout} type="button">Logout</button>
        </div>
      </nav>

      {logoutOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <p className="modal-message">Are you sure you want to sign out?</p>
            <div className="modal-actions">
              <button type="button" className="modal-btn modal-btn-cancel" onClick={cancelLogout}>
                Stay signed in
              </button>
              <button type="button" className="modal-btn modal-btn-confirm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Monitor bot activity and manage configuration</p>
          </div>
        </section>

        <section className="stats-section">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-box">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-detail">{stat.detail}</div>
            </div>
          ))}
        </section>

        <section className="content-section">
          <div className="content-left">
            <div className="card">
              <div className="card-header">
                <h2>Recent Reports</h2>
                <button className="link-btn" onClick={() => navigate('/reports')}>View all</button>
              </div>
              <div className="card-body">
                {loading ? (
                  <p className="placeholder">Loading reports...</p>
                ) : recentReports.length > 0 ? (
                  <div className="report-items">
                    {recentReports.map((item) => (
                      <div key={item.id} className="report-item">
                        <div className="report-info">
                          <div className="report-user">{item.username || item.user_id || 'Unknown'}</div>
                          <div className="report-text">{item.report_text || 'No description'}</div>
                        </div>
                        <div className="report-meta">
                          <span className={`status-badge status-${item.status?.toLowerCase() || 'pending'}`}>
                            {item.status || 'Pending'}
                          </span>
                          <div className="report-time">{new Date(item.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="placeholder">No reports yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="content-right">
            <div className="card">
              <div className="card-header">
                <h2>System Status</h2>
              </div>
              <div className="card-body">
                <div className="status-item">
                  <span className="status-label">Gateway</span>
                  <span className="status-value">99.8%</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Bot Uptime</span>
                  <span className="status-value">24h 12m</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Health</span>
                  <span className="status-value healthy">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
