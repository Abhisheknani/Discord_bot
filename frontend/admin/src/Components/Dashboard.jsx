import { Link } from 'react-router-dom'

const Dashboard = () => {
  const stats = [
    { label: 'Total Reports', value: '15', detail: '+4 this week' },
    { label: 'Bot Status', value: 'Online', detail: 'Latency 42ms' },
    { label: 'Mirror Channel', value: '#notifications', detail: 'Live queue' }
  ]

  const recentReports = [
    { name: 'Abhishek', issue: 'Server down', time: '2 min ago', severity: 'Critical' },
    { name: 'Rahul', issue: 'API timeout', time: '5 min ago', severity: 'Medium' },
    { name: 'Nina', issue: 'Channel spam', time: '13 min ago', severity: 'Low' }
  ]

  return (
    <div className="app-shell dashboard-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="glass-card dashboard-card">
        <header className="topbar">
          <div>
            <p className="eyebrow">Discord Admin Dashboard</p>
            <h2>Operations overview</h2>
          </div>
          <div className="topbar-actions">
            <Link to="/reports" className="ghost-btn">
              View Reports
            </Link>
            <button className="primary-btn">+ New Alert</button>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <p className="stat-label">{stat.label}</p>
              <h3>{stat.value}</h3>
              <span>{stat.detail}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel-card">
            <div className="panel-title-row">
              <h3>Recent reports</h3>
              <Link to="/reports" className="text-link">Open all</Link>
            </div>
            <ul className="report-list">
              {recentReports.map((item) => (
                <li key={item.name + item.time} className="report-row">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.issue}</p>
                  </div>
                  <div className="report-meta">
                    <span className={`severity-pill ${item.severity.toLowerCase()}`}>{item.severity}</span>
                    <small>{item.time}</small>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel-card status-panel">
            <div className="panel-title-row">
              <h3>Live systems</h3>
              <span className="online-badge">● Stable</span>
            </div>
            <div className="system-stack">
              <div className="system-item">
                <span>Gateway</span>
                <strong>99.8%</strong>
              </div>
              <div className="system-item">
                <span>Bot uptime</span>
                <strong>24h 12m</strong>
              </div>
              <div className="system-item">
                <span>Queue health</span>
                <strong>Healthy</strong>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
