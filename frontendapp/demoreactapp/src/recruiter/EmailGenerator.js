import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Mail, Send, User, Briefcase, Building, MessageSquare, Copy, Sparkles, RotateCcw, AlertCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function EmailGenerator() {
    const [formData, setFormData] = useState({
        emailType: 'interview_invite',
        candidateName: '',
        jobTitle: '',
        context: '',
        companyName: ''
    });
    const [emailContent, setEmailContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const recruiter = JSON.parse(localStorage.getItem('recruiter'));

    const emailTypes = {
        interview_invite: 'Interview Invitation',
        screening_call: 'Screening Call Invitation',
        rejection: 'Rejection Email',
        offer: 'Job Offer Letter',
        follow_up: 'Interview Follow-up',
        application_received: 'Application Confirmation',
        schedule_change: 'Interview Reschedule'
    };

    const handleGenerate = async () => {
        if (!formData.candidateName) {
            setError('Candidate name is required to personalize the communication.');
            return;
        }

        setLoading(true);
        setError('');
        setEmailContent('');
        setCopied(false);

        try {
            const response = await axios.post(`${config.url}/api/ai/generate-email`, {
                ...formData,
                userEmail: recruiter?.email || 'anonymous'
            });
            setEmailContent(response.data.emailContent);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate professional draft.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(emailContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header} className="animate-fade-up">
                <h1 style={styles.title} className="font-heading">
                    <Mail size={32} style={{ color: '#ec4899', marginRight: '15px' }} />
                    <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
                        Communications Hub AI
                    </span>
                </h1>
                <p style={styles.subtitle}>Draft sophisticated, personalized recruitment emails in seconds</p>
            </div>

            <div style={styles.contentGrid}>
                {/* Draft Studio */}
                <div style={styles.studioArea} className="animate-fade-up delay-1">
                    <div className="glass-card" style={styles.studioCard}>
                        <div style={styles.sectionHeader}>
                            <Sparkles size={18} color="#ec4899" />
                            <h3 style={styles.sectionTitle} className="font-heading">Drafting Studio</h3>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Communication Type</label>
                            <div style={styles.selectWrapper}>
                                <select
                                    value={formData.emailType}
                                    onChange={(e) => setFormData({ ...formData, emailType: e.target.value })}
                                    style={styles.select}
                                >
                                    {Object.entries(emailTypes).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                                <ChevronDown size={18} style={styles.selectIcon} />
                            </div>
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><User size={14} /> Candidate Name</label>
                                <input
                                    type="text"
                                    value={formData.candidateName}
                                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                                    placeholder="e.g., John Doe"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><Briefcase size={14} /> Role Reference</label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g., Senior Lead Designer"
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Building size={14} /> Organization</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="Display company name..."
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><MessageSquare size={14} /> Narrative Context</label>
                            <textarea
                                rows="4"
                                value={formData.context}
                                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                                placeholder="Add specific details like interview time, location, or feedback notes to tailor the message..."
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
                            disabled={loading || !formData.candidateName}
                            className="posh-button posh-button-primary"
                            style={{ ...styles.generateBtn, background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
                        >
                            {loading ? (
                                <>⏳ Composing Narrative...</>
                            ) : (
                                <>
                                    Draft Communication <Send size={18} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div style={styles.previewArea}>
                    {emailContent ? (
                        <div className="glass-card animate-fade-up" style={styles.previewCard}>
                            <div style={styles.previewHeader}>
                                <div style={styles.previewInfo}>
                                    <h3 style={styles.previewTitle} className="font-heading">Draft Preview</h3>
                                    <span style={styles.previewStatus}>{emailTypes[formData.emailType]}</span>
                                </div>
                                <button onClick={handleCopy} style={{ ...styles.copyButton, color: copied ? '#10b981' : 'white' }}>
                                    {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy Draft</>}
                                </button>
                            </div>
                            <div style={styles.emailCanvas}>
                                <div style={styles.canvaHeader}>
                                    <div style={styles.dot} />
                                    <div style={styles.dot} />
                                    <div style={styles.dot} />
                                </div>
                                <div style={styles.canvaBody}>
                                    <pre style={styles.emailText}>{emailContent}</pre>
                                </div>
                            </div>
                            <div style={styles.previewFooter}>
                                <button onClick={() => setEmailContent('')} style={styles.resetBtn}>
                                    <RotateCcw size={14} /> Reset
                                </button>
                                <p style={styles.disclaimer}>* AI generated content should be reviewed for accuracy.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card animate-fade-up delay-2" style={styles.placeholder}>
                            <Mail size={48} color="rgba(255,255,255,0.05)" />
                            <p style={{ color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                                Your professional draft will materialize here.<br />
                                Configure the studio to begin composition.
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
        maxWidth: '1200px',
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
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1fr) 1.2fr',
        gap: '40px',
        alignItems: 'start',
    },
    studioCard: {
        padding: '30px',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '25px',
    },
    sectionTitle: {
        fontSize: '1.4rem',
        fontWeight: '700',
        margin: 0,
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '10px',
        opacity: 0.8,
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
        transition: 'all 0.3s ease',
    },
    selectWrapper: {
        position: 'relative',
        width: '100%',
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
        appearance: 'none',
    },
    selectIcon: {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.5,
        pointerEvents: 'none',
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
    previewArea: {
        minHeight: '600px',
    },
    previewCard: {
        padding: '30px',
        background: 'rgba(255,255,255,0.02)',
    },
    previewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '25px',
    },
    previewInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    previewTitle: {
        fontSize: '1.5rem',
        fontWeight: '800',
        margin: 0,
    },
    previewStatus: {
        fontSize: '0.8rem',
        color: '#ec4899',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginTop: '5px',
    },
    copyButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255,255,255,0.05)',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    emailCanvas: {
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        marginBottom: '20px',
    },
    canvaHeader: {
        padding: '10px 15px',
        background: 'rgba(255,255,255,0.03)',
        display: 'flex',
        gap: '6px',
        borderBottom: '1px solid var(--glass-border)',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
    },
    canvaBody: {
        padding: '25px',
        maxHeight: '450px',
        overflowY: 'auto',
    },
    emailText: {
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        fontSize: '1rem',
        lineHeight: '1.8',
        color: 'rgba(255,255,255,0.9)',
        margin: 0,
    },
    previewFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resetBtn: {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        opacity: 0.6,
        ':hover': { opacity: 1 }
    },
    disclaimer: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        margin: 0,
        fontStyle: 'italic',
    },
    placeholder: {
        height: '100%',
        minHeight: '520px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
        padding: '40px',
    }
};
