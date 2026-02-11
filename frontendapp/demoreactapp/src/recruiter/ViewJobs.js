import axios from 'axios';
import config from '../config';

import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Building2, MapPin, Calendar, Clock, DollarSign,
  Users, ArrowRight, Plus, Archive, Edit3
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ViewJobs() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRecruiterData = localStorage.getItem('recruiter');
    if (storedRecruiterData) {
      const parsedRecruiterData = JSON.parse(storedRecruiterData);
      fetchJobs(parsedRecruiterData.username);
    }
  }, []);

  const fetchJobs = async (username) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.url}/viewjobs/${username}`);
      if (response.data === 'DATA NOT FOUND') {
        setMessage('Your talent inventory is currently empty.');
        setJobs([]);
      } else {
        setJobs(response.data);
      }
    } catch (error) {
      setMessage('Network error: Unable to sync job repository.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unset';
    try {
      const parts = dateString.trim().split(' ');
      const datePart = parts[0];
      const dateParts = datePart.split('-');
      if (dateParts.length !== 3) return dateString;
      const date = new Date(dateParts[2], parseInt(dateParts[1]) - 1, dateParts[0]);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusTheme = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { color: '#ef4444', label: 'EXPIRED', bg: 'rgba(239, 68, 68, 0.1)' };
    if (daysLeft <= 7) return { color: '#f59e0b', label: 'URGENT', bg: 'rgba(245, 158, 11, 0.1)' };
    return { color: '#10b981', label: 'OPEN', bg: 'rgba(16, 185, 129, 0.1)' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <div style={styles.titleSection}>
          <h1 style={styles.mainTitle} className="font-heading">Global Talent Inventory</h1>
          <p style={styles.subTitle}>Orchestrating architectural roles and organizational growth.</p>
        </div>
        <button
          onClick={() => navigate('/recruiter/add-job')}
          className="posh-button posh-button-primary"
          style={styles.addBtn}
        >
          <Plus size={18} /> Post New Architecture
        </button>
      </div>

      {loading ? (
        <div style={styles.loaderContainer}>
          <div className="spinner" />
          <p>Synchronizing Repository...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div style={styles.grid}>
          {jobs.map((job, index) => {
            const daysLeft = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const status = getStatusTheme(job.deadline);

            return (
              <div
                key={job._id}
                style={{
                  ...styles.card,
                  borderColor: hoveredCard === index ? status.color : 'var(--glass-border)',
                  transform: hoveredCard === index ? 'translateY(-8px)' : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
                className="glass-card animate-fade-up"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.cardHeader}>
                  <div style={{ ...styles.statusTag, color: status.color, background: status.bg }}>
                    <div style={{ ...styles.pulse, background: status.color }} />
                    {status.label}
                  </div>
                  <div style={styles.jobId}>Ref: #{job.jobid}</div>
                </div>

                <div style={styles.heroSection}>
                  <h2 style={styles.jobTitle}>{job.title}</h2>
                  <div style={styles.companyArea}>
                    <Building2 size={16} /> {job.company}
                  </div>
                </div>

                <div style={styles.metricsRow}>
                  <div style={styles.metric}>
                    <div style={styles.metricIcon}><DollarSign size={14} /></div>
                    <div style={styles.metricText}>
                      <span style={styles.metricValue}>${job.salary}</span>
                      <span style={styles.metricLabel}>Annual Base</span>
                    </div>
                  </div>
                  <div style={styles.metric}>
                    <div style={{ ...styles.metricIcon, color: status.color }}><Clock size={14} /></div>
                    <div style={styles.metricText}>
                      <span style={{ ...styles.metricValue, color: status.color }}>
                        {daysLeft < 0 ? 'Closed' : `${daysLeft}d`}
                      </span>
                      <span style={styles.metricLabel}>Remaining</span>
                    </div>
                  </div>
                  <div style={styles.metric}>
                    <div style={{ ...styles.metricIcon, color: '#3b82f6' }}><Users size={14} /></div>
                    <div style={styles.metricText}>
                      <span style={{ ...styles.metricValue, color: '#3b82f6' }}>Active</span>
                      <span style={styles.metricLabel}>Pipeline</span>
                    </div>
                  </div>
                </div>

                <div style={styles.footerDetails}>
                  <div style={styles.detailItem}>
                    <MapPin size={14} /> {job.location}
                  </div>
                  <div style={styles.detailItem}>
                    <Calendar size={14} /> Posted: {formatDate(job.postedtime)}
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    className="posh-button"
                    style={styles.viewBtn}
                    onClick={() => navigate('/recruiter/view-job-applicants')}
                  >
                    Inspect Candidates <ArrowRight size={16} />
                  </button>
                  <div style={styles.secondaryActions}>
                    <button style={styles.iconBtn} title="Edit Configuration"><Edit3 size={16} /></button>
                    <button style={styles.iconBtn} title="Archive Pipeline"><Archive size={16} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyContainer} className="glass-card animate-fade-up">
          <Briefcase size={64} color="rgba(255,255,255,0.05)" />
          <p style={styles.emptyText}>{message}</p>
          <button
            onClick={() => navigate('/recruiter/add-job')}
            className="posh-button posh-button-primary"
          >
            Initialize First Pipeline
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '50px',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mainTitle: {
    fontSize: '2.8rem',
    margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subTitle: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    margin: 0,
  },
  addBtn: {
    padding: '0 30px',
    height: '50px',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: '30px',
  },
  card: {
    borderRadius: '24px',
    padding: '30px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  statusTag: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: '800',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    boxShadow: '0 0 0 rgba(0,0,0,0.5)',
  },
  jobId: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  heroSection: {
    marginBottom: '30px',
  },
  jobTitle: {
    fontSize: '1.8rem',
    margin: '0 0 10px 0',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.2',
  },
  companyArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '15px',
    marginBottom: '30px',
  },
  metric: {
    background: 'rgba(255,255,255,0.02)',
    padding: '15px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  metricIcon: {
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.1)',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricText: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricValue: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'white',
  },
  metricLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  footerDetails: {
    padding: '20px 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  cardActions: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewBtn: {
    flex: 1,
    marginRight: '15px',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontWeight: '700',
  },
  secondaryActions: {
    display: 'flex',
    gap: '10px',
  },
  iconBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'var(--text-muted)',
  },
  emptyContainer: {
    padding: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    maxWidth: '400px',
    textAlign: 'center',
    lineHeight: '1.6',
  }
};
