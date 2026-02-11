import React, { useEffect, useState } from 'react';
import {
  User, Mail, Phone, Building2, MapPin, Cake,
  ShieldCheck, Sparkles, LogOut, Edit3,
  Briefcase, Activity, Target, Award
} from 'lucide-react';
import { AlertCircle } from 'lucide-react';
export default function RecruiterProfile() {
  const [recruiterData, setRecruiterData] = useState(null);

  useEffect(() => {
    const storedRecruiterData = localStorage.getItem('recruiter');
    if (storedRecruiterData) {
      const parsedRecruiterData = JSON.parse(storedRecruiterData);
      setRecruiterData(parsedRecruiterData);
    }
  }, []);

  if (!recruiterData) {
    return (
      <div style={styles.errorContainer} className="animate-fade-up">
        <AlertCircle size={48} color="#ef4444" />
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Executive credentials not found in local cache.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <div style={styles.identityHeader}>
          <div style={styles.avatarLarge}>
            {recruiterData.fullname?.charAt(0) || 'R'}
          </div>
          <div style={styles.identityText}>
            <h1 style={styles.mainTitle} className="font-heading">{recruiterData.fullname}</h1>
            <div style={styles.roleBadge}>
              <Briefcase size={14} /> Strategic Talent Architect @ {recruiterData.company}
            </div>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button className="posh-button" style={styles.editBtn}>
            <Edit3 size={16} /> Update Protocol
          </button>
          <button className="posh-button" style={styles.logoutBtn} onClick={() => {
            localStorage.removeItem('recruiter');
            window.location.href = '/recruiter/login';
          }}>
            <LogOut size={16} /> Secure Exit
          </button>
        </div>
      </div>

      <div style={styles.metricsRow} className="animate-fade-up delay-1">
        <div className="glass-card" style={styles.metricItem}>
          <Activity size={20} color="#3b82f6" />
          <div style={styles.metricData}>
            <span style={styles.metricVal}>Operational</span>
            <span style={styles.metricLab}>Account Status</span>
          </div>
        </div>
        <div className="glass-card" style={styles.metricItem}>
          <Target size={20} color="#10b981" />
          <div style={styles.metricData}>
            <span style={styles.metricVal}>Verified</span>
            <span style={styles.metricLab}>Identity Protocol</span>
          </div>
        </div>
        <div className="glass-card" style={styles.metricItem}>
          <Award size={20} color="#f59e0b" />
          <div style={styles.metricData}>
            <span style={styles.metricVal}>Senior Rank</span>
            <span style={styles.metricLab}>Authority Level</span>
          </div>
        </div>
      </div>

      <div style={styles.profileGrid} className="animate-fade-up delay-2">
        <div className="glass-card" style={styles.infoCard}>
          <h3 style={styles.cardTitle}><Sparkles size={18} /> Core Credentials</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <User size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.infoLab}>Gender Alignment</div>
                <div style={styles.infoVal}>{recruiterData.gender}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <Cake size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.infoLab}>Chronological Baseline (DOB)</div>
                <div style={styles.infoVal}>{recruiterData.dateofbirth}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <Mail size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.infoLab}>Secure Channel (Email)</div>
                <div style={styles.infoVal}>{recruiterData.email}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <Phone size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.infoLab}>Signal Line (Contact)</div>
                <div style={styles.infoVal}>{recruiterData.contact}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={styles.infoCard}>
          <h3 style={styles.cardTitle}><Building2 size={18} /> Organizational Meta</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <Building2 size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.infoLab}>Primary Entity</div>
                <div style={styles.infoVal}>{recruiterData.company}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <MapPin size={16} color="var(--text-muted)" />
              <div>
                <div style={styles.infoLab}>Geospatial Coordinates</div>
                <div style={styles.infoVal}>{recruiterData.address}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <ShieldCheck size={16} color="#10b981" />
              <div>
                <div style={styles.infoLab}>Access Permissions</div>
                <div style={styles.infoVal}>Total Administrator Control Requested</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '50px',
  },
  identityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  avatarLarge: {
    width: '120px',
    height: '120px',
    borderRadius: '35px',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    fontWeight: '900',
    color: 'white',
    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
  },
  identityText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mainTitle: {
    fontSize: '3.2rem',
    margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
  },
  editBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '0 25px',
    height: '50px',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '0 25px',
    height: '50px',
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '50px',
  },
  metricItem: {
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    borderRadius: '24px',
  },
  metricData: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricVal: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'white',
  },
  metricLab: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
  },
  infoCard: {
    padding: '40px',
    borderRadius: '24px',
  },
  cardTitle: {
    fontSize: '1.2rem',
    margin: '0 0 30px 0',
    fontWeight: '800',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '25px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
  },
  infoLab: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  infoVal: {
    fontSize: '1.1rem',
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '500px',
    textAlign: 'center',
  }
};
