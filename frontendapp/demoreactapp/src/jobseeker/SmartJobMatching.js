import { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import {
    Target, Sparkles, FileText, Zap,
    TrendingUp, ShieldCheck, Search, Activity,
    Layers, Cpu, Layout, Info, ChevronRight,
    Star, Award, Briefcase, Building2
} from 'lucide-react';
import { AlertCircle } from 'lucide-react';
export default function SmartJobMatching() {
    const [resumeText, setResumeText] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [preferences, setPreferences] = useState('');
    const [matches, setMatches] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const jobseeker = JSON.parse(localStorage.getItem('jobseeker'));
    const navigate = useNavigate();

    const handleMatch = async () => {
        if (!resumeText && !skills) {
            setError('Protocol Error: Provide professional narrative or competency clusters.');
            return;
        }

        setLoading(true);
        setError('');
        setMatches(null);

        try {
            const response = await axios.post(`${config.url}/api/ai/match-jobs`, {
                resumeText,
                skills: skills ? skills.split(',').map(s => s.trim()) : [],
                experience,
                preferences,
                userEmail: jobseeker?.email || 'anonymous'
            });

            setMatches(response.data.matches);
        } catch (err) {
            setError(err.response?.data?.error || 'Matrix Synchronization Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header} className="animate-fade-up">
                <div style={styles.titleArea}>
                    <h1 style={styles.mainTitle} className="font-heading">Opportunity Intelligence Matrix</h1>
                    <p style={styles.subTitle}>Synchronizing live market data with your professional fingerprint.</p>
                </div>
            </div>

            <div className="glass-card animate-fade-up" style={styles.formCard}>
                <div style={styles.studioHeader}>
                    <Cpu size={20} color="#3b82f6" />
                    <h3 style={styles.studioTitle}>Profile Synthesis Studio</h3>
                </div>

                <div style={styles.inputSection}>
                    <label style={styles.label}><FileText size={14} /> Professional Narrative (Resume)</label>
                    <textarea
                        style={styles.textarea}
                        rows="6"
                        placeholder="Paste your resume or describe your professional trajectory in detail..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                    />
                </div>

                <div style={styles.studioRow}>
                    <div style={styles.inputSection}>
                        <label style={styles.label}><Layers size={14} /> Competency Clusters (Skills)</label>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder="e.g., React, Node.js, Strategy, Leadership"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>

                    <div style={styles.inputSection}>
                        <label style={styles.label}><Activity size={14} /> Experience Baseline</label>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder="e.g., 5+ Years Senior Engineering"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ ...styles.inputSection, marginBottom: '30px' }}>
                    <label style={styles.label}><Target size={14} /> Aspirational Vector (Preferences)</label>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder="e.g., Remote-first, Fintech sector, Series B startup"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                    />
                </div>

                {error && (
                    <div style={styles.errorTile} className="animate-fade-up">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <button
                    onClick={handleMatch}
                    disabled={loading}
                    className="posh-button posh-button-primary"
                    style={styles.submitBtn}
                >
                    {loading ? <div className="spinner-mini" /> : <TrendingUp size={18} />}
                    {loading ? 'Analyzing Market Vectors...' : 'Synthesize Matrix Intelligence'}
                </button>
            </div>

            {matches && (
                <div style={styles.resultsContainer} className="animate-fade-up">
                    <div style={styles.resultsHeader}>
                        <Layout size={24} color="#3b82f6" />
                        <h2 style={styles.resultsTitle} className="font-heading">AI-Synthesized Opportunities</h2>
                    </div>

                    {matches.length > 0 ? (
                        <div style={styles.matchGrid}>
                            {matches.map((match, idx) => (
                                <div
                                    key={idx}
                                    className="glass-card animate-fade-up"
                                    style={{ ...styles.matchCard, animationDelay: `${idx * 0.1}s` }}
                                >
                                    <div style={styles.matchHeader}>
                                        <div style={styles.matchIdentity}>
                                            <div style={styles.jobIconBox}>
                                                <Briefcase size={20} color="#3b82f6" />
                                            </div>
                                            <div>
                                                <h4 style={styles.jobTitle}>{match.jobTitle}</h4>
                                                <p style={styles.company}><Building2 size={12} /> {match.company}</p>
                                            </div>
                                        </div>
                                        <div style={styles.scoreContainer}>
                                            <div style={styles.scoreCircle}>
                                                <span style={styles.scoreVal}>{match.matchScore}%</span>
                                                <span style={styles.scoreLab}>SYNC</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.matchBody}>
                                        <div style={styles.rationaleSec}>
                                            <h5 style={styles.secLabel}><Zap size={12} color="#f59e0b" /> Match Rationale</h5>
                                            <div style={styles.reasonsList}>
                                                {match.matchReasons?.map((reason, i) => (
                                                    <div key={i} style={styles.reasonItem}>
                                                        <ChevronRight size={12} color="#3b82f6" /> {reason}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={styles.intelGrid}>
                                            <div style={styles.secColumn}>
                                                <h5 style={styles.secLabel}><Layers size={12} color="#8b5cf6" /> Bridging Protocol</h5>
                                                <div style={styles.skillGaps}>
                                                    {match.skillGaps?.map((gap, i) => (
                                                        <span key={i} style={styles.gapTag}>{gap}</span>
                                                    )) || <span style={styles.noGap}>Optimal Skill Alignment</span>}
                                                </div>
                                            </div>
                                            <div style={styles.secColumn}>
                                                <h5 style={styles.secLabel}><Sparkles size={12} color="#10b981" /> Strategic Guidance</h5>
                                                <div style={styles.tipsList}>
                                                    {match.applicationTips?.map((tip, i) => (
                                                        <div key={i} style={styles.tipItem}>{tip}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.matchFooter}>
                                        <div style={styles.marketVal}>
                                            <TrendingUp size={14} /> Market Alignment: <strong>{match.salaryFit}</strong>
                                        </div>
                                        <button
                                            onClick={() => navigate('/jobseeker/viewjobsposted')}
                                            className="posh-button"
                                            style={styles.detailsBtn}
                                        >
                                            Deep Dive <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card" style={styles.noResults}>
                            <Info size={40} color="var(--text-muted)" />
                            <p>No high-compatibility vectors found. Consider refining your narrative baseline.</p>
                        </div>
                    )}
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
    formCard: {
        padding: '40px',
        borderRadius: '30px',
        background: 'rgba(15, 23, 42, 0.4)',
    },
    studioHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '35px',
    },
    studioTitle: {
        fontSize: '1.2rem',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: '800',
        color: 'white',
    },
    studioRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    },
    inputSection: {
        marginBottom: '24px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
        fontWeight: '700',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: {
        width: '100%',
        padding: '16px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.95rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
    },
    textarea: {
        width: '100%',
        padding: '16px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        outline: 'none',
        boxSizing: 'border-box'
    },
    submitBtn: {
        width: '100%',
        height: '60px',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
    },
    resultsContainer: {
        marginTop: '80px',
        marginBottom: '60px',
    },
    resultsHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '40px',
    },
    resultsTitle: {
        fontSize: '2rem',
        margin: 0,
        color: 'white',
    },
    matchGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
    },
    matchCard: {
        padding: '0',
        borderRadius: '24px',
        overflow: 'hidden',
    },
    matchHeader: {
        padding: '25px 35px',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    matchIdentity: {
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
    },
    jobIconBox: {
        width: '50px',
        height: '50px',
        borderRadius: '16px',
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
    company: {
        fontSize: '1rem',
        color: 'var(--text-muted)',
        margin: '2px 0 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    scoreContainer: {
        background: 'rgba(59, 130, 246, 0.05)',
        padding: '10px 20px',
        borderRadius: '20px',
        border: '1px solid rgba(59, 130, 246, 0.15)',
    },
    scoreCircle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    scoreVal: {
        fontSize: '1.8rem',
        fontWeight: '900',
        color: '#3b82f6',
    },
    scoreLab: {
        fontSize: '0.6rem',
        fontWeight: '800',
        color: 'var(--text-muted)',
        letterSpacing: '1px',
    },
    matchBody: {
        padding: '35px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
    },
    secLabel: {
        fontSize: '0.8rem',
        fontWeight: '800',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        margin: '0 0 15px 0',
    },
    reasonsList: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    },
    reasonItem: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontWeight: '500',
    },
    intelGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '40px',
    },
    skillGaps: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    gapTag: {
        padding: '6px 14px',
        borderRadius: '10px',
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#a78bfa',
        fontSize: '0.8rem',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        fontWeight: '700',
    },
    noGap: {
        fontSize: '0.9rem',
        color: '#10b981',
        fontWeight: '600',
    },
    tipsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    tipItem: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
        paddingLeft: '15px',
        borderLeft: '2px solid rgba(255,255,255,0.05)',
    },
    matchFooter: {
        padding: '25px 35px',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    marketVal: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    detailsBtn: {
        padding: '0 25px',
        height: '45px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
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
    noResults: {
        textAlign: 'center',
        padding: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        color: 'var(--text-muted)',
    }
};
