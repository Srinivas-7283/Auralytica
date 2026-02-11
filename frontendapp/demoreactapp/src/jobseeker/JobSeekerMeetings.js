import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Clock, Video, Briefcase, Building2,
  MessageSquare, Hourglass, CheckCircle2,
  AlertCircle, Play, Info, Sparkles, ShieldCheck
} from "lucide-react";

export default function JobSeekerMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const jobseeker = JSON.parse(localStorage.getItem("jobseeker"));

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const res = await axios.get(
        `${config.url}/api/meetings/applicant?applicantId=${jobseeker._id}`
      );
      setMeetings(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load meetings:", err);
      setLoading(false);
    }
  };

  const statusTheme = (status) => {
    switch (status) {
      case "scheduled": return { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", label: "PROTOCOL SCHEDULED" };
      case "ongoing": return { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", label: "SESSION ACTIVE" };
      case "completed": return { color: "var(--text-muted)", bg: "rgba(255, 255, 255, 0.05)", label: "COVENANT FINALIZED" };
      case "cancelled": return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", label: "MISSION ABORTED" };
      default: return { color: "var(--text-muted)", bg: "rgba(0,0,0,0.1)", label: status.toUpperCase() };
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

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <div style={styles.titleArea}>
          <h1 style={styles.mainTitle} className="font-heading">Interview Engagement Hub</h1>
          <p style={styles.subTitle}>Synchronizing live dialogue with elite institutional evaluators.</p>
        </div>
        <div style={styles.metricsRow}>
          <div className="glass-card" style={styles.metricBox}>
            <Video size={16} color="#3b82f6" />
            <span style={styles.statVal}>{meetings.filter(m => m.status === 'scheduled').length} Future Encounters</span>
          </div>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div style={styles.emptyContainer} className="glass-card animate-fade-up">
          <Calendar size={64} color="rgba(255,255,255,0.05)" />
          <p style={styles.emptyText}>No dialogue invitations detected in your current orbit.</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>You'll be notified via secure channel when a synchronization is initialized.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {meetings.map((meeting, index) => {
            const theme = statusTheme(meeting.status);
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
                  <div style={{ ...styles.badge, color: theme.color, background: theme.bg }}>
                    <Clock size={12} /> {theme.label}
                  </div>
                  <h3 style={styles.meetingTitle}>{meeting.meetingTitle}</h3>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <div style={styles.infoItem}>
                      <Building2 size={16} color="var(--text-muted)" />
                      <div>
                        <label style={styles.infoLab}>Institutional Entity</label>
                        <span style={styles.infoVal}>{meeting.jobId?.company}</span>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <Briefcase size={16} color="var(--text-muted)" />
                      <div>
                        <label style={styles.infoLab}>Target Architecture</label>
                        <span style={styles.infoVal}>{meeting.jobId?.title}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.temporalGrid}>
                    <div style={styles.tempBox}>
                      <Calendar size={14} color="#3b82f6" />
                      <span>{new Date(meeting.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.tempBox}>
                      <Clock size={14} color="#3b82f6" />
                      <span>{new Date(meeting.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={styles.tempBox}>
                      <Hourglass size={14} color="#3b82f6" />
                      <span>{meeting.duration} Minutes</span>
                    </div>
                  </div>

                  {meeting.notes && (
                    <div style={styles.notesArea}>
                      <MessageSquare size={14} color="var(--text-muted)" />
                      <p style={styles.notesText}>{meeting.notes}</p>
                    </div>
                  )}
                </div>

                <div style={styles.cardFooter}>
                  {meeting.status === "scheduled" && (
                    <button
                      onClick={() => {
                        if (!meeting.recruiterJoined) return;
                        navigate(`/meeting/${meeting.meetingRoom}`);
                      }}
                      className="posh-button"
                      style={{
                        ...styles.joinBtn,
                        background: meeting.recruiterJoined ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)",
                        cursor: meeting.recruiterJoined ? "pointer" : "not-allowed",
                        opacity: meeting.recruiterJoined ? 1 : 0.6
                      }}
                    >
                      {meeting.recruiterJoined ? (
                        <>Launch Session Portal <Play size={16} /></>
                      ) : (
                        <>Awaiting Interviewer... <Hourglass size={16} className="animate-spin" /></>
                      )}
                    </button>
                  )}
                  {meeting.status === "ongoing" && (
                    <button
                      onClick={() => navigate(`/meeting/${meeting.meetingRoom}`)}
                      className="posh-button posh-button-primary"
                      style={styles.joinBtn}
                    >
                      Restore Dialogue Channel <Video size={16} />
                    </button>
                  )}
                  {meeting.status === "completed" && (
                    <div style={styles.finalState}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span>Session Finalized: Dialogue Concluded.</span>
                    </div>
                  )}
                  {meeting.status === "cancelled" && (
                    <div style={{ ...styles.finalState, color: '#ef4444' }}>
                      <AlertCircle size={16} />
                      <span>Mission Aborted by Institutional Protocol.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={styles.securityFooter} className="animate-fade-up delay-4">
        <ShieldCheck size={14} />
        <span>All dialogue channels are encrypted via Jitsi Secure Tunnel Protocol (v2.4)</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px"
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
  metricsRow: {
    display: 'flex',
    gap: '15px',
  },
  metricBox: {
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'white',
  },
  statVal: {
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "25px"
  },
  card: {
    borderRadius: "24px",
    padding: "0",
    overflow: "hidden",
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    padding: "30px",
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: '15px'
  },
  meetingTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: 'white',
    margin: 0
  },
  cardBody: {
    padding: "30px",
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    flex: 1
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  infoLab: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  infoVal: {
    display: 'block',
    fontSize: '0.95rem',
    color: 'white',
    fontWeight: '600'
  },
  temporalGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr',
    gap: '12px'
  },
  tempBox: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.85rem',
    color: 'white',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  notesArea: {
    background: 'rgba(59, 130, 246, 0.03)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    borderRadius: '16px',
    padding: '15px 20px',
    display: 'flex',
    gap: '15px'
  },
  notesText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    margin: 0,
    fontStyle: 'italic'
  },
  cardFooter: {
    padding: "20px 30px 30px",
  },
  joinBtn: {
    width: '100%',
    height: '50px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    border: 'none',
    color: 'white'
  },
  finalState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: '#10b981',
    fontWeight: '700',
    fontSize: '0.9rem',
    background: 'rgba(16, 185, 129, 0.05)',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid rgba(16, 185, 129, 0.1)'
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: 'var(--text-muted)'
  },
  emptyContainer: {
    padding: '100px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  emptyText: {
    fontSize: '1.2rem',
    color: 'white',
    fontWeight: '700'
  },
  securityFooter: {
    marginTop: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    opacity: 0.6
  }
};
