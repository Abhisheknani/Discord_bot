import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const reports = [
  {
    id: 1,
    user: 'Abhishek',
    issue: 'Server down',
    date: 'Today',
    time: '09:24',
    status: 'Investigating',
    summary: 'The primary server stopped responding after a deployment spike. The team is reviewing logs and rolling back affected services.'
  },
  {
    id: 2,
    user: 'Rahul',
    issue: 'Office closed',
    date: 'Yesterday',
    time: '18:10',
    status: 'Resolved',
    summary: 'The office closure notice was mirrored successfully and the announcement reached all relevant channels.'
  },
  {
    id: 3,
    user: 'Mina',
    issue: 'API timeout',
    date: 'Yesterday',
    time: '14:02',
    status: 'Monitoring',
    summary: 'A temporary timeout was detected in the reporting endpoint. Monitoring remains active and no further escalation is required.'
  }
]

const Reports = () => {
  const [query, setQuery] = useState('')
  const [selectedReport, setSelectedReport] = useState(reports[0])

  const filteredReports = useMemo(() => {
    const value = query.toLowerCase()
    return reports.filter((report) => {
      return (
        report.user.toLowerCase().includes(value) ||
        report.issue.toLowerCase().includes(value) ||
        report.status.toLowerCase().includes(value)
      )
    })
  }, [query])

  return (
    <div className="app-shell reports-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="glass-card reports-card">
        <header className="topbar">
          <div>
            <p className="eyebrow">Reports</p>
            <h2>Incident feed</h2>
          </div>
          <div className="topbar-actions">
            <Link to="/dashboard" className="ghost-btn">
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="reports-layout">
          <section className="reports-list-panel">
            <div className="search-box">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reports"
              />
            </div>

            <div className="report-stack">
              {filteredReports.map((report) => (
                <button
                  key={report.id}
                  className={`report-item ${selectedReport.id === report.id ? 'active' : ''}`}
                  onClick={() => setSelectedReport(report)}
                  type="button"
                >
                  <div>
                    <strong>{report.user}</strong>
                    <p>{report.issue}</p>
                  </div>
                  <span>{report.date}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="report-detail-panel">
            <div className="detail-header">
              <div>
                <p className="eyebrow">Selected report</p>
                <h3>{selectedReport.issue}</h3>
              </div>
              <span className="online-badge">{selectedReport.status}</span>
            </div>

            <div className="detail-grid">
              <div className="detail-block">
                <span className="detail-label">User</span>
                <strong>{selectedReport.user}</strong>
              </div>
              <div className="detail-block">
                <span className="detail-label">Time</span>
                <strong>{selectedReport.time}</strong>
              </div>
              <div className="detail-block">
                <span className="detail-label">Date</span>
                <strong>{selectedReport.date}</strong>
              </div>
            </div>

            <div className="summary-card">
              <h4>AI summary</h4>
              <p>{selectedReport.summary}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Reports
