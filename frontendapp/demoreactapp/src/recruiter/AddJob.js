import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import {
  Briefcase, Building2, MapPin, Calendar, Clock, DollarSign,
  FileText, GraduationCap, Zap, Mail, Plus, Send,
  Info, ShieldCheck, Sparkles, Layout, Layers, Package,
  CheckCircle2, AlertCircle, ChevronRight
} from 'lucide-react';

export default function AddJob() {
  const [recruiterData, setRecruiterData] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedRecruiterData = localStorage.getItem('recruiter');
    if (storedRecruiterData) {
      const parsedRecruiterData = JSON.parse(storedRecruiterData);
      setRecruiterData(parsedRecruiterData);
    }
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    roles: [],
    location: '',
    salary: '',
    jobtype: '',
    educationqualifications: '',
    requirements: '',
    email: '',
    deadline: '',
    recruiter: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRolesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, roles: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${config.url}/addjob`, {
        ...formData,
        recruiter: recruiterData,
        company: recruiterData.company
      });
      if (response.status === 200) {
        setFormData({
          title: '',
          description: '',
          company: '',
          roles: [],
          location: '',
          salary: '',
          jobtype: '',
          educationqualifications: '',
          requirements: '',
          email: '',
          deadline: '',
          recruiter: ''
        });
        setMessage("Architectural Role Published Successfully.");
        setError("");
      }
    } catch (error) {
      setError(error.response?.data || "System error: Unable to publish role.");
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <div style={styles.titleSection}>
          <h1 style={styles.mainTitle} className="font-heading">Job Architecture Studio</h1>
          <p style={styles.subTitle}>Drafting precision roles for the next generation of talent.</p>
        </div>
        <div style={styles.branding}>
          <div className="glass-card" style={styles.brandBadge}>
            <Building2 size={16} /> {recruiterData.company || "Enterprise"}
          </div>
        </div>
      </div>

      {(message || error) && (
        <div className="animate-fade-up" style={{
          ...styles.notification,
          background: message ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderColor: message ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          color: message ? '#10b981' : '#ef4444'
        }}>
          {message ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message || error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.studioGrid} className="animate-fade-up delay-1">
        {/* Left Column: Form Configuration */}
        <div style={styles.formColumn}>
          <div className="glass-card" style={styles.formSection}>
            <h3 style={styles.sectionTitle}><Layout size={18} /> Role Foundations</h3>
            <div style={styles.inputGrid}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}><Briefcase size={14} /> Professional Title</label>
                <input
                  type="text" id="title" placeholder="e.g., Lead Cloud Architect"
                  value={formData.title} onChange={handleChange} required style={styles.input}
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}><MapPin size={14} /> Strategic Location</label>
                <input
                  type="text" id="location" placeholder="e.g., Remote / New York"
                  value={formData.location} onChange={handleChange} required style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}><FileText size={14} /> Strategic Description</label>
              <textarea
                id="description" placeholder="Define the core mission and scope of this role..."
                value={formData.description} onChange={handleChange} required style={styles.textarea}
              />
            </div>

            <div style={styles.inputGrid}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}><Package size={14} /> Engagement Type</label>
                <select id="jobtype" value={formData.jobtype} onChange={handleChange} required style={styles.select}>
                  <option value="">Select Contract</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}><DollarSign size={14} /> Compensation (Annual)</label>
                <input
                  type="number" id="salary" placeholder="Amount in USD"
                  value={formData.salary} onChange={handleChange} required style={styles.input}
                />
              </div>
            </div>
          </div>

          <div className="glass-card" style={styles.formSection}>
            <h3 style={styles.sectionTitle}><Zap size={18} /> Intelligence Requirements</h3>
            <div style={styles.inputWrapper}>
              <label style={styles.label}><Layers size={14} /> Core Skill Domains (Multiple)</label>
              <select id="roles" value={formData.roles} onChange={handleRolesChange} multiple required style={styles.multiSelect}>
                <option value="Software Engineer">Software Engineering</option>
                <option value="System Engineer">Systems Architecture</option>
                <option value="Technical Support">Technical Operations</option>
                <option value="Testing">Quality Intelligence</option>
                <option value="Others">Specialized Domains</option>
              </select>
              <p style={styles.hint}>Hold Ctrl/Cmd to select multiple domains.</p>
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}><GraduationCap size={14} /> Educational Credentials</label>
              <textarea
                id="educationqualifications" placeholder="e.g., MS in Computer Science, Ph.D. Preferred..."
                value={formData.educationqualifications} onChange={handleChange} required style={styles.textareaSmall}
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}><Sparkles size={14} /> Specialized Skills (Keywords)</label>
              <textarea
                id="requirements" placeholder="e.g., React, Go, Kubernetes, AWS, Zero-Trust..."
                value={formData.requirements} onChange={handleChange} required style={styles.textareaSmall}
              />
            </div>
          </div>

          <div className="glass-card" style={styles.formSection}>
            <h3 style={styles.sectionTitle}><Clock size={18} /> Logistics & Outreach</h3>
            <div style={styles.inputGrid}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}><Mail size={14} /> Communication Email</label>
                <input
                  type="email" id="email" placeholder="hiring@enterprise.com"
                  value={formData.email} onChange={handleChange} required style={styles.input}
                />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}><Calendar size={14} /> Application Deadline</label>
                <input
                  type="date" id="deadline"
                  value={formData.deadline} onChange={handleChange} required style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button type="submit" disabled={loading} className="posh-button posh-button-primary" style={styles.submitBtn}>
              {loading ? <div className="spinner-mini" /> : <Send size={18} />}
              {loading ? "Initializing..." : "Publish Job Architecture"}
            </button>
          </div>
        </div>

        {/* Right Column: Architectural Insights */}
        <div style={styles.infoColumn}>
          <div className="glass-card" style={styles.infoPanel}>
            <h4 style={styles.infoTitle}><Info size={16} /> Architectural Context</h4>
            <div style={styles.contextItem}>
              <ChevronRight size={14} color="#3b82f6" />
              <p><strong>Clarity Wins:</strong> Detailed descriptions increase applicant quality by 45%.</p>
            </div>
            <div style={styles.contextItem}>
              <ChevronRight size={14} color="#3b82f6" />
              <p><strong>Domain Precision:</strong> Selecting accurate skill domains optimizes our AI matching engine.</p>
            </div>
            <div style={styles.contextItem}>
              <ChevronRight size={14} color="#3b82f6" />
              <p><strong>Deadline Strategy:</strong> Short deadlines create urgency; long ones build large talent pools.</p>
            </div>
          </div>

          <div className="glass-card" style={styles.livePreview}>
            <h4 style={styles.infoTitle}><ShieldCheck size={16} /> Studio Compliance</h4>
            <div style={styles.progressHeader}>
              <span>Field Completion</span>
              <span>{Object.values(formData).filter(v => v.length > 0 || (Array.isArray(v) && v.length > 0)).length} / 11</span>
            </div>
            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: `${(Object.values(formData).filter(v => v.length > 0 || (Array.isArray(v) && v.length > 0)).length / 11) * 100}%`
              }} />
            </div>
            <ul style={styles.checklist}>
              <li style={{ color: formData.title ? '#10b981' : 'var(--text-muted)' }}>
                {formData.title ? <CheckCircle2 size={12} /> : <div style={styles.dot} />} Title Defined
              </li>
              <li style={{ color: formData.description ? '#10b981' : 'var(--text-muted)' }}>
                {formData.description ? <CheckCircle2 size={12} /> : <div style={styles.dot} />} Description Composed
              </li>
              <li style={{ color: formData.roles.length > 0 ? '#10b981' : 'var(--text-muted)' }}>
                {formData.roles.length > 0 ? <CheckCircle2 size={12} /> : <div style={styles.dot} />} Domains Mapped
              </li>
              <li style={{ color: formData.deadline ? '#10b981' : 'var(--text-muted)' }}>
                {formData.deadline ? <CheckCircle2 size={12} /> : <div style={styles.dot} />} Timeline Established
              </li>
            </ul>
          </div>

          <div className="glass-card" style={styles.aiTip}>
            <Sparkles size={24} color="#7c3aed" style={{ marginBottom: '15px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 10px 0' }}>AI Drafting Pro-Tip</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Use our <strong>AI Job Description Architect</strong> tool to generate a professional baseline, then refine the architecture here for maximum precision.
            </p>
          </div>
        </div>
      </form>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  titleSection: {
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
  brandBadge: {
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
  },
  notification: {
    padding: '15px 25px',
    borderRadius: '16px',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '1rem',
    fontWeight: '600',
    border: '1px solid',
  },
  studioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  formSection: {
    padding: '30px',
    borderRadius: '24px',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    margin: '0 0 25px 0',
    fontWeight: '800',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  input: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    ':focus': { borderColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' }
  },
  textarea: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    height: '150px',
    resize: 'none',
  },
  textareaSmall: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    height: '80px',
    resize: 'none',
  },
  select: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    appearance: 'none',
  },
  multiSelect: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    height: '110px',
  },
  hint: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  submitBtn: {
    width: '100%',
    height: '60px',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  infoPanel: {
    padding: '25px',
    borderRadius: '20px',
  },
  infoTitle: {
    fontSize: '1rem',
    margin: '0 0 20px 0',
    fontWeight: '800',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  contextItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '15px',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: 'var(--text-main)',
  },
  livePreview: {
    padding: '25px',
    borderRadius: '20px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    marginBottom: '10px',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
    transition: 'width 0.4s ease',
  },
  checklist: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  dot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'currentColor',
  },
  aiTip: {
    padding: '25px',
    borderRadius: '20px',
    border: '1px solid rgba(124, 58, 237, 0.2)',
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(79, 70, 229, 0.05) 100%)',
  }
};
