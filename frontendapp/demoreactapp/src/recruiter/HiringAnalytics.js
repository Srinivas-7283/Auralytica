import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { BarChart3, RefreshCw, Briefcase, Users, CheckCircle, TrendingUp, Zap, Sparkles, Target, ShieldAlert, Clock, Activity, ChevronRight, Lightbulb } from 'lucide-react';

export default function HiringAnalytics() {
    const [insights, setInsights] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const recruiter = JSON.parse(localStorage.getItem('recruiter'));

    const fetchAnalytics = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${config.url}/api/ai/analyze-trends`, {
                recruiterUsername: recruiter?.username,
                timeframe: 'All time',
                userEmail: recruiter?.email
            });
            setData(response.data.data);
            setInsights(response.data.insights);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to sync intelligence data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (recruiter?.username) {
            fetchAnalytics();
        }
    }, []);

    const getPriorityStyles = (level) => {
        const styles = {
            'HIGH': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <ShieldAlert size={14} /> },
            'MEDIUM': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <Clock size={14} /> },
            'LOW': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: <Target size={14} /> }
        };
        return styles[level] || styles['LOW'];
    };

    if (loading) {
        return (
            <div style={styles.loadingWrapper}>
                <div style={styles.spinner} />
                <p style={styles.loadingText} className="font-heading">Synchronizing Intelligence...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer} className="animate-fade-up">
                <div className="glass-card" style={styles.errorCard}>
                    <ShieldAlert size={48} color="#ef4444" />
                    <h3 style={styles.errorTitle}>Synchronization Failure</h3>
                    <p style={styles.errorText}>{error}</p>
                    <button onClick={fetchAnalytics} className="posh-button posh-button-primary" style={styles.retryBtn}>
                        <RefreshCw size={18} /> Re-establish Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header} className="animate-fade-up">
                <div style={styles.titleArea}>
                    <h1 style={styles.title} className="font-heading">
                        <BarChart3 size={32} style={{ color: 'var(--accent-primary)', marginRight: '15px' }} />
                        <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #6366f1, #0ea5e9)' }}>
                            Recruitment Intelligence
                        </span>
                    </h1>
                    <div style={styles.liveIndicator}>
                        <div style={styles.pulse} />
                        Live Analysis System
                    </div>
                </div>
                <button onClick={fetchAnalytics} style={styles.refreshButton} className="glass-card">
                    <RefreshCw size={18} />
                </button>
            </div>

            {data && (
                <div style={styles.metricsWrapper} className="animate-fade-up delay-1">
                    <div style={styles.metricsGrid}>
                        <div className="glass-card" style={styles.metricCard}>
                            <div style={{ ...styles.iconCircle, color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }}>
                                <Briefcase size={24} />
                            </div>
                            <div style={styles.metricInfo}>
                                <div style={styles.metricValue}>{data.totalJobs}</div>
                                <div style={styles.metricLabel}>Positions Managed</div>
                            </div>
                        </div>

                        <div className="glass-card" style={styles.metricCard}>
                            <div style={{ ...styles.iconCircle, color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' }}>
                                <Users size={24} />
                            </div>
                            <div style={styles.metricInfo}>
                                <div style={styles.metricValue}>{data.totalApplicants}</div>
                                <div style={styles.metricLabel}>Total Inbound Flux</div>
                            </div>
                        </div>

                        <div className="glass-card" style={styles.metricCard}>
                            <div style={{ ...styles.iconCircle, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                                <CheckCircle size={24} />
                            </div>
                            <div style={styles.metricInfo}>
                                <div style={styles.metricValue}>{data.selectedApplicants}</div>
                                <div style={styles.metricLabel}>Successful Triage</div>
                            </div>
                        </div>

                        <div className="glass-card" style={styles.metricCard}>
                            <div style={{ ...styles.iconCircle, color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div style={styles.metricInfo}>
                                <div style={styles.metricValue}>{data.conversionRate}</div>
                                <div style={styles.metricLabel}>Funnel Efficiency</div>
                            </div>
                        </div>
                    </div>

                    {/* Skill Matrix */}
                    {data.topSkillsRequested && data.topSkillsRequested.length > 0 && (
                        <div style={styles.matrixArea}>
                            <h3 style={styles.sectionTitle} className="font-heading">
                                <Activity size={20} /> Market Demand Matrix
                            </h3>
                            <div style={styles.matrixGrid}>
                                {data.topSkillsRequested.map((skill, idx) => (
                                    <div key={idx} className="glass-card" style={styles.skillTile}>
                                        <div style={styles.skillIdentity}>
                                            <span style={styles.skillName}>{skill.skill}</span>
                                            <span style={styles.skillTrend}><TrendingUp size={12} /> High Demand</span>
                                        </div>
                                        <div style={styles.skillVolume}>
                                            <div style={styles.volumeBar}>
                                                <div style={{ ...styles.volumeFill, width: `${(skill.count / data.totalJobs) * 100}%` }} />
                                            </div>
                                            <span style={styles.volumeText}>{skill.count} Roles</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {insights && (
                <div style={styles.insightsWrapper} className="animate-fade-up delay-2">
                    {/* Executive Summary */}
                    <div className="glass-card" style={styles.summaryPanel}>
                        <div style={styles.summaryHeader}>
                            <Sparkles size={18} color="#6366f1" />
                            <h3 style={styles.summaryTitle} className="font-heading">AI Executive Synthesis</h3>
                        </div>
                        <p style={styles.summaryText}>{insights.summary}</p>
                    </div>

                    <div style={styles.gridSecondRow}>
                        {/* Key Intelligence */}
                        <div style={styles.patternsArea}>
                            <h3 style={styles.sectionTitle} className="font-heading">
                                <Target size={20} /> Behavioral Patterns
                            </h3>
                            <div style={styles.patternGrid}>
                                {insights.keyPatterns.map((pattern, idx) => (
                                    <div key={idx} className="glass-card" style={styles.patternCard}>
                                        <ChevronRight size={18} color="#6366f1" />
                                        <p style={styles.patternText}>{pattern}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Strategic Action Items */}
                        <div style={styles.actionArea}>
                            <h3 style={styles.sectionTitle} className="font-heading">
                                <Zap size={20} /> Precision Tasks
                            </h3>
                            <div className="glass-card" style={styles.actionContainer}>
                                {insights.actionItems.map((action, idx) => (
                                    <div key={idx} style={styles.actionEntry}>
                                        <div style={styles.actionCheck}><CheckCircle size={14} /></div>
                                        <p style={styles.actionText}>{action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendations Matrix */}
                    <div style={styles.recommendationArea}>
                        <h3 style={styles.sectionTitle} className="font-heading">
                            <Lightbulb size={24} /> Predictive Recommendations
                        </h3>
                        <div style={styles.recGrid}>
                            {insights.recommendations.map((rec, idx) => (
                                <div key={idx} className="glass-card" style={styles.recCard}>
                                    <div style={styles.recHeader}>
                                        <h4 style={styles.recArea} className="font-heading">{rec.area}</h4>
                                        <div style={{ ...styles.pBadge, color: getPriorityStyles(rec.priority).color, background: getPriorityStyles(rec.priority).bg }}>
                                            {getPriorityStyles(rec.priority).icon}
                                            {rec.priority}
                                        </div>
                                    </div>

                                    <div style={styles.recContent}>
                                        <div style={styles.recPoint}>
                                            <span style={styles.recLabel}>Detected Variance:</span>
                                            <p style={styles.recValue}>{rec.issue}</p>
                                        </div>
                                        <div style={styles.recPoint}>
                                            <span style={styles.recLabel}>AI Advised Countermeasure:</span>
                                            <p style={{ ...styles.recValue, color: 'white' }}>{rec.recommendation}</p>
                                        </div>
                                    </div>

                                    <div style={styles.impactBar}>
                                        <div style={styles.impactLabel}>Probabilistic Impact</div>
                                        <div style={styles.impactValue}>{rec.expectedImpact}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
    loadingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid rgba(255,255,255,0.1)',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        marginTop: '20px',
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
    },
    titleArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    title: {
        fontSize: '2.8rem',
        fontWeight: '800',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
    },
    liveIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        background: 'rgba(255,255,255,0.05)',
        padding: '5px 12px',
        borderRadius: '20px',
        width: 'fit-content',
    },
    pulse: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#10b981',
        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
        animation: 'pulse 2s infinite',
    },
    refreshButton: {
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: 'none',
        color: 'white',
    },
    metricsWrapper: {
        marginBottom: '50px',
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '40px',
    },
    metricCard: {
        padding: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    iconCircle: {
        width: '55px',
        height: '55px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    metricInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    metricValue: {
        fontSize: '2rem',
        fontWeight: '800',
        lineHeight: 1.1,
        color: 'var(--text-main)',
    },
    metricLabel: {
        fontSize: '0.8rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginTop: '5px',
    },
    matrixArea: {
        marginBottom: '40px',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '1.6rem',
        fontWeight: '800',
        marginBottom: '25px',
    },
    matrixGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '15px',
    },
    skillTile: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    skillIdentity: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    skillName: {
        fontSize: '1.1rem',
        fontWeight: '700',
    },
    skillTrend: {
        fontSize: '0.7rem',
        color: '#10b981',
        fontWeight: '800',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    skillVolume: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    volumeBar: {
        height: '6px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    volumeFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #6366f1, #0ea5e9)',
        borderRadius: '10px',
    },
    volumeText: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: '600',
    },
    insightsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
    },
    summaryPanel: {
        padding: '40px',
        background: 'rgba(99, 102, 241, 0.05)',
        borderLeft: '5px solid #6366f1',
    },
    summaryHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
    },
    summaryTitle: {
        fontSize: '1.5rem',
        fontWeight: '800',
        margin: 0,
    },
    summaryText: {
        fontSize: '1.1rem',
        lineHeight: '1.8',
        color: 'rgba(255,255,255,0.85)',
        margin: 0,
    },
    gridSecondRow: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '30px',
    },
    patternGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    patternCard: {
        padding: '18px 25px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        background: 'rgba(255,255,255,0.02)',
    },
    patternText: {
        fontSize: '1rem',
        margin: 0,
        color: 'rgba(255,255,255,0.9)',
    },
    actionContainer: {
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
    },
    actionEntry: {
        display: 'flex',
        gap: '15px',
        alignItems: 'flex-start',
    },
    actionCheck: {
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2px',
        flexShrink: 0,
    },
    actionText: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.8)',
        margin: 0,
        lineHeight: '1.5',
    },
    recommendationArea: {
        marginBottom: '40px',
    },
    recGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
    },
    recCard: {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
    },
    recHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recArea: {
        fontSize: '1.3rem',
        fontWeight: '800',
        margin: 0,
    },
    pBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '10px',
        fontSize: '0.75rem',
        fontWeight: '800',
    },
    recContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    recPoint: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    recLabel: {
        fontSize: '0.75rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        opacity: 0.5,
    },
    recValue: {
        fontSize: '1rem',
        lineHeight: '1.5',
        color: 'rgba(255,255,255,0.7)',
        margin: 0,
    },
    impactBar: {
        marginTop: 'auto',
        padding: '15px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    impactLabel: {
        fontSize: '0.8rem',
        fontWeight: '700',
        opacity: 0.6,
    },
    impactValue: {
        fontSize: '0.9rem',
        fontWeight: '800',
        color: '#10b981',
    },
    errorContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
    },
    errorCard: {
        maxWidth: '500px',
        padding: '50px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    errorTitle: {
        fontSize: '1.8rem',
        fontWeight: '800',
        margin: 0,
    },
    errorText: {
        color: 'var(--text-muted)',
        lineHeight: '1.6',
    },
    retryBtn: {
        marginTop: '10px',
        padding: '12px 30px',
    }
};
