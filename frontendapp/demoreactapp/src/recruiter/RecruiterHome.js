import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart2, PlusCircle, ShieldCheck, Mail, ClipboardList, Sparkles } from 'lucide-react';

export default function RecruiterHome() {
  const [recruiterData, setRecruiterData] = useState(null);

  useEffect(() => {
    const storedRecruiterData = localStorage.getItem('recruiter');
    if (storedRecruiterData) {
      setRecruiterData(JSON.parse(storedRecruiterData));
    }
  }, []);

  if (!recruiterData) return null;

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero} className="animate-fade-up">
        <h1 style={styles.greeting}>
          Hiring Dashboard: <span className="gradient-text">{recruiterData.companyname}</span>
        </h1>
        <p style={styles.subtitle}>
          Welcome back, {recruiterData.fullname}. Manage your talent pipeline and AI-powered hiring tools here.
        </p>
      </div>

      {/* Hiring Stats */}
      <div style={styles.statsGrid} className="animate-fade-up delay-1">
        <div style={styles.statCard} className="glass-card">
          <ClipboardList size={24} color="#10b981" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>8</span>
            <span style={styles.statLabel}>Active Jobs</span>
          </div>
        </div>
        <div style={styles.statCard} className="glass-card">
          <Users size={24} color="#3b82f6" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>124</span>
            <span style={styles.statLabel}>Total Applicants</span>
          </div>
        </div>
        <div style={styles.statCard} className="glass-card">
          <BarChart2 size={24} color="#8b5cf6" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>+12%</span>
            <span style={styles.statLabel}>Hiring Speed</span>
          </div>
        </div>
      </div>

      {/* Action Hub */}
      <h2 style={styles.sectionTitle} className="animate-fade-up delay-2">Recruitment Command Center</h2>
      <div style={styles.toolsGrid} className="animate-fade-up delay-2">
        <Link to="/addjob" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="green">
              <PlusCircle size={24} />
            </div>
            <h3 style={styles.toolTitle}>Post New Job</h3>
            <p style={styles.toolDesc}>Create high-impact job listings with AI assistance to attract top talent.</p>
            <span style={styles.exploreBtn}>Create <Sparkles size={14} /></span>
          </div>
        </Link>

        <Link to="/recruiter/jd-generator" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="blue">
              <Sparkles size={24} />
            </div>
            <h3 style={styles.toolTitle}>JD Generator</h3>
            <p style={styles.toolDesc}>Generate contextual, high-performing job descriptions in seconds.</p>
            <span style={styles.exploreBtn}>Generate <Sparkles size={14} /></span>
          </div>
        </Link>

        <Link to="/recruiter/bias-checker" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="red">
              <ShieldCheck size={24} />
            </div>
            <h3 style={styles.toolTitle}>Bias Shield</h3>
            <p style={styles.toolDesc}>Audit your job descriptions for bias to ensure inclusive hiring.</p>
            <span style={styles.exploreBtn}>Audit <Sparkles size={14} /></span>
          </div>
        </Link>

        <Link to="/recruiter/analytics" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="purple">
              <BarChart2 size={24} />
            </div>
            <h3 style={styles.toolTitle}>Hiring Insights</h3>
            <p style={styles.toolDesc}>Data-driven analytics to optimize your entire recruitment funnel.</p>
            <span style={styles.exploreBtn}>View Data <Sparkles size={14} /></span>
          </div>
        </Link>

        <Link to="/recruiter/email-generator" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="cyan">
              <Mail size={24} />
            </div>
            <h3 style={styles.toolTitle}>Outreach Gen</h3>
            <p style={styles.toolDesc}>Craft personalized candidate outreach emails effortlessly.</p>
            <span style={styles.exploreBtn}>Craft <Sparkles size={14} /></span>
          </div>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'left',
    marginBottom: '50px',
  },
  greeting: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '10px',
    fontFamily: 'var(--font-heading)',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '800px',
    lineHeight: '1.6',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '60px',
  },
  statCard: {
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '2px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '30px',
    color: 'white',
    fontFamily: 'var(--font-heading)',
  },
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
  },
  toolLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  toolCard: {
    padding: '30px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '15px',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  toolTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'white',
    fontFamily: 'var(--font-heading)',
  },
  toolDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '10px',
  },
  exploreBtn: {
    marginTop: 'auto',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  // Icon Colors
  'green': { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  'blue': { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  'purple': { background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  'cyan': { background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' },
  'red': { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};
