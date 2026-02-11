import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Target, CheckCircle, AlertCircle, Sparkles, FileText, List, Key } from 'lucide-react';

export default function ResumeOptimizer() {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const jobseeker = JSON.parse(localStorage.getItem('jobseeker'));

    const handleOptimize = async () => {
        if (!resumeText || resumeText.trim().length < 100) {
            setError('Please enter your resume (minimum 100 characters)');
            return;
        }

        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            const response = await axios.post(`${config.url}/api/ai/optimize-resume`, {
                resumeText,
                targetJobDescription: jobDescription,
                userEmail: jobseeker?.email || 'anonymous'
            });

            setAnalysis(response.data.analysis);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to optimize resume');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Header section */}
            <div style={styles.header} className="animate-fade-up">
                <h1 style={styles.title} className="font-heading">
                    <Target size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                    <span className="gradient-text">Resume Optimizer</span>
                </h1>
                <p style={styles.subtitle}>Elevate your professional profile with AI-driven ATS optimization</p>
            </div>

            <div style={styles.mainGrid}>
                {/* Input Section */}
                <div style={styles.inputArea} className="animate-fade-up delay-1">
                    <div className="glass-card" style={styles.cardPadding}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <FileText size={18} style={{ marginRight: '8px' }} />
                                Your Resume Text
                            </label>
                            <textarea
                                style={styles.textarea}
                                rows="12"
                                placeholder="Paste your professional experience here..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                            />
                            <div style={styles.textFooter}>
                                <small style={styles.hint}>{resumeText.length} characters</small>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <Target size={18} style={{ marginRight: '8px' }} />
                                Target Job Description (Optional)
                            </label>
                            <textarea
                                style={styles.textarea}
                                rows="6"
                                placeholder="Paste the job description for precise matching..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div style={styles.error} className="animate-fade-up">
                                <AlertCircle size={18} style={{ marginRight: '8px' }} />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleOptimize}
                            disabled={loading}
                            className="posh-button posh-button-primary"
                            style={styles.fullWidthBtn}
                        >
                            {loading ? (
                                <>⏳ Analyzing Profile...</>
                            ) : (
                                <>
                                    Optimize Profile <Sparkles size={18} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div style={styles.resultsArea}>
                    {analysis ? (
                        <div className="animate-fade-up">
                            <div className="glass-card" style={styles.scoreCard}>
                                <div style={styles.scoreTitle}>ATS Compatibility Score</div>
                                <div style={{
                                    ...styles.score,
                                    color: analysis.atsScore >= 70 ? '#10b981' : analysis.atsScore >= 50 ? '#f59e0b' : '#ef4444'
                                }}>
                                    {analysis.atsScore}<span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>/100</span>
                                </div>
                                <div style={styles.assessment}>{analysis.overallAssessment}</div>
                            </div>

                            <div style={styles.infoGrid}>
                                {analysis.strengths?.length > 0 && (
                                    <div className="glass-card" style={styles.infoSection}>
                                        <h4 style={styles.sectionTitle} className="font-heading">
                                            <CheckCircle size={18} color="#10b981" /> Strengths
                                        </h4>
                                        <ul style={styles.list}>
                                            {analysis.strengths.map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {analysis.missingKeywords?.length > 0 && (
                                    <div className="glass-card" style={styles.infoSection}>
                                        <h4 style={styles.sectionTitle} className="font-heading">
                                            <Key size={18} color="#f59e0b" /> Key Skills Missing
                                        </h4>
                                        <div style={styles.keywordGrid}>
                                            {analysis.missingKeywords.map((k, i) => (
                                                <span key={i} style={styles.keywordPill}>{k}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {analysis.improvements?.length > 0 && (
                                <div className="glass-card" style={styles.actionSection}>
                                    <h4 style={styles.sectionTitle} className="font-heading">
                                        <List size={18} color="var(--primary)" /> Critical Improvements
                                    </h4>
                                    {analysis.improvements.map((item, i) => (
                                        <div key={i} style={styles.improvementItem}>
                                            <div style={styles.priorityLabel(item.priority)}>{item.priority}</div>
                                            <div>
                                                <div style={styles.impIssue}>{item.issue}</div>
                                                <div style={styles.impSuggestion}>{item.suggestion}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card animate-fade-up delay-2" style={styles.placeholder}>
                            <Target size={48} color="rgba(255,255,255,0.05)" />
                            <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>
                                Analyze your resume to see detailed ATS insights here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '1300px',
        margin: '0 auto',
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
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1.2fr)',
        gap: '30px',
        alignItems: 'start',
    },
    cardPadding: {
        padding: '30px',
    },
    inputGroup: {
        marginBottom: '25px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-main)',
        marginBottom: '12px',
    },
    textarea: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        resize: 'vertical',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'monospace',
    },
    textFooter: {
        marginTop: '8px',
        textAlign: 'right',
    },
    hint: {
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
    },
    error: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
        borderRadius: '10px',
        marginBottom: '20px',
        fontSize: '0.9rem',
    },
    fullWidthBtn: {
        width: '100%',
        height: '55px',
        fontSize: '1.1rem',
    },
    scoreCard: {
        padding: '40px',
        textAlign: 'center',
        background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent)',
        marginBottom: '25px',
    },
    scoreTitle: {
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: 'var(--text-muted)',
        marginBottom: '15px',
    },
    score: {
        fontSize: '4.5rem',
        fontWeight: '800',
        marginBottom: '10px',
        fontFamily: 'var(--font-heading)',
    },
    assessment: {
        fontSize: '1.1rem',
        color: 'var(--text-main)',
        fontWeight: '500',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '25px',
    },
    infoSection: {
        padding: '25px',
        height: '100%',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        marginBottom: '10px',
        paddingLeft: '15px',
        position: 'relative',
        lineHeight: '1.5',
    },
    keywordGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    keywordPill: {
        padding: '6px 12px',
        background: 'rgba(245, 158, 11, 0.1)',
        color: '#f59e0b',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    actionSection: {
        padding: '25px',
    },
    improvementItem: {
        display: 'flex',
        gap: '20px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        marginBottom: '15px',
        borderLeft: '4px solid transparent',
    },
    priorityLabel: (level) => ({
        fontSize: '0.7rem',
        fontWeight: '800',
        padding: '4px 8px',
        borderRadius: '6px',
        height: 'fit-content',
        background: level === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        color: level === 'HIGH' ? '#ef4444' : '#3b82f6',
        minWidth: '60px',
        textAlign: 'center',
    }),
    impIssue: {
        fontWeight: '700',
        fontSize: '0.95rem',
        color: 'white',
        marginBottom: '5px',
    },
    impSuggestion: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
    },
    placeholder: {
        padding: '100px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px',
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
    }
};
