import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

import {
  User, Mail, Lock, MapPin, Phone,
  Calendar, UserCircle2, Sparkles, ShieldCheck,
  ArrowRight, CheckCircle2, AlertCircle,
  ChevronRight, Camera, Key, Info
} from 'lucide-react';

export default function Registration() {
  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    dateofbirth: '',
    email: '',
    password: '',
    location: '',
    contact: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${config.url}/insertjobseeker`, formData);
      if (response.status === 200) {
        setMessage("Enrollment Finalized: Welcome to the Global Talent Matrix.");
        setFormData({
          fullname: '',
          gender: '',
          dateofbirth: '',
          email: '',
          password: '',
          location: '',
          contact: ''
        });
        setTimeout(() => navigate('/jobseekerlogin'), 2000);
      }
    } catch (error) {
      setError(error.response?.data || "Enrollment Protocol Failed: Please verify institutional data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div className="glass-card animate-fade-up" style={styles.enrollCard}>
        <div style={styles.header}>
          <div style={styles.iconBatch}>
            <Sparkles size={28} color="#3b82f6" />
          </div>
          <h2 style={styles.title} className="font-heading">Candidate Enrollment Nexus</h2>
          <p style={styles.subtitle}>Begin your transition into the elite professional ecosystem.</p>
        </div>

        {message && (
          <div style={styles.successTile} className="animate-fade-up">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}
        {error && (
          <div style={styles.errorTile} className="animate-fade-up">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            {/* LEFT COLUMN: CORE IDENTITY */}
            <div style={styles.formColumn}>
              <h4 style={styles.sectionHeader}><UserCircle2 size={14} /> Core Identity</h4>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name Portfolio</label>
                <div style={styles.inputWrapper}>
                  <User size={16} style={styles.inputIcon} />
                  <input type="text" id="fullname" value={formData.fullname} onChange={handleChange} style={styles.input} placeholder="e.g., Alexander Sterling" required />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.inputGroup} className="flex-1">
                  <label style={styles.label}>Biological Sex</label>
                  <select id="gender" value={formData.gender} onChange={handleChange} style={styles.input} required>
                    <option value="">Select Protocol</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Non-Binary</option>
                  </select>
                </div>
                <div style={styles.inputGroup} className="flex-1">
                  <label style={styles.label}>Birth Chronology</label>
                  <input type="date" id="dateofbirth" value={formData.dateofbirth} onChange={handleChange} style={styles.input} required />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Primary Signal (Contact)</label>
                <div style={styles.inputWrapper}>
                  <Phone size={16} style={styles.inputIcon} />
                  <input type="number" id="contact" value={formData.contact} onChange={handleChange} style={styles.input} placeholder="+1 (555) 000-0000" required />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ACCESS & LOGISTICS */}
            <div style={styles.formColumn}>
              <h4 style={styles.sectionHeader}><Key size={14} /> Secure Access & Logistics</h4>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Institutional Email</label>
                <div style={styles.inputWrapper}>
                  <Mail size={16} style={styles.inputIcon} />
                  <input type="email" id="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="name@career-nexus.com" required />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Security Credential (Password)</label>
                <div style={styles.inputWrapper}>
                  <Lock size={16} style={styles.inputIcon} />
                  <input type="password" id="password" value={formData.password} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Geospatial Coordinate (Location)</label>
                <div style={styles.inputWrapper}>
                  <MapPin size={16} style={styles.inputIcon} />
                  <input type="text" id="location" value={formData.location} onChange={handleChange} style={styles.input} placeholder="e.g., San Francisco, CA" required />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.actionSection}>
            <button
              type="submit"
              disabled={loading}
              className="posh-button posh-button-primary"
              style={styles.submitBtn}
            >
              {loading ? <div className="spinner-mini" /> : <ChevronRight size={18} />}
              {loading ? 'Processing Protocol...' : 'Finalize Enrollment Protocol'}
            </button>
            <p style={styles.footerNote}>
              By finalizing, you agree to the <span style={styles.linkUnderline}>Nodal Protocol Agreements</span> and <span style={styles.linkUnderline}>Data Privacy Accord</span>.
            </p>
          </div>
        </form>

        <div style={styles.bottomLink}>
          Already a member? <span style={styles.linkText} onClick={() => navigate('/jobseekerlogin')}>Initialize Session Portal</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  enrollCard: {
    width: '95%',
    maxWidth: '1000px',
    padding: ' clamp(20px, 5vw, 60px)',
    borderRadius: '35px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  iconBatch: {
    width: '60px',
    height: '60px',
    borderRadius: '18px',
    background: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: {
    fontSize: '2.5rem',
    margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    marginTop: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: ' clamp(20px, 4vw, 50px)',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionHeader: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    margin: '0 0 5px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '18px',
    color: 'rgba(255,255,255,0.2)',
  },
  input: {
    width: '100%',
    height: '52px',
    padding: '0 20px 0 50px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  actionSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  submitBtn: {
    width: '100%',
    maxWidth: '400px',
    height: '60px',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  footerNote: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  linkUnderline: {
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  bottomLink: {
    marginTop: '40px',
    textAlign: 'center',
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
  },
  linkText: {
    color: '#3b82f6',
    fontWeight: '700',
    cursor: 'pointer',
  },
  successTile: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '18px',
    borderRadius: '14px',
    marginBottom: '30px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  errorTile: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '18px',
    borderRadius: '14px',
    marginBottom: '30px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  }
};
