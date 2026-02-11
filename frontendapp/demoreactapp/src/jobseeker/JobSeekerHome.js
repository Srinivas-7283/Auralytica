import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Target, FileText, Sparkles, Briefcase, Calendar } from 'lucide-react';

export default function JobSeekerHome() {
  const [jobseekerData, setJobSeekerData] = useState(null);

  useEffect(() => {
    const storedJobSeekerData = localStorage.getItem('jobseeker');
    if (storedJobSeekerData) {
      setJobSeekerData(JSON.parse(storedJobSeekerData));
    }
  }, []);

  if (!jobseekerData) return null;

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero} className="animate-fade-up">
        <h1 style={styles.greeting}>
          Welcome back, <span className="gradient-text">{jobseekerData.fullname}</span>!
        </h1>
        <p style={styles.subtitle}>
          Your next big career move is just a few clicks away. Let's make it happen.
        </p>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsGrid} className="animate-fade-up delay-1">
        <div style={styles.statCard} className="glass-card">
          <Briefcase size={24} color="#3b82f6" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>12</span>
            <span style={styles.statLabel}>Applied Jobs</span>
          </div>
        </div>
        <div style={styles.statCard} className="glass-card">
          <Calendar size={24} color="#06b6d4" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>3</span>
            <span style={styles.statLabel}>Interviews</span>
          </div>
        </div>
        <div style={styles.statCard} className="glass-card">
          <Target size={24} color="#8b5cf6" />
          <div style={styles.statInfo}>
            <span style={styles.statValue}>85%</span>
            <span style={styles.statLabel}>Resume Score</span>
          </div>
        </div>
      </div>

      {/* AI Tools Grid */}
      <h2 style={styles.sectionTitle} className="animate-fade-up delay-2">AI-Powered Career Toolkit</h2>
      <div style={styles.toolsGrid} className="animate-fade-up delay-2">
        <Link to="/jobseeker/job-matching" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="blue">
              <Rocket size={24} />
            </div>
            <h3 style={styles.toolTitle}>Smart Match</h3>
            <p style={styles.toolDesc}>AI-driven job recommendations tailored to your unique profile.</p>
            <span style={styles.exploreBtn}>Explore <Sparkles size={14} /></span>
          </div>
        </Link>

        <Link to="/jobseeker/resume-optimizer" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="cyan">
              <Target size={24} />
            </div>
            <h3 style={styles.toolTitle}>Resume Optimizer</h3>
            <p style={styles.toolDesc}>Polish your resume to perfection and beat the ATS systems.</p>
            <span style={styles.exploreBtn}>Optimize <Sparkles size={14} /></span>
          </div>
        </Link>

        <Link to="/jobseeker/cover-letter" style={styles.toolLink}>
          <div style={styles.toolCard} className="glass-card">
            <div style={styles.iconWrapper} className="purple">
              <FileText size={24} />
            </div>
            <h3 style={styles.toolTitle}>Cover Letter</h3>
            <p style={styles.toolDesc}>Generate compelling cover letters that get you noticed.</p>
            <span style={styles.exploreBtn}>Generate <Sparkles size={14} /></span>
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
    textAlign: 'center',
    marginBottom: '50px',
  },
  greeting: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '15px',
    fontFamily: 'var(--font-heading)',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '25px',
  },
  toolLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  toolCard: {
    padding: '35px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '15px',
  },
  iconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  toolTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'white',
    fontFamily: 'var(--font-heading)',
  },
  toolDesc: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '15px',
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
  'blue': { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  'cyan': { background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' },
  'purple': { background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
};
