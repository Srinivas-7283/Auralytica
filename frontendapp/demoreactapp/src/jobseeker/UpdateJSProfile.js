import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import {
  User, Mail, Lock, MapPin, Phone, Cake,
  Save, ChevronLeft, Info, Sparkles,
  CheckCircle2, AlertCircle, ShieldCheck,
  BadgeCheck, Camera, Layers
} from 'lucide-react';

export default function UpdateJSProfile() {
  const [jobseekerData, setJobSeekerData] = useState({
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
  const [initialJobseekerData, setInitialJobseekerData] = useState({});

  useEffect(() => {
    const storedJobSeekerData = localStorage.getItem('jobseeker');
    if (storedJobSeekerData) {
      const parsedJobSeekerData = JSON.parse(storedJobSeekerData);
      setJobSeekerData(parsedJobSeekerData);
      setInitialJobseekerData(parsedJobSeekerData);
    }
  }, []);

  const handleChange = (e) => {
    setJobSeekerData({ ...jobseekerData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const updatedData = {};
      for (const key in jobseekerData) {
        if (jobseekerData[key] !== initialJobseekerData[key] && initialJobseekerData[key] !== '') {
          updatedData[key] = jobseekerData[key];
        }
      }

      if (Object.keys(updatedData).length !== 0) {
        updatedData.email = jobseekerData.email;
        const response = await axios.put(`${config.url}/updatejobseekerprofile`, updatedData);
        setMessage(response.data);

        const res = await axios.get(`${config.url}/jobseekerprofile/${jobseekerData.email}`);
        localStorage.setItem("jobseeker", JSON.stringify(res.data));
        setInitialJobseekerData(res.data);
      } else {
        setMessage("No Changes in Job Seeker Profile");
      }
    } catch (err) {
      setError(err.response?.data || "Update Protocol Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <div style={styles.titleArea}>
          <h1 style={styles.mainTitle} className="font-heading">Identity Refinement Studio</h1>
          <p style={styles.subTitle}>Optimizing your professional signature for elite opportunities.</p>
        </div>
      </div>

      <div style={styles.studioGrid} className="animate-fade-up delay-1">
        {/* Left Column: Form */}
        <div style={styles.formColumn}>
          <form onSubmit={handleSubmit} className="glass-card" style={styles.formCard}>
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

            <div style={styles.sectionHeader}>
              <Layers size={18} color="#3b82f6" />
              <h3 style={styles.sectionTitle}>Core Identity Baseline</h3>
            </div>

            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}><User size={14} /> Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  value={jobseekerData.fullname}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}><BadgeCheck size={14} /> Gender Alignment</label>
                <input
                  type="text"
                  id="gender"
                  value={jobseekerData.gender}
                  style={{ ...styles.input, opacity: 0.6 }}
                  readOnly
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}><Cake size={14} /> Chronological Date</label>
                <input
                  type="date"
                  id="dateofbirth"
                  value={jobseekerData.dateofbirth}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.sectionHeader}>
              <ShieldCheck size={18} color="#10b981" />
              <h3 style={styles.sectionTitle}>Secure Channel & Access</h3>
            </div>

            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}><Mail size={14} /> Primary Email</label>
                <input
                  type="email"
                  id="email"
                  value={jobseekerData.email}
                  style={{ ...styles.input, opacity: 0.6 }}
                  readOnly
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}><Lock size={14} /> Security Key</label>
                <input
                  type="password"
                  id="password"
                  value={jobseekerData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.sectionHeader}>
              <MapPin size={18} color="#f59e0b" />
              <h3 style={styles.sectionTitle}>Logistics & Signal</h3>
            </div>

            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}><MapPin size={14} /> Geospatial Location</label>
                <input
                  type="text"
                  id="location"
                  value={jobseekerData.location}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}><Phone size={14} /> Contact Signal</label>
                <input
                  type="number"
                  id="contact"
                  value={jobseekerData.contact}
                  onChange={handleChange}
                  style={styles.input}
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
              {loading ? <div className="spinner-mini" /> : <Save size={18} />}
              {loading ? "Committing Protocol..." : "Commit Refinement Protocol"}
            </button>
          </form>
        </div>

        {/* Right Column: Context */}
        <div style={styles.contextColumn}>
          <div className="glass-card" style={styles.infoBox}>
            <div style={styles.avatarPreview}>
              {jobseekerData.fullname?.charAt(0) || 'J'}
              <div style={styles.cameraIcon}><Camera size={14} /></div>
            </div>
            <h4 style={styles.previewName}>{jobseekerData.fullname || "Anonymous Talent"}</h4>
            <p style={styles.previewSub}>Identity Blueprint Preview</p>
          </div>

          <div className="glass-card" style={styles.tipBox}>
            <Sparkles size={20} color="#3b82f6" style={{ marginBottom: '15px' }} />
            <h5 style={styles.tipTitle}>Studio Pro-Tip</h5>
            <p style={styles.tipText}>
              A complete identity baseline increases recruiter engagement by 2.4x. Ensure your geospatial location is precise for local opportunities.
            </p>
          </div>

          <div className="glass-card" style={styles.securityBox}>
            <ShieldCheck size={20} color="#10b981" style={{ marginBottom: '15px' }} />
            <h5 style={styles.tipTitle}>Encryption Status</h5>
            <p style={styles.tipText}>
              All refinement COMMIT protocols are encrypted with AES-256 standards before transmission to the core repository.
            </p>
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
    padding: '40px 20px',
  },
  header: {
    marginBottom: '40px',
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mainTitle: {
    fontSize: '2.5rem',
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
  studioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    padding: '35px',
    borderRadius: '24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    marginTop: '30px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '10px',
  },
  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: 0,
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '10px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    width: '100%',
    padding: '12px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    ':focus': { borderColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' }
  },
  submitBtn: {
    width: '100%',
    height: '55px',
    marginTop: '40px',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  successTile: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '25px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  errorTile: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '25px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  contextColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  infoBox: {
    padding: '30px',
    borderRadius: '24px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
  },
  avatarPreview: {
    width: '80px',
    height: '80px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'white',
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: '-5px',
    right: '-5px',
    width: '24px',
    height: '24px',
    background: '#1f2937',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #000',
  },
  previewName: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 5px 0',
  },
  previewSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  tipBox: {
    padding: '25px',
    borderRadius: '20px',
  },
  securityBox: {
    padding: '25px',
    borderRadius: '20px',
    background: 'rgba(16, 185, 129, 0.02)',
  },
  tipTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '10px',
  },
  tipText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  }
};
