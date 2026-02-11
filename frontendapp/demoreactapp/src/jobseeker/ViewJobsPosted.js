import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import {
  Briefcase, Building2, MapPin, Clock,
  ChevronDown, ChevronUp, FileText, Send,
  Sparkles, Search, Filter, AlertCircle,
  CheckCircle2, Globe, Banknote, GraduationCap,
  User, Calendar, ShieldCheck, Upload
} from 'lucide-react';

export default function ViewJobsPosted() {
  const [jobseekerData, setJobSeekerData] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resume, setResume] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedJobSeekerData = localStorage.getItem('jobseeker');
    if (storedJobSeekerData) {
      setJobSeekerData(JSON.parse(storedJobSeekerData));
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${config.url}/viewjobsbyjobseeker/`);
      setJobs(response.data || []);
    } catch (err) {
      setError("Failed to synchronize with global job repository.");
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async (jobid, jobseekeremail) => {
    if (!resume) {
      setError("Protocol Error: Resume signature required for dispatch.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("jobid", jobid);
      formData.append("jobseekeremail", jobseekeremail);
      formData.append("resume", resume);

      const response = await axios.post(
        `${config.url}/applyjob`,
        formData
      );

      setMessage(response.data);
      setError('');
      setResume(null);
    } catch (error) {
      setError(error.response?.data || "Application Dispatch Failed.");
      setMessage('');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" />
        <p>Synchronizing Global Opportunity Matrix...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <div style={styles.titleArea}>
          <h1 style={styles.mainTitle} className="font-heading">Professional Opportunity Nexus</h1>
          <p style={styles.subTitle}>Synchronizing your ambition with elite institutional roles.</p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.searchBox}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter by role or institution..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
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

      <div style={styles.grid}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div
              key={job.jobid}
              className="glass-card animate-fade-up"
              style={{
                ...styles.card,
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div
                style={styles.cardHeader}
                onClick={() => setExpandedJob(expandedJob === job.jobid ? null : job.jobid)}
              >
                <div style={styles.mainInfo}>
                  <div style={styles.iconBox}>
                    <Briefcase size={22} color="#3b82f6" />
                  </div>
                  <div>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <div style={styles.metaRowCollapsed}>
                      <span style={styles.metaSpan}><Building2 size={12} /> {job.company}</span>
                      <span style={styles.metaSpan}><MapPin size={12} /> {job.location}</span>
                      <span style={styles.metaSpan}><Clock size={12} /> {job.deadline}</span>
                    </div>
                  </div>
                </div>
                <div style={styles.toggleIcon}>
                  {expandedJob === job.jobid ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedJob === job.jobid && (
                <div style={styles.expandedPanel} className="animate-fade-up">
                  <div style={styles.detailsGrid}>
                    <div style={styles.specsColumn}>
                      <div style={styles.specSection}>
                        <h4 style={styles.specTitle}><Sparkles size={14} /> Role Specification</h4>
                        <p style={styles.specText}>{job.description}</p>
                      </div>
                      <div style={styles.specSection}>
                        <h4 style={styles.specTitle}><FileText size={14} /> Critical Requirements</h4>
                        <p style={styles.specText}>{job.requirements}</p>
                      </div>
                      <div style={styles.metaGrid}>
                        <div style={styles.metaFlat}>
                          <GraduationCap size={14} color="#8b5cf6" />
                          <div>
                            <label style={styles.flatLabel}>Education</label>
                            <span style={styles.flatVal}>{job.educationqualifications}</span>
                          </div>
                        </div>
                        <div style={styles.metaFlat}>
                          <Banknote size={14} color="#10b981" />
                          <div>
                            <label style={styles.flatLabel}>Compensation</label>
                            <span style={styles.flatVal}>₹{job.salary}</span>
                          </div>
                        </div>
                        <div style={styles.metaFlat}>
                          <Globe size={14} color="#3b82f6" />
                          <div>
                            <label style={styles.flatLabel}>Type</label>
                            <span style={styles.flatVal}>{job.jobtype}</span>
                          </div>
                        </div>
                        <div style={styles.metaFlat}>
                          <User size={14} color="#f59e0b" />
                          <div>
                            <label style={styles.flatLabel}>Architect</label>
                            <span style={styles.flatVal}>{job.recruiter.fullname}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={styles.actionColumn}>
                      <div style={styles.dispatchCard}>
                        <h4 style={styles.dispatchTitle}>Candidacy Dispatch</h4>
                        <p style={styles.dispatchDesc}>Upload your professional chronicle to initialize interest.</p>

                        <div style={styles.uploadArea}>
                          <Upload size={20} color="var(--text-muted)" />
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResume(e.target.files[0])}
                            style={styles.fileInput}
                          />
                          <span style={styles.fileName}>
                            {resume ? resume.name : "Select PDF/DOCX Signature"}
                          </span>
                        </div>

                        <button
                          onClick={() => applyJob(job.jobid, jobseekerData.email)}
                          className="posh-button posh-button-primary"
                          style={styles.applyBtn}
                        >
                          Commit Application <Send size={16} />
                        </button>

                        <div style={styles.securityNote}>
                          <ShieldCheck size={12} /> Secure Protocol Enabled
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={styles.emptyContainer} className="glass-card">
            <Search size={48} color="rgba(255,255,255,0.05)" />
            <p>No opportunities matching your criteria in the nexus.</p>
          </div>
        )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '50px',
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
  headerActions: {
    display: 'flex',
    gap: '15px',
  },
  searchBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: '14px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '350px',
    height: '50px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    borderRadius: '24px',
    padding: '0',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardHeader: {
    padding: '25px 35px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.02)',
    userSelect: 'none',
  },
  mainInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  iconBox: {
    width: '55px',
    height: '55px',
    borderRadius: '18px',
    background: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
  },
  metaRowCollapsed: {
    display: 'flex',
    gap: '20px',
    marginTop: '6px',
  },
  metaSpan: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600',
  },
  toggleIcon: {
    color: 'var(--text-muted)',
  },
  expandedPanel: {
    padding: '35px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.1)',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
    gap: '40px',
  },
  specsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  specSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  specTitle: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
  },
  specText: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.7',
    margin: 0,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '10px',
  },
  metaFlat: {
    background: 'rgba(255,255,255,0.03)',
    padding: '15px 20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  flatLabel: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginBottom: '2px',
  },
  flatVal: {
    display: 'block',
    fontSize: '0.9rem',
    color: 'white',
    fontWeight: '600',
  },
  actionColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  dispatchCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '30px',
    textAlign: 'center',
  },
  dispatchTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 10px 0',
  },
  dispatchDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '25px',
    lineHeight: '1.5',
  },
  uploadArea: {
    position: 'relative',
    background: 'rgba(255,255,255,0.02)',
    border: '2px dashed var(--glass-border)',
    borderRadius: '16px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    ':hover': { borderColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' }
  },
  fileInput: {
    position: 'absolute',
    inset: 0,
    opacity: 0,
    cursor: 'pointer',
  },
  fileName: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  applyBtn: {
    width: '100%',
    height: '50px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '1rem',
  },
  securityNote: {
    marginTop: '15px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'var(--text-muted)',
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
  emptyContainer: {
    padding: '80px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    color: 'var(--text-muted)',
  }
};
