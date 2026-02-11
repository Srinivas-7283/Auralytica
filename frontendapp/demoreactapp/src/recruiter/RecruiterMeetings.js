import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from '../config';
import {
  Calendar, Clock, User, Briefcase, Video, XCircle,
  CheckCircle2, AlertCircle, Hourglass, ArrowRight,
  Search, Filter, Plus, Activity, Zap, Play, RotateCcw
} from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
export default function RecruiterMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const recruiter = JSON.parse(localStorage.getItem("recruiter"));

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const res = await axios.get(
        `${config.url}/api/meetings/recruiter?recruiterId=${recruiter._id}`
      );
      setMeetings(res.data || []);
    } catch (err) {
      console.error("Failed to load meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelMeeting = async (meetingId) => {
    if (!window.confirm("Initialize Termination Protocol for this session?")) return;
    try {
      await axios.put(`${config.url}/api/meetings/cancel`, { meetingId });
      loadMeetings();
    } catch (err) {
      alert("Termination Failure: System error.");
    }
  };

  const completeMeeting = async (meetingId) => {
    if (!window.confirm("Finalize this engagement and archive results?")) return;
    try {
      await axios.put(`${config.url}/api/meetings/update-status`, {
        meetingId,
        status: "completed"
      });
      loadMeetings();
    } catch (err) {
      alert("Finalization Failure: Protocol interrupted.");
    }
  };

  const getStatusTheme = (status) => {
    switch (status) {
      case "scheduled": return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'SCHEDULED' };
      case "ongoing": return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: 'IN-PROGRESS' };
      case "completed": return { color: 'var(--text-muted)', bg: 'rgba(255, 255, 255, 0.05)', label: 'ARCHIVED' };
      case "cancelled": return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'TERMINATED' };
      default: return { color: 'var(--text-muted)', bg: 'rgba(255, 255, 255, 0.05)', label: 'UNKNOWN' };
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" />
        <p>Synchronizing Engagement Repository...</p>
      </div>
    );
  }

  const stats = {
    total: meetings.length,
    upcoming: meetings.filter(m => m.status === 'scheduled').length,
    active: meetings.filter(m => m.status === 'ongoing').length
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <div style={styles.titleArea}>
          <h1 style={styles.mainTitle} className="font-heading">Engagement Operations Center</h1>
          <p style={styles.subTitle}>Orchestrating strategic dialogues and talent assessments.</p>
        </div>
        <div style={styles.statsRow}>
          <div className="glass-card" style={styles.statBox}>
            <Activity size={16} color="#3b82f6" />
            <div style={styles.statInfo}>
              <span style={styles.statVal}>{stats.total}</span>
              <span style={styles.statLab}>Total Sessions</span>
            </div>
          </div>
          <div className="glass-card" style={styles.statBox}>
            <Clock size={16} color="#f59e0b" />
            <div style={styles.statInfo}>
              <span style={styles.statVal}>{stats.upcoming}</span>
              <span style={styles.statLab}>Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div style={styles.emptyContainer} className="glass-card animate-fade-up">
          <Calendar size={64} color="rgba(255,255,255,0.05)" />
          <p style={styles.emptyText}>Your engagement pipeline is currently dormant.</p>
          <button onClick={() => navigate('/recruiter/view-job-applicants')} className="posh-button posh-button-primary">
            Initialize First Engagement
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {meetings.map((meeting, index) => {
            const theme = getStatusTheme(meeting.status);
            return (
              <div
                key={meeting._id}
                className="glass-card animate-fade-up"
                style={{
                  ...styles.card,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={{ ...styles.statusTag, color: theme.color, background: theme.bg }}>
                    <div style={{ ...styles.pulse, background: theme.color }} />
                    {theme.label}
                  </div>
                  <h3 style={styles.meetingTitle}>{meeting.meetingTitle}</h3>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.intelRow}>
                    <div style={styles.intelItem}>
                      <User size={14} style={{ marginTop: '2px' }} />
                      <div>
                        <div style={styles.intelLabel}>Candidate Target</div>
                        <div style={styles.intelValue}>{meeting.applicantId?.name || "Unmapped"}</div>
                      </div>
                    </div>
                    <div style={styles.intelItem}>
                      <Briefcase size={14} style={{ marginTop: '2px' }} />
                      <div>
                        <div style={styles.intelLabel}>Job Architecture</div>
                        <div style={styles.intelValue}>{meeting.jobId?.title || "Legacy Role"}</div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.timingRow}>
                    <div style={styles.timingItem}>
                      <Calendar size={14} /> {new Date(meeting.scheduledDate).toLocaleDateString()}
                    </div>
                    <div style={styles.timingItem}>
                      <Clock size={14} /> {new Date(meeting.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={styles.timingItem}>
                      <Hourglass size={14} /> {meeting.duration}m
                    </div>
                  </div>

                  {meeting.status === 'scheduled' && meeting.applicantJoined && (
                    <div style={styles.joinedIndicator} className="animate-pulse">
                      <Zap size={12} fill="#10b981" /> Candidate In-Session Hub
                    </div>
                  )}
                </div>

                <div style={styles.cardFooter}>
                  {meeting.status === "scheduled" && (
                    <>
                      <button
                        onClick={() => navigate(`/meeting/${meeting.meetingRoom}`)}
                        className="posh-button posh-button-primary"
                        style={styles.joinBtn}
                      >
                        <Play size={16} /> Launch Session
                      </button>
                      <button
                        onClick={() => cancelMeeting(meeting._id)}
                        style={styles.cancelBtn}
                        title="Terminate Session"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  {meeting.status === "ongoing" && (
                    <>
                      <button
                        onClick={() => navigate(`/meeting/${meeting.meetingRoom}`)}
                        className="posh-button posh-button-primary"
                        style={{ ...styles.joinBtn, background: '#8b5cf6' }}
                      >
                        <Video size={16} /> Rejoin Dialogue
                      </button>
                      <button
                        onClick={() => completeMeeting(meeting._id)}
                        style={styles.completeBtn}
                        title="Mark as Completed"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </>
                  )}
                  {meeting.status === "completed" && (
                    <div style={styles.archivedLabel}>
                      <ShieldCheck size={16} /> Engagement Archived
                    </div>
                  )}
                  {meeting.status === "cancelled" && (
                    <div style={styles.terminatedLabel}>
                      <XCircle size={16} /> Protocol Terminated
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
    alignItems: 'flex-start',
    marginBottom: '50px',
  },
  titleArea: {
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
  statsRow: {
    display: 'flex',
    gap: '20px',
  },
  statBox: {
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    minWidth: '180px',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statVal: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'white',
  },
  statLab: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: '30px',
  },
  card: {
    borderRadius: '24px',
    padding: '0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    padding: '25px',
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  statusTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '15px',
  },
  pulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  meetingTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
    lineHeight: '1.3',
  },
  cardBody: {
    padding: '25px',
    flex: 1,
  },
  intelRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    marginBottom: '25px',
  },
  intelItem: {
    display: 'flex',
    gap: '15px',
    color: 'var(--text-muted)',
  },
  intelLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '700',
    marginBottom: '2px',
  },
  intelValue: {
    fontSize: '1rem',
    color: 'white',
    fontWeight: '600',
  },
  timingRow: {
    display: 'flex',
    gap: '15px',
    background: 'rgba(255,255,255,0.03)',
    padding: '12px 18px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    alignItems: 'center',
  },
  timingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  joinedIndicator: {
    marginTop: '20px',
    padding: '8px 15px',
    background: 'rgba(16, 185, 129, 0.1)',
    borderRadius: '10px',
    fontSize: '0.8rem',
    color: '#10b981',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardFooter: {
    padding: '20px 25px',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  joinBtn: {
    flex: 1,
    height: '45px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  cancelBtn: {
    width: '45px',
    height: '45px',
    borderRadius: '12px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': { background: '#ef4444', color: 'white' }
  },
  completeBtn: {
    width: '45px',
    height: '45px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  archivedLabel: {
    flex: 1,
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '10px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
  },
  terminatedLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#ef4444',
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '10px',
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
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    maxWidth: '400px',
    lineHeight: '1.6',
  }
};
