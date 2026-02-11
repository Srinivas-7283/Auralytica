import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import {
    Briefcase, Building2, Calendar, Clock, Info,
    CheckCircle2, XCircle, AlertCircle,
    Sparkles, Zap, Video, Terminal
} from 'lucide-react';

export default function ViewAppliedJobs() {
    const [jobseekerData, setJobSeekerData] = useState("");
    const [jobApplicants, setJobApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedJobSeekerData = localStorage.getItem('jobseeker');
        if (storedJobSeekerData) {
            const parsedJobSeekerData = JSON.parse(storedJobSeekerData);
            setJobSeekerData(parsedJobSeekerData);
        }
    }, []);

    useEffect(() => {
        if (jobseekerData) {
            fetchJobApplicants();
        }
    }, [jobseekerData]);

    const fetchJobApplicants = async () => {
        try {
            const response = await axios.get(`${config.url}/appliedjobs/${jobseekerData.email}`);
            setJobApplicants(response.data || []);
        } catch (error) {
            setError(error.response?.data || "Synchronization Protocol Failed");
        } finally {
            setLoading(false);
        }
    }

    const getStatusTheme = (status) => {
        switch (status) {
            case 'SELECTED': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: CheckCircle2, label: 'SELECTED' };
            case 'REJECTED': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: XCircle, label: 'TERMINATED' };
            case 'INTERVIEW-SCHEDULED': return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: Calendar, label: 'ENGAGEMENT' };
            case 'SCREENED': return { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', icon: Zap, label: 'SCREENED' };
            default: return { color: 'var(--text-muted)', bg: 'rgba(255, 255, 255, 0.05)', icon: Info, label: 'APPLIED' };
        }
    };

    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <div className="spinner" />
                <p>Synchronizing Application Intel...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header} className="animate-fade-up">
                <div style={styles.titleArea}>
                    <h1 style={styles.mainTitle} className="font-heading">Application History Command</h1>
                    <p style={styles.subTitle}>Tracking your career trajectory and strategic outreach.</p>
                </div>
                <div style={styles.statsRow}>
                    <div className="glass-card" style={styles.statBox}>
                        <Terminal size={16} color="#3b82f6" />
                        <span style={styles.statVal}>{jobApplicants.length} Active Missions</span>
                    </div>
                </div>
            </div>

            {error && (
                <div style={styles.errorTile} className="animate-fade-up">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {jobApplicants.length === 0 ? (
                <div style={styles.emptyContainer} className="glass-card animate-fade-up">
                    <Briefcase size={64} color="rgba(255,255,255,0.05)" />
                    <p style={styles.emptyText}>No active application missions found in your chronicle.</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {jobApplicants.map((applicant, index) => {
                        const theme = getStatusTheme(applicant.jobStatus);
                        const StatusIcon = theme.icon;
                        return (
                            <div
                                key={index}
                                className="glass-card animate-fade-up"
                                style={{
                                    ...styles.card,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div style={styles.cardHeader}>
                                    <div style={styles.roleInfo}>
                                        <div style={styles.iconContainer}>
                                            <Briefcase size={24} color="#3b82f6" />
                                        </div>
                                        <div>
                                            <h3 style={styles.jobTitle}>{applicant.jobtitle}</h3>
                                            <p style={styles.companyName}><Building2 size={12} /> {applicant.company}</p>
                                        </div>
                                    </div>
                                    <div style={{ ...styles.statusTag, color: theme.color, background: theme.bg, borderColor: theme.color }}>
                                        <StatusIcon size={12} /> {theme.label}
                                    </div>
                                </div>

                                <div style={styles.cardBody}>
                                    <div style={styles.metaRow}>
                                        <div style={styles.metaItem}>
                                            <Info size={12} /> Ref ID: {applicant.jobid}
                                        </div>
                                        <div style={styles.metaItem}>
                                            <Calendar size={12} /> {applicant.appliedTime}
                                        </div>
                                    </div>

                                    <div style={styles.statusMessageArea}>
                                        {applicant.jobStatus === 'SELECTED' && (
                                            <p style={{ ...styles.statusMsg, color: '#10b981' }}>
                                                <Sparkles size={14} /> Mission Accomplished: Selection Protocol Initialized.
                                            </p>
                                        )}

                                        {applicant.jobStatus === 'INTERVIEW-SCHEDULED' && (
                                            <div style={styles.interviewAlert}>
                                                <p style={styles.interviewText}>
                                                    <Calendar size={14} /> Engagement Scheduled: Dialogue Window Open.
                                                </p>
                                                <button
                                                    onClick={() => window.location.href = '/jobseeker/meetings'}
                                                    className="posh-button posh-button-primary"
                                                    style={styles.joinBtn}
                                                >
                                                    View Invitation & Join <Video size={16} />
                                                </button>
                                            </div>
                                        )}

                                        {applicant.jobStatus === 'REJECTED' && (
                                            <p style={{ ...styles.statusMsg, color: '#ef4444' }}>
                                                <XCircle size={14} /> Mission Terminated: Seeking Alternative Trajectories.
                                            </p>
                                        )}

                                        {(applicant.jobStatus === 'APPLIED' || applicant.jobStatus === 'SCREENED' || !applicant.jobStatus) && (
                                            <p style={styles.statusMsg}>
                                                <Clock size={14} /> Triage Phase: Intelligence Processing...
                                            </p>
                                        )}
                                    </div>
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
        maxWidth: '1200px',
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
    statsRow: {
        display: 'flex',
        gap: '15px',
    },
    statBox: {
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
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
    },
    card: {
        borderRadius: '24px',
        padding: '0',
        overflow: 'hidden',
    },
    cardHeader: {
        padding: '25px',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    roleInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    iconContainer: {
        width: '50px',
        height: '50px',
        borderRadius: '15px',
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
    companyName: {
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '4px 0 0 0',
    },
    statusTag: {
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '800',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: '1px solid transparent',
    },
    cardBody: {
        padding: '25px',
    },
    metaRow: {
        display: 'flex',
        gap: '25px',
        marginBottom: '20px',
    },
    metaItem: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
    },
    statusMessageArea: {
        marginTop: '15px',
    },
    statusMsg: {
        fontSize: '1rem',
        color: 'var(--text-muted)',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: '600',
    },
    interviewAlert: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(59, 130, 246, 0.05)',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
    },
    interviewText: {
        color: '#3b82f6',
        fontWeight: '700',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    joinBtn: {
        height: '45px',
        padding: '0 25px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    loaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: 'var(--text-muted)',
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
        padding: '100px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    emptyText: {
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
    }
};
