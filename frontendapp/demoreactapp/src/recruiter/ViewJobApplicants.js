import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

import {
  Users, Target, Search, Filter, Calendar, CheckCircle2, XCircle, Info,
  Download, ExternalLink, Star, Award, ChevronDown, ChevronUp, Clock,
  Mail, Phone, Briefcase, Zap, AlertCircle, X, Sparkles
} from 'lucide-react';


export default function ViewJobApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [message, setMessage] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedJobId, setSelectedJobId] = useState("");

  const [showScreeningModal, setShowScreeningModal] = useState(false);
  const [customSkills, setCustomSkills] = useState('');
  const [minScore, setMinScore] = useState(5);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRecruiterData = localStorage.getItem('recruiter');
    if (storedRecruiterData) {
      const parsedRecruiterData = JSON.parse(storedRecruiterData);
      fetchApplicants(parsedRecruiterData.username);
    }
  }, []);

  const fetchApplicants = async (username) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.url}/viewjobseekers/${username}`);
      if (response.data === 'No job applicants found for this job') {
        setMessage('No active applications found in the system.');
        setApplicants([]);
      } else {
        setApplicants(response.data);
      }
    } catch (error) {
      setMessage('Network error: Unable to sync applicant data.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await axios.post(`${config.url}/changejobstatus`, {
        applicantId,
        status: newStatus
      });

      const storedRecruiterData = localStorage.getItem('recruiter');
      if (storedRecruiterData) {
        const parsedRecruiterData = JSON.parse(storedRecruiterData);
        fetchApplicants(parsedRecruiterData.username);
      }
    } catch (error) {
      alert('Critical: Failed to update candidate status.');
    }
  };

  const handleScheduleInterview = (applicant) => {
    navigate('/recruiter/schedule-meeting', {
      state: {
        application: {
          _id: applicant._id,
          applicantId: {
            email: applicant.jobseekeremail
          },
          jobId: {
            jobid: applicant.jobid
          }
        }
      }
    });
  };

  const handleScreening = async () => {
    try {
      if (applicants.length === 0) return;
      if (!selectedJobId) return;

      const skillsArray = customSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      if (skillsArray.length === 0) return;

      await axios.post(
        `${config.url}/screenresumes`,
        {
          jobid: selectedJobId,
          skills: skillsArray,
          minScore: minScore
        }
      );

      setShowScreeningModal(false);
      setCustomSkills('');

      const recruiter = JSON.parse(localStorage.getItem("recruiter"));
      fetchApplicants(recruiter.username);

    } catch (error) {
      alert("AI Screening Engine Error: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    const parts = dateString.split(' ');
    if (parts.length < 2) return dateString;
    const dateParts = parts[0].split('-');
    const timePart = parts[1];
    const ampm = parts[2];
    const jsDateString = `${dateParts[1]} -${dateParts[0]} -${dateParts[2]} ${timePart} ${ampm} `;
    const date = new Date(jsDateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredApplicants = applicants.filter(applicant => {
    if (filterStatus === 'ALL') return true;
    return applicant.jobStatus === filterStatus;
  });

  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.jobStatus === 'APPLIED').length,
    selected: applicants.filter(a => a.jobStatus === 'SELECTED').length,
    rejected: applicants.filter(a => a.jobStatus === 'REJECTED').length
  };

  return (
    <div style={styles.container}>
      {/* AI Screening Modal */}
      {showScreeningModal && (
        <div style={styles.modalOverlay} onClick={() => setShowScreeningModal(false)}>
          <div className="glass-card animate-fade-up" style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle} className="font-heading">
                <Target size={24} color="#7c3aed" /> Screening Intelligence
              </h3>
              <button onClick={() => setShowScreeningModal(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.jobRef}>
                <span style={styles.refLabel}>Target Position:</span>
                <span style={styles.refValue}>#{selectedJobId}</span>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Required Specialized Skills</label>
                <textarea
                  placeholder="e.g., React, Node.js, Cloud Architecture, Python..."
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  style={styles.modalTextarea}
                />
                <p style={styles.hint}><Info size={12} /> AI will cross-reference these against candidate resumes for scoring.</p>
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.rangeHeader}>
                  <label style={styles.label}>Minimum Talent Coefficient</label>
                  <span style={styles.scoreDisplay}>{minScore}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  style={styles.rangeInput}
                />
                <div style={styles.rangeLabels}>
                  <span>High Volume</span>
                  <span>Elite Precision</span>
                </div>
              </div>

              <button onClick={handleScreening} className="posh-button posh-button-primary" style={styles.startBtn}>
                <Sparkles size={18} /> Initialize AI Screening
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.topHeader} className="animate-fade-up">
        <div style={styles.titleArea}>
          <h1 style={styles.title} className="font-heading">Applicant Command Center</h1>
          <div style={styles.statBadges}>
            <div className="glass-card" style={styles.statBadge}>
              <Users size={14} /> Total: {stats.total}
            </div>
            <div className="glass-card" style={styles.statBadge}>
              <Clock size={14} color="#3b82f6" /> Pending: {stats.pending}
            </div>
            <div className="glass-card" style={styles.statBadge}>
              <CheckCircle2 size={14} color="#10b981" /> Selected: {stats.selected}
            </div>
          </div>
        </div>

        <div style={styles.actionsArea}>
          <div style={styles.jobPicker}>
            <div style={styles.selectIcon}><Search size={16} /></div>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              style={styles.jobSelect}
            >
              <option value="">Select Target Job</option>
              {[...new Set(applicants.map(a => a.jobid))].map(id => (
                <option key={id} value={id}>Ref: #{id}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => selectedJobId ? setShowScreeningModal(true) : alert("Please select a target job.")}
            className="posh-button posh-button-primary"
            style={styles.screenBtn}
          >
            <Target size={18} /> AI Screening
          </button>
        </div>
      </div>

      <div style={styles.filterBar} className="animate-fade-up delay-1">
        <div style={styles.filterGroup}>
          {['ALL', 'APPLIED', 'SELECTED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                ...styles.filterTab,
                borderBottom: filterStatus === status ? '2px solid #3b82f6' : 'none',
                color: filterStatus === status ? 'white' : 'var(--text-muted)',
                opacity: filterStatus === status ? 1 : 0.6
              }}
            >
              {status === 'APPLIED' ? 'Pending' : status}
            </button>
          ))}
        </div>
        <div style={styles.filterInfo}>
          <Filter size={14} /> Refined Result: {filteredApplicants.length}
        </div>
      </div>

      {loading ? (
        <div style={styles.placeholderContainer}>
          <div className="spinner" />
          <p>Synchronizing Applicant Intelligence...</p>
        </div>
      ) : filteredApplicants.length > 0 ? (
        <div style={styles.candidateGrid}>
          {filteredApplicants.map((applicant, index) => (
            <div
              key={applicant._id}
              style={{
                ...styles.candidateTile,
                ...(expandedCard === applicant.applicantId ? styles.tileExpanded : {}), animationDelay: `${index * 0.05} s`
              }}
              className={`glass - card animate - fade - up`}
            >
              <div style={styles.tileMain} onClick={() => setExpandedCard(expandedCard === applicant.applicantId ? null : applicant.applicantId)}>
                <div style={styles.candidateIdentity}>
                  <div style={styles.avatar}>
                    <Users size={20} />
                  </div>
                  <div style={styles.identityText}>
                    <h3 style={styles.candidateName}>{applicant.jobseekername}</h3>
                    <span style={styles.candidateMail}><Mail size={12} /> {applicant.jobseekeremail}</span>
                  </div>
                </div>

                <div style={styles.jobAssignment}>
                  <div style={styles.jobTitleCell}><Briefcase size={14} /> {applicant.jobtitle}</div>
                  <div style={styles.jobRefCell}>Ref: #{applicant.jobid}</div>
                </div>

                <div style={styles.appliedTime}>
                  <Clock size={14} /> {formatDate(applicant.appliedTime)}
                </div>

                <div style={styles.statusCell}>
                  <div style={{
                    ...styles.statusBadge,
                    background: applicant.jobStatus === 'SELECTED' ? 'rgba(16, 185, 129, 0.1)' :
                      applicant.jobStatus === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: applicant.jobStatus === 'SELECTED' ? '#10b981' :
                      applicant.jobStatus === 'REJECTED' ? '#ef4444' : '#3b82f6',
                    borderColor: applicant.jobStatus === 'SELECTED' ? 'rgba(16, 185, 129, 0.3)' :
                      applicant.jobStatus === 'REJECTED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                  }}>
                    {applicant.jobStatus === 'SELECTED' ? <CheckCircle2 size={12} /> :
                      applicant.jobStatus === 'REJECTED' ? <XCircle size={12} /> : <Clock size={12} />}
                    {applicant.jobStatus}
                  </div>
                </div>

                <div style={styles.tileActions} onClick={(e) => e.stopPropagation()}>
                  {applicant.jobStatus === 'APPLIED' && (
                    <div style={styles.triageActions}>
                      <button onClick={() => handleStatusChange(applicant.applicantId, 'SELECTED')} style={styles.iconActionBtn} title="Accept Candidate">
                        <CheckCircle2 size={18} color="#10b981" />
                      </button>
                      <button onClick={() => handleStatusChange(applicant.applicantId, 'REJECTED')} style={styles.iconActionBtn} title="Reject Candidate">
                        <XCircle size={18} color="#ef4444" />
                      </button>
                    </div>
                  )}
                  {applicant.jobStatus === 'SELECTED' && (
                    <button onClick={() => handleScheduleInterview(applicant)} style={styles.scheduleMiniBtn}>
                      <Calendar size={14} /> Interview
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedCard(expandedCard === applicant.applicantId ? null : applicant.applicantId)}
                    style={styles.expandBtn}
                  >
                    {expandedCard === applicant.applicantId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {expandedCard === applicant.applicantId && (
                <div style={styles.tileExpansion}>
                  <div style={styles.expansionGrid}>
                    <div style={styles.contactPanel}>
                      <h4 style={styles.panelTitle}><Info size={14} /> Contact Intelligence</h4>
                      <div style={styles.panelRow}><Phone size={14} /> {applicant.jobseekercontact || "Unlisted"}</div>
                      <div style={styles.panelRow}><Award size={14} /> ID: {applicant.applicantId}</div>
                      <div style={styles.resumeLink}>
                        {applicant.resume ? (
                          <a href={`${config.url}/uploads/${applicant.resume}`} target="_blank" rel="noopener noreferrer" style={styles.downloadBtn}>
                            <Download size={14} /> Review Official Resume < ExternalLink size={12} />
                          </a >
                        ) : (
                          <span style={styles.noResume}><AlertCircle size={14} /> Resume missing from profile</span>
                        )
                        }
                      </div >
                    </div >

                    <div style={styles.scorePanel}>
                      <div style={styles.scoreHeader}>
                        <h4 style={styles.panelTitle}><Zap size={14} /> AI Evaluation</h4>
                        {applicant.shortlisted && <span style={styles.shortlistBadge}><Star size={12} /> High Potential</span>}
                      </div>
                      <div style={styles.evaluationBody}>
                        <div style={styles.scoreCircle}>
                          <span style={styles.mainScore}>{applicant.resumeScore || 0}</span>
                          <span style={styles.scoreMax}>/ 10</span>
                        </div>
                        <div style={styles.evaluationMeta}>
                          <div style={styles.evalTag}><CheckCircle2 size={10} /> Algorithmic Matching</div>
                          {applicant.screenedAt && <div style={styles.evalTime}>Last Screened: {formatDate(applicant.screenedAt)}</div>}
                        </div>
                      </div>
                    </div>
                  </div >
                </div >
              )}
            </div >
          ))}
        </div >
      ) : (
        <div style={styles.emptyContainer} className="glass-card animate-fade-up">
          <Users size={48} color="rgba(255,255,255,0.05)" />
          <p style={styles.emptyText}>{message || 'No candidates match your current filter criteria.'}</p>
        </div>
      )}
    </div >
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '2.4rem',
    fontWeight: '800',
    margin: 0,
    background: 'linear-gradient(135deg, #e0e6ed, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statBadges: {
    display: 'flex',
    gap: '10px',
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 12px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  actionsArea: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  jobPicker: {
    position: 'relative',
    minWidth: '220px',
  },
  selectIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  jobSelect: {
    width: '100%',
    padding: '12px 15px 12px 40px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  },
  screenBtn: {
    height: '45px',
    padding: '0 25px',
    fontSize: '0.95rem',
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 5px',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  filterGroup: {
    display: 'flex',
    gap: '25px',
  },
  filterTab: {
    background: 'none',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: '700',
    padding: '8px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  filterInfo: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  candidateGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  candidateTile: {
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid var(--glass-border)',
  },
  tileMain: {
    display: 'grid',
    gridTemplateColumns: 'minmax(250px, 1fr) 1.2fr 150px 140px 180px',
    alignItems: 'center',
    padding: '20px 25px',
    cursor: 'pointer',
  },
  candidateIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '12px',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: {
    display: 'flex',
    flexDirection: 'column',
  },
  candidateName: {
    fontSize: '1.1rem',
    fontWeight: '800',
    margin: 0,
    color: 'white',
  },
  candidateMail: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  jobAssignment: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  jobTitleCell: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  jobRefCell: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    marginLeft: '22px',
  },
  appliedTime: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusCell: {
    justifySelf: 'center',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '800',
    border: '1px solid',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tileActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  triageActions: {
    display: 'flex',
    gap: '10px',
    background: 'rgba(0,0,0,0.2)',
    padding: '4px 8px',
    borderRadius: '10px',
  },
  iconActionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    ':hover': { transform: 'scale(1.15)' }
  },
  scheduleMiniBtn: {
    background: '#3b82f6',
    border: 'none',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  expandBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'white',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  tileExpansion: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
    padding: '25px 30px',
  },
  expansionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
  },
  panelTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 15px 0',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  panelRow: {
    fontSize: '0.95rem',
    color: 'white',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    opacity: 0.8,
  },
  resumeLink: {
    marginTop: '20px',
  },
  downloadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 18px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#3b82f6',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  scorePanel: {
    background: 'rgba(255,255,255,0.02)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  scoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  shortlistBadge: {
    background: 'rgba(245, 158, 11, 0.1)',
    color: '#f59e0b',
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  evaluationBody: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  scoreCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '4px solid rgba(16, 185, 129, 0.1)',
    borderTopColor: '#10b981',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainScore: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#10b981',
  },
  scoreMax: {
    fontSize: '0.7rem',
    opacity: 0.4,
  },
  evaluationMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  evalTag: {
    fontSize: '0.85rem',
    color: '#10b981',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  evalTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  modal: {
    width: '90%',
    maxWidth: '550px',
    padding: '35px',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  modalTitle: {
    fontSize: '1.6rem',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '5px',
  },
  jobRef: {
    background: 'rgba(124, 58, 237, 0.05)',
    padding: '12px 20px',
    borderRadius: '12px',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  refValue: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#7c3aed',
  },
  inputGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '12px',
  },
  modalTextarea: {
    width: '100%',
    height: '100px',
    padding: '15px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
  },
  hint: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rangeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  scoreDisplay: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#7c3aed',
  },
  rangeInput: {
    width: '100%',
    height: '6px',
    appearance: 'none',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    outline: 'none',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    marginTop: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  startBtn: {
    width: '100%',
    height: '55px',
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #7c3aed, #4719a6)',
  },
  placeholderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'var(--text-muted)',
  },
  emptyContainer: {
    padding: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '400px',
    lineHeight: '1.6',
  }
};
