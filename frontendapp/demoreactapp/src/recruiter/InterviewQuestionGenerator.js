import React, { useState } from 'react';
import axios from 'axios';
import { HelpCircle, Briefcase, User, CheckCircle, AlertCircle, MessageSquare, ArrowRight, Sparkles, Flag, Zap, ClipboardList, Target } from 'lucide-react';
import config from '../config';


export default function InterviewQuestionGenerator() {
    const [formData, setFormData] = useState({
        applicantId: '',
        jobDescription: '',
        resumeText: '',
        interviewRound: 'First Round'
    });
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const recruiter = JSON.parse(localStorage.getItem('recruiter'));

    const handleGenerate = async () => {
        if (!formData.jobDescription && !formData.resumeText) {
            setError('Please provide either job description or resume text');
            return;
        }

        setLoading(true);
        setError('');
        setQuestions(null);

        try {
            const response = await axios.post(`${config.url}/api/ai/generate-interview-questions`, {
                ...formData,
                userEmail: recruiter?.email || 'anonymous'
            });
            setQuestions(response.data.questions);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate questions');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryStyles = (category) => {
        const cats = {
            'Technical': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
            'Behavioral': { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
            'Situational': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            'HR': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }
        };
        return cats[category] || { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
    };

    const getDifficultyStyles = (difficulty) => {
        const diffs = {
            'Easy': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
            'Medium': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            'Hard': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
        };
        return diffs[difficulty] || { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
    };

    return (
        <div style={styles.container}>
            <div style={styles.header} className="animate-fade-up">
                <h1 style={styles.title} className="font-heading">
                    <HelpCircle size={32} style={{ color: '#06b6d4', marginRight: '15px' }} />
                    <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                        Interview Insight AI
                    </span>
                </h1>
                <p style={styles.subtitle}>Generate precision-engineered interview questions for any recruitment stage</p>
            </div>

            <div style={styles.mainGrid}>
                {/* Configuration Panel */}
                <div style={styles.configArea} className="animate-fade-up delay-1">
                    <div className="glass-card" style={styles.configCard}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Target size={16} /> Applicant Reference
                                </label>
                                <input
                                    type="text"
                                    value={formData.applicantId}
                                    onChange={(e) => setFormData({ ...formData, applicantId: e.target.value })}
                                    placeholder="e.g., APP-9021"
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <ClipboardList size={16} /> Assessment Stage
                                </label>
                                <select
                                    value={formData.interviewRound}
                                    onChange={(e) => setFormData({ ...formData, interviewRound: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="First Round">Initial Screen</option>
                                    <option value="Technical Round">Technical Deep-Dive</option>
                                    <option value="Behavioral Round">Behavioral Audit</option>
                                    <option value="Final Round">Executive Review</option>
                                    <option value="HR Round">Culture & HR</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <Briefcase size={16} /> Job Description Context
                            </label>
                            <textarea
                                rows="5"
                                value={formData.jobDescription}
                                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                placeholder="Paste role specifications..."
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <User size={16} /> Candidate Profile (Optional)
                            </label>
                            <textarea
                                rows="5"
                                value={formData.resumeText}
                                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                                placeholder="Paste candidate bio or resume for tailored questions..."
                                style={styles.textarea}
                            />
                        </div>

                        {error && (
                            <div style={styles.error} className="animate-fade-up">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="posh-button posh-button-primary"
                            style={styles.generateBtn}
                        >
                            {loading ? (
                                <>⏳ Sequencing Questions...</>
                            ) : (
                                <>
                                    Draft Interview Script <Sparkles size={18} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div style={styles.resultsArea}>
                    {questions ? (
                        <div style={styles.questionsList}>
                            <h3 style={styles.resultsHeader} className="font-heading">
                                <MessageSquare size={22} color="#06b6d4" />
                                Prepared Intelligence ({questions.length} Items)
                            </h3>
                            {questions.map((q, idx) => (
                                <div key={idx} className="glass-card animate-fade-up" style={{ ...styles.questionCard, animationDelay: `${idx * 0.1}s` }}>
                                    <div style={styles.qHeader}>
                                        <div style={styles.qNumber}>0{idx + 1}</div>
                                        <div style={styles.badges}>
                                            <span style={{ ...styles.badge, color: getCategoryStyles(q.category).color, background: getCategoryStyles(q.category).bg }}>
                                                {q.category}
                                            </span>
                                            <span style={{ ...styles.badge, color: getDifficultyStyles(q.difficulty).color, background: getDifficultyStyles(q.difficulty).bg }}>
                                                {q.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 style={styles.questionText} className="font-heading">{q.question}</h4>

                                    <div style={styles.purposeBox}>
                                        <Zap size={14} style={{ marginTop: '3px' }} />
                                        <span><strong>Strategic Intent:</strong> {q.purpose}</span>
                                    </div>

                                    <div style={styles.flagGrid}>
                                        <div style={styles.flagColumn}>
                                            <div style={styles.flagLabel}><CheckCircle size={14} color="#10b981" /> Positive Indicators</div>
                                            <ul style={styles.flagList}>
                                                {q.greenFlags.map((flag, i) => <li key={i} style={styles.greenFlag}>{flag}</li>)}
                                            </ul>
                                        </div>
                                        <div style={styles.flagColumn}>
                                            <div style={styles.flagLabel}><AlertCircle size={14} color="#ef4444" /> Conflict Indicators</div>
                                            <ul style={styles.flagList}>
                                                {q.redFlags.map((flag, i) => <li key={i} style={styles.redFlag}>{flag}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    {q.followUp && (
                                        <div style={styles.followUpPanel}>
                                            <ArrowRight size={14} color="#06b6d4" />
                                            <strong>Recommended Probe:</strong> {q.followUp}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card animate-fade-up delay-2" style={styles.placeholder}>
                            <ClipboardList size={48} color="rgba(255,255,255,0.05)" />
                            <p style={{ color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                                Your AI-sequenced interview script will appear here.<br />
                                Provide context to generate role-specific assessments.
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
        maxWidth: '1300px',
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
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1fr) 1.5fr',
        gap: '40px',
        alignItems: 'start',
    },
    configCard: {
        padding: '30px',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.9rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.9rem',
        outline: 'none',
    },
    select: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
    },
    textarea: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'inherit',
    },
    generateBtn: {
        width: '100%',
        height: '55px',
        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        fontSize: '1.1rem',
        fontWeight: '700',
        marginTop: '10px',
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
    },
    resultsArea: {
        minHeight: '600px',
    },
    resultsHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '1.6rem',
        fontWeight: '800',
        marginBottom: '30px',
    },
    questionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    questionCard: {
        padding: '30px',
    },
    qHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    qNumber: {
        fontSize: '1rem',
        fontWeight: '800',
        color: '#06b6d4',
        opacity: 0.6,
        letterSpacing: '2px',
    },
    badges: {
        display: 'flex',
        gap: '10px',
    },
    badge: {
        padding: '6px 14px',
        borderRadius: '10px',
        fontSize: '0.75rem',
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    questionText: {
        fontSize: '1.3rem',
        fontWeight: '700',
        lineHeight: '1.5',
        marginBottom: '20px',
        color: 'var(--text-main)',
    },
    purposeBox: {
        display: 'flex',
        gap: '12px',
        padding: '15px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        color: 'var(--text-muted)',
        marginBottom: '25px',
    },
    flagGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '25px',
    },
    flagColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    flagLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        opacity: 0.8,
    },
    flagList: {
        margin: 0,
        paddingLeft: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    greenFlag: {
        fontSize: '0.85rem',
        color: '#10b981',
        lineHeight: '1.4',
    },
    redFlag: {
        fontSize: '0.85rem',
        color: '#ef4444',
        lineHeight: '1.4',
    },
    followUpPanel: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        background: 'rgba(6, 182, 212, 0.05)',
        borderLeft: '4px solid #06b6d4',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.8)',
    },
    placeholder: {
        height: '100%',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
        padding: '40px',
    }
};
