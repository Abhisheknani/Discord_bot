import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [query, setQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' }
  ]

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/reports/')
        const data = response.data || []
        setReports(data)
        setSelectedReport(data[0] || null)
      } catch (error) {
        console.error('Failed to load reports', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  const filteredReports = useMemo(() => {
    const value = query.toLowerCase()
    return reports.filter((report) => {
      const userName = (report.username || report.user_id || 'Unknown user').toLowerCase()
      const issue = (report.report_text || '').toLowerCase()
      const status = (report.status || 'Pending').toLowerCase()
      return userName.includes(value) || issue.includes(value) || status.includes(value)
    })
  }, [query, reports])

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
            <h1>Reports</h1>
            <p className="subtitle">View all incident reports from Discord</p>
          </div>
        </section>

        <div className="reports-container">
          <div className="reports-list-section">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by user, status, or message..."
              />
            </div>

            <div className="reports-list">
              <div className="reports-list-header">
                <span>User / Report</span>
                <span>Date</span>
              </div>
              {loading ? (
                <p className="placeholder">Loading reports...</p>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <button
                    key={report.id}
                    className={`report-list-item ${selectedReport?.id === report.id ? 'active' : ''}`}
                    onClick={() => setSelectedReport(report)}
                    type="button"
                  >
                    <div className="report-list-info">
                      <div className="report-list-user">{report.username || report.user_id || 'Unknown'}</div>
                      <div className="report-list-text">{report.report_text || 'No description'}</div>
                    </div>
                    <div className="report-list-date">{new Date(report.created_at).toLocaleDateString()}</div>
                  </button>
                ))
              ) : (
                <p className="placeholder">No reports found</p>
              )}
            </div>
          </div>

          <div className="reports-detail-section">
            {selectedReport ? (
              <div className="card">
                <div className="card-header">
                  <h2>Report Details</h2>
                  <span className={`status-badge status-${selectedReport.status?.toLowerCase() || 'pending'}`}>
                    {selectedReport.status || 'Pending'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="detail-row">
                    <span className="detail-label">User</span>
                    <span className="detail-value">{selectedReport.username || selectedReport.user_id || 'Unknown'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{new Date(selectedReport.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{new Date(selectedReport.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Guild ID</span>
                    <span className="detail-value">{selectedReport.guild_id || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Channel ID</span>
                    <span className="detail-value">{selectedReport.channel_id || 'N/A'}</span>
                  </div>

                  <div className="message-section">
                    <h3>Message</h3>
                    <div className="message-box">
                      {selectedReport.report_text || 'No message provided'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p className="placeholder">No report selected</p>
                  <p style={{ color: '#999', fontSize: '0.9rem' }}>Select a report from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Reports
