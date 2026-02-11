import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, ShieldCheck, ArrowRight,
  Sparkles, AlertCircle, CheckCircle2, UserCircle2
} from 'lucide-react';

export default function JobSeekerLogin({ onJobSeekerLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${config.url}/checkjobseekerlogin`, formData);
      if (response.data != null) {
        onJobSeekerLogin();
        localStorage.setItem('jobseeker', JSON.stringify(response.data));
        navigate("/jobseekerhome");
      } else {
        setError("Authentication Failed: Credentials not recognized by the central directory.");
      }
    } catch (error) {
      setError("Protocol Error: Unable to synchronize with authentication node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div className="glass-card animate-fade-up" style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <Sparkles size={32} color="#3b82f6" />
          </div>
          <h2 style={styles.title} className="font-heading">Job Seeker Portal</h2>
          <p style={styles.subtitle}>Secure Access to Your Professional Odyssey</p>
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
          <div style={styles.inputGroup}>
            <label style={styles.label}><Mail size={14} /> Institution Email</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                id="email"
                style={styles.input}
                placeholder="name@career-nexus.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}><Lock size={14} /> Access Key</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                id="password"
                style={styles.input}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="posh-button posh-button-primary"
            style={styles.submitBtn}
          >
            {loading ? <div className="spinner-mini" /> : <ShieldCheck size={18} />}
            {loading ? 'Initializing...' : 'Initialize Session'}
          </button>

          <div style={styles.footerActions}>
            <span style={styles.footerLink} onClick={() => navigate('/registration')}>
              New to the Nexus? <span style={styles.linkHighlight}>Enroll Now</span>
            </span>
          </div>
        </form>

        <div style={styles.securitySeal}>
          <ShieldCheck size={12} /> Institutional Grade Encryption (AES-256)
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '50px',
    borderRadius: '32px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '40px',
  },
  logoBox: {
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    background: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    marginTop: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    height: '55px',
    padding: '0 20px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    ':focus': {
      borderColor: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.05)',
    }
  },
  submitBtn: {
    height: '55px',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '10px',
  },
  successTile: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '25px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  errorTile: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '25px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    textAlign: 'left'
  },
  footerActions: {
    marginTop: '10px',
  },
  footerLink: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  linkHighlight: {
    color: '#3b82f6',
    fontWeight: '700',
  },
  securitySeal: {
    marginTop: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    opacity: 0.6,
  }
};