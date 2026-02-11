import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import config from '../config';
import {
  Calendar, Clock, User, Mail, Phone, Briefcase, Building2,
  MessageSquare, Send, ChevronLeft, Info, Sparkles, AlertCircle, Hourglass, ShieldCheck
} from 'lucide-react';
import { FileText } from 'lucide-react';

export default function ScheduleMeeting() {
  const location = useLocation();
  const navigate = useNavigate();
  const { application } = location.state || {};

  const [jobDetails, setJobDetails] = useState(null);
  const [applicantDetails, setApplicantDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    meetingTitle: "",
    scheduledDate: "",
    duration: 60,
    notes: ""
  });

  const recruiter = JSON.parse(localStorage.getItem("recruiter"));

  useEffect(() => {
    if (application) {
      loadDetails();
    }
  }, []);

  const loadDetails = async () => {
    try {
      const jobRes = await axios.get(
        `${config.url}/viewjobbyid/${application.jobId.jobid}`
      );
      setJobDetails(jobRes.data);

      const applicantRes = await axios.get(
        `${config.url}/viewjobseekerbyemail/${application.applicantId.email}`
      );
      setApplicantDetails(applicantRes.data);

      setFormData(prev => ({
        ...prev,
        meetingTitle: `Executive Interview: ${jobRes.data.title}`
      }));

      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to load details:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const meetingData = {
      recruiterId: recruiter._id,
      applicantId: applicantDetails._id,
      jobId: application.jobId.jobid,
      applicationId: application._id,
      ...formData
    };

    try {
      const response = await axios.post(`${config.url}/api/meetings/schedule`, meetingData);
      navigate("/recruiter/meetings");
    } catch (err) {
      alert("Engagement Protocol Failure: " + (err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!application) {
    return (
      <div style={styles.errorContainer} className="animate-fade-up">
        <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '20px' }} />
        <h2 style={{ color: 'white', fontSize: '2rem' }}>Protocol Interrupted</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>No application target selected for scheduling.</p>
        <button onClick={() => navigate("/recruiter/view-job-applicants")} className="posh-button posh-button-primary">
          <ChevronLeft size={18} /> Return to Command Center
        </button>
      </div>
    );
  }

  if (loading || !jobDetails || !applicantDetails) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" />
        <p>Synchronizing Candidate Intelligence...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ChevronLeft size={16} /> Protocol Backtrack
        </button>
        <div style={styles.titleArea}>
          <h1 style={styles.mainTitle} className="font-heading">Candidate Engagement Studio</h1>
          <p style={styles.subTitle}>Finalizing strategic interview parameters and outreach.</p>
        </div>
      </div>

      <div style={styles.studioGrid} className="animate-fade-up delay-1">
        {/* Left Column: Candidate Intel */}
        <div style={styles.intelColumn}>
          <div className="glass-card" style={styles.intelCard}>
            <h3 style={styles.sectionTitle}><User size={18} /> Candidate Intelligence</h3>
            <div style={styles.candidateProfile}>
              <div style={styles.avatarLarge}>
                <User size={40} />
              </div>
              <div style={styles.profileText}>
                <h2 style={styles.candidateName}>{applicantDetails.name}</h2>
                <span style={styles.candidateEmail}><Mail size={12} /> {applicantDetails.email}</span>
                <span style={styles.candidatePhone}><Phone size={12} /> {applicantDetails.contact}</span>
              </div>
            </div>

            <div style={styles.roleContext}>
              <div style={styles.contextItem}>
                <div style={styles.contextIcon}><Briefcase size={14} /></div>
                <div>
                  <div style={styles.contextLabel}>Target Architecture</div>
                  <div style={styles.contextValue}>{jobDetails.title}</div>
                </div>
              </div>
              <div style={styles.contextItem}>
                <div style={styles.contextIcon}><Building2 size={14} /></div>
                <div>
                  <div style={styles.contextLabel}>Organization</div>
                  <div style={styles.contextValue}>{jobDetails.company}</div>
                </div>
              </div>
            </div>

            <div style={styles.idChip}>
              <Info size={12} /> Application Ref: #{application._id.slice(-8)}
            </div>
          </div>

          <div className="glass-card" style={styles.tipPanel}>
            <Sparkles size={24} color="#3b82f6" style={{ marginBottom: '15px' }} />
            <h4 style={styles.tipTitle}>Engagement Best Practice</h4>
            <p style={styles.tipText}>
              Candidates are 60% more likely to join if the interview is scheduled within 48 hours of application triage.
            </p>
          </div>
        </div>

        {/* Right Column: Scheduling Form */}
        <div style={styles.formColumn}>
          <form onSubmit={handleSubmit} className="glass-card" style={styles.formCard}>
            <h3 style={styles.sectionTitle}><Clock size={18} /> Engagement Parameters</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}><MessageSquare size={14} /> Event Title</label>
              <input
                type="text"
                value={formData.meetingTitle}
                onChange={(e) => setFormData({ ...formData, meetingTitle: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}><Calendar size={14} /> Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  style={styles.input}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}><Hourglass size={14} /> Interval</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  style={styles.select}
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes</option>
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}><FileText size={14} /> Briefing Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={styles.textarea}
                placeholder="Include prerequisite technical assessments or briefing links..."
                rows={4}
              />
            </div>

            <div style={styles.complianceNote}>
              <ShieldCheck size={14} /> Automatic email dispatch with secure meeting credentials will be initialized.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="posh-button posh-button-primary"
              style={styles.submitBtn}
            >
              {submitting ? <div className="spinner-mini" /> : <Send size={18} />}
              {submitting ? "Initializing Dispatch..." : "Execute & Send Invitation"}
            </button>
          </form>
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
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '0',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
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
    gridTemplateColumns: 'minmax(350px, 1fr) 1.5fr',
    gap: '40px',
  },
  intelColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  intelCard: {
    padding: '35px',
    borderRadius: '24px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    margin: '0 0 30px 0',
    fontWeight: '800',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  candidateProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '35px',
  },
  avatarLarge: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  candidateName: {
    fontSize: '1.6rem',
    fontWeight: '800',
    margin: 0,
    color: 'white',
  },
  candidateEmail: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  candidatePhone: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  roleContext: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '25px 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '20px',
  },
  contextItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  contextIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  },
  contextLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  contextValue: {
    fontSize: '0.95rem',
    color: 'white',
    fontWeight: '600',
  },
  idChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    background: 'rgba(0,0,0,0.2)',
    padding: '6px 14px',
    borderRadius: '10px',
  },
  tipPanel: {
    padding: '30px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%)',
  },
  tipTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '12px',
  },
  tipText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    padding: '35px',
    borderRadius: '24px',
  },
  inputGroup: {
    marginBottom: '25px',
  },
  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '25px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    ':focus': { borderColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' }
  },
  select: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    appearance: 'none',
  },
  textarea: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
  },
  complianceNote: {
    background: 'rgba(16, 185, 129, 0.05)',
    padding: '15px 20px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '30px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
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
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'var(--text-muted)',
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
