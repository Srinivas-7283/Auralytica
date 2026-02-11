import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { FileText } from 'lucide-react';
import { Mail, Briefcase, Building, AlignLeft, Send, Copy, Download, Sparkles, AlertCircle, Zap } from 'lucide-react';

export default function CoverLetterGenerator() {
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        jobDescription: '',
        resumeText: '',
        tone: 'Professional and enthusiastic'
    });
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const jobseeker = JSON.parse(localStorage.getItem('jobseeker'));

    const handleGenerate = async () => {
        if (!formData.jobTitle || !formData.company) {
            setError('Job title and company are required');
            return;
        }

        setLoading(true);
        setError('');
        setCoverLetter('');

        try {
            const response = await axios.post(`${config.url}/api/ai/generate-cover-letter`, {
                ...formData,
                userEmail: jobseeker?.email || 'anonymous',
                userName: jobseeker?.fullname || 'Your Name'
            });
            setCoverLetter(response.data.coverLetter);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate cover letter');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        // Using a subtle status update would be better than an alert, but keeping it simple for now
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([coverLetter], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `cover_letter_${formData.company.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div style={styles.container}>
            {/* Header section */}
            <div style={styles.header} className="animate-fade-up">
                <h1 style={styles.title} className="font-heading">
                    <Mail size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                    <span className="gradient-text">Cover Letter Generator</span>
                </h1>
                <p style={styles.subtitle}>Craft high-impact, personalized letters that land interviews</p>
            </div>

            <div style={styles.mainGrid}>
                {/* Configuration Area */}
                <div style={styles.configArea} className="animate-fade-up delay-1">
                    <div className="glass-card" style={styles.cardPadding}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Briefcase size={16} /> Job Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g., Software Engineer"
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Building size={16} /> Company
                                </label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="e.g., Microsoft"
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <AlignLeft size={16} /> Job Description
                            </label>
                            <textarea
                                rows="5"
                                value={formData.jobDescription}
                                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                placeholder="Paste the job description for AI-driven personalization..."
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <FileText size={16} /> Career Highlights
                            </label>
                            <textarea
                                rows="5"
                                value={formData.resumeText}
                                onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                                placeholder="Paste your resume summary or key accomplishments..."
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <Zap size={16} /> Tone
                            </label>
                            <select
                                value={formData.tone}
                                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                style={styles.select}
                            >
                                <option value="Professional and enthusiastic">Professional & Enthusiastic</option>
                                <option value="Formal and conservative">Formal & Conservative</option>
                                <option value="Friendly and approachable">Friendly & Approachable</option>
                                <option value="Confident and assertive">Confident & Assertive</option>
                            </select>
                        </div>

                        {error && (
                            <div style={styles.error} className="animate-fade-up">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !formData.jobTitle || !formData.company}
                            className="posh-button posh-button-primary"
                            style={styles.fullWidthBtn}
                        >
                            {loading ? (
                                <>⏳ Drafting Letter...</>
                            ) : (
                                <>
                                    Draft Letter <Sparkles size={18} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Area */}
                <div style={styles.outputArea}>
                    {coverLetter ? (
                        <div className="animate-fade-up">
                            <div className="glass-card" style={styles.resultCard}>
                                <div style={styles.resultHeader}>
                                    <h3 style={styles.resultTitle} className="font-heading">Generated Letter</h3>
                                    <div style={styles.buttonGroup}>
                                        <button onClick={handleCopy} style={styles.iconBtn} title="Copy to clipboard">
                                            <Copy size={18} />
                                        </button>
                                        <button onClick={handleDownload} style={styles.iconBtn} title="Download as text">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div style={styles.letterContent}>
                                    <pre style={styles.letterText}>{coverLetter}</pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card animate-fade-up delay-2" style={styles.placeholder}>
                            <Send size={48} color="rgba(255,255,255,0.05)" />
                            <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>
                                Fill in the details to generate your tailored cover letter.
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
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '20px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-main)',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    textarea: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'inherit',
    },
    select: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
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
    fullWidthBtn: {
        width: '100%',
        height: '50px',
        marginTop: '10px',
    },
    resultCard: {
        padding: '30px',
    },
    resultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid var(--glass-border)',
    },
    resultTitle: {
        fontSize: '1.2rem',
        fontWeight: '700',
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
    },
    iconBtn: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--glass-border)',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-main)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    letterContent: {
        background: 'rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        padding: '25px',
        maxHeight: '650px',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.03)',
    },
    letterText: {
        margin: 0,
        whiteSpace: 'pre-wrap',
        fontFamily: 'var(--font-main)',
        fontSize: '0.95rem',
        lineHeight: '1.8',
        color: 'var(--text-main)',
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
