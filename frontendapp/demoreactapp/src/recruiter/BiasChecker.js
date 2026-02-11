import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { ShieldCheck, AlertTriangle, CheckCircle, Lightbulb, Edit3, Target, Shield, Search, Copy, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export default function BiasChecker() {
    const [jobDescription, setJobDescription] = useState('');
    const [biasAnalysis, setBiasAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const recruiter = JSON.parse(localStorage.getItem('recruiter'));

    const handleCheck = async () => {
        if (!jobDescription || jobDescription.trim().length < 50) {
            setError('Please enter a job description (minimum 50 characters)');
            return;
        }

        setLoading(true);
        setError('');
        setBiasAnalysis(null);

        try {
            const response = await axios.post(`${config.url}/api/ai/check-bias`, {
                jobDescription,
                userEmail: recruiter?.email || 'anonymous'
            });
            setBiasAnalysis(response.data.biasAnalysis);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to check bias');
        } finally {
            setLoading(false);
        }
    };

    const getBiasStatus = (score) => {
        if (score < 30) return {
            color: '#10b981',
            label: 'Exceptional Inclusivity',
            icon: <ShieldCheck size={20} />,
            bg: 'rgba(16, 185, 129, 0.1)'
        };
        if (score < 60) return {
            color: '#f59e0b',
            label: 'Balanced Context',
            icon: <AlertTriangle size={20} />,
            bg: 'rgba(245, 158, 11, 0.1)'
        };
        return {
            color: '#ef4444',
            label: 'Action Required',
            icon: <Shield size={20} />,
            bg: 'rgba(239, 68, 68, 0.1)'
        };
    };

    const getSeverityIcon = (severity) => {
        if (severity === 'HIGH') return <AlertCircle size={14} color="#ef4444" />;
        if (severity === 'MEDIUM') return <AlertTriangle size={14} color="#f59e0b" />;
        return <CheckCircle size={14} color="#3b82f6" />;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header} className="animate-fade-up">
                <h1 style={styles.title} className="font-heading">
                    <ShieldCheck size={32} style={{ color: '#10b981', marginRight: '15px' }} />
                    <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                        Diversity Shield AI
                    </span>
                </h1>
                <p style={styles.subtitle}>Audit your job descriptions for implicit bias and maximize talent reach</p>
            </div>

            <div style={styles.mainWrapper} className="animate-fade-up delay-1">
                {/* Input Panel */}
                <div className="glass-card" style={styles.inputCard}>
                    <div style={styles.inputHeader}>
                        <label style={styles.label} className="font-heading">
                            <Edit3 size={18} /> Recruitment Architecture
                        </label>
                        <span style={styles.charCount}>{jobDescription.length} characters</span>
                    </div>
                    <textarea
                        rows="12"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste your job description here for a comprehensive audit..."
                        style={styles.textarea}
                    />

                    {error && (
                        <div style={styles.error} className="animate-fade-up">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleCheck}
                        disabled={loading || jobDescription.length < 50}
                        className="posh-button posh-button-primary"
                        style={styles.checkBtn}
                    >
                        {loading ? (
                            <>⏳ Auditing Neutrality...</>
                        ) : (
                            <>
                                Begin Bias Audit <Search size={18} style={{ marginLeft: '10px' }} />
                            </>
                        )}
                    </button>
                    <p style={styles.hint}>AI will analyze linguistic patterns, gendered language, and exclusionary phrasing.</p>
                </div>

                {/* Results Section */}
                {biasAnalysis && (
                    <div style={styles.resultsArea}>
                        {/* Score Dashboard */}
                        <div className="animate-fade-up" style={styles.dashboardGrid}>
                            <div className="glass-card" style={{ ...styles.scoreCard, borderLeft: `5px solid ${getBiasStatus(biasAnalysis.biasScore).color}` }}>
                                <div style={styles.scoreRow}>
                                    <div style={styles.scoreInfo}>
                                        <h3 style={styles.scoreLabel} className="font-heading">Inclusive Coefficient</h3>
                                        <p style={styles.assessmentText}>{biasAnalysis.overallAssessment}</p>
                                    </div>
                                    <div style={{ ...styles.scoreCircle, borderColor: getBiasStatus(biasAnalysis.biasScore).color }}>
                                        <span style={{ color: getBiasStatus(biasAnalysis.biasScore).color }}>{biasAnalysis.biasScore}</span>
                                        <small>%</small>
                                    </div>
                                </div>
                                <div style={{ ...styles.statusBadge, color: getBiasStatus(biasAnalysis.biasScore).color, background: getBiasStatus(biasAnalysis.biasScore).bg }}>
                                    {getBiasStatus(biasAnalysis.biasScore).icon}
                                    {getBiasStatus(biasAnalysis.biasScore).label}
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="animate-fade-up delay-1" style={styles.analysisSection}>
                            <h3 style={styles.sectionTitle} className="font-heading">
                                <Target size={20} /> Targeted Improvements
                            </h3>

                            <div style={styles.biasGrid}>
                                {biasAnalysis.biasCategories.map((category, idx) => (
                                    <div key={idx} className="glass-card" style={styles.biasCard}>
                                        <div style={styles.biasHead}>
                                            <h4 style={styles.categoryName} className="font-heading">{category.category}</h4>
                                            <span style={styles.severityTag}>
                                                {getSeverityIcon(category.severity)}
                                                {category.severity}
                                            </span>
                                        </div>
                                        <p style={styles.explanationText}>{category.explanation}</p>

                                        <div style={styles.comparisonArea}>
                                            <div style={styles.phraseColumn}>
                                                <span style={styles.columnLabel}>❌ Identify</span>
                                                <div style={styles.phrasePills}>
                                                    {category.problematicPhrases.map((phrase, i) => (
                                                        <span key={i} style={styles.badPill}>{phrase}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={styles.phraseColumn}>
                                                <span style={styles.columnLabel}>✅ Alternative</span>
                                                <div style={styles.phrasePills}>
                                                    {category.suggestedReplacements.map((phrase, i) => (
                                                        <span key={i} style={styles.goodPill}>{phrase}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusive Rewrite */}
                        <div className="animate-fade-up delay-2" style={styles.analysisSection}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={styles.sectionTitle} className="font-heading">
                                    <Sparkles size={20} /> Optimized Synthesis
                                </h3>
                                <button onClick={() => navigator.clipboard.writeText(biasAnalysis.inclusiveRewrite)} style={styles.copyButton}>
                                    <Copy size={16} /> Copy Rewrite
                                </button>
                            </div>
                            <div className="glass-card" style={styles.rewritePanel}>
                                <pre style={styles.rewriteContent}>{biasAnalysis.inclusiveRewrite}</pre>
                            </div>
                        </div>

                        {/* Intelligence Hub */}
                        <div style={styles.footerGrid} className="animate-fade-up delay-3">
                            <div className="glass-card" style={styles.footerCard}>
                                <h4 style={styles.footerTitle} className="font-heading">
                                    <Lightbulb size={18} color="#f59e0b" /> Strategic Advice
                                </h4>
                                <ul style={styles.list}>
                                    {biasAnalysis.recommendations.map((rec, idx) => (
                                        <li key={idx} style={styles.listItem}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="glass-card" style={{ ...styles.footerCard, borderLeft: '4px solid #10b981' }}>
                                <h4 style={styles.footerTitle} className="font-heading">
                                    <CheckCircle size={18} color="#10b981" /> Positive Markers
                                </h4>
                                <ul style={styles.list}>
                                    {biasAnalysis.positiveAspects.map((aspect, idx) => (
                                        <li key={idx} style={styles.listItem}>{aspect}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '50px',
    },
    title: {
        fontSize: '2.8rem',
        fontWeight: '800',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
    },
    mainWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
    },
    inputCard: {
        padding: '30px',
    },
    inputHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '1.1rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    charCount: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: '600',
    },
    textarea: {
        width: '100%',
        padding: '20px',
        borderRadius: '16px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--glass-border)',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '1rem',
        lineHeight: '1.7',
        fontFamily: "'Fira Code', monospace",
        outline: 'none',
        resize: 'vertical',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        ':focus': {
            background: 'rgba(0, 0, 0, 0.4)',
            borderColor: '#10b981',
        }
    },
    checkBtn: {
        width: '100%',
        height: '55px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '15px',
    },
    hint: {
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        margin: 0,
    },
    resultsArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
    },
    scoreCard: {
        padding: '30px',
        background: 'rgba(255,255,255,0.02)',
    },
    scoreRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '30px',
        marginBottom: '20px',
    },
    scoreInfo: {
        flex: 1,
    },
    scoreLabel: {
        fontSize: '1.4rem',
        fontWeight: '800',
        marginBottom: '10px',
    },
    assessmentText: {
        fontSize: '1rem',
        color: 'var(--text-muted)',
        lineHeight: '1.6',
    },
    scoreCircle: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        border: '8px solid',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '1.8rem',
        background: 'rgba(0,0,0,0.2)',
        flexShrink: 0,
        span: { lineHeight: 1 },
        small: { fontSize: '0.8rem', opacity: 0.6 }
    },
    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '700',
    },
    analysisSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--text-main)',
    },
    biasGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
        gap: '20px',
    },
    biasCard: {
        padding: '25px',
    },
    biasHead: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px',
    },
    categoryName: {
        fontSize: '1.1rem',
        fontWeight: '700',
        margin: 0,
    },
    severityTag: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        fontWeight: '800',
        padding: '4px 10px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
        textTransform: 'uppercase',
    },
    explanationText: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        lineHeight: '1.6',
        marginBottom: '20px',
    },
    comparisonArea: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        background: 'rgba(0,0,0,0.2)',
        padding: '15px',
        borderRadius: '12px',
    },
    columnLabel: {
        display: 'block',
        fontSize: '0.7rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        marginBottom: '10px',
        opacity: 0.6,
    },
    phrasePills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    badPill: {
        padding: '5px 10px',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '7px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    goodPill: {
        padding: '5px 10px',
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '7px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    rewritePanel: {
        padding: '30px',
        background: 'rgba(0,0,0,0.2)',
    },
    rewriteContent: {
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        fontSize: '1rem',
        lineHeight: '1.8',
        color: 'rgba(255,255,255,0.9)',
        margin: 0,
    },
    copyButton: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
    },
    footerGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    footerCard: {
        padding: '25px',
    },
    footerTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '20px',
    },
    list: {
        margin: 0,
        paddingLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    listItem: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
    },
    error: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
        borderRadius: '10px',
        marginBottom: '15px',
        fontSize: '0.85rem',
    }
};
