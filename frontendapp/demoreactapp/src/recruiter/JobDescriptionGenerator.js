import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Briefcase, Building, MapPin, Star, List, TextCursor, DollarSign, Copy, FilePlus, AlertCircle } from 'lucide-react';
import config from '../config';


export default function JobDescriptionGenerator() {
    const [formData, setFormData] = useState({
        jobTitle: '',
        department: '',
        seniorityLevel: 'Mid-Level',
        keyResponsibilities: '',
        requiredSkills: '',
        companyDescription: '',
        location: '',
        salary: ''
    });
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const recruiter = JSON.parse(localStorage.getItem('recruiter'));

    const handleGenerate = async () => {
        if (!formData.jobTitle) {
            setError('Job title is required');
            return;
        }

        setLoading(true);
        setError('');
        setJobDescription('');

        try {
            const response = await axios.post(`${config.url}/api/ai/generate-job-description`, {
                ...formData,
                requiredSkills: formData.requiredSkills ? formData.requiredSkills.split(',').map(s => s.trim()) : [],
                userEmail: recruiter?.email || 'anonymous'
            });
            setJobDescription(response.data.jobDescription);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate job description');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(jobDescription);
        // Using a more modern alert would be better but keeping it simple for now or using a custom Toast if available.
        // For now, let's just stick to the functional copy.
    };

    return (
        <div style={styles.container}>
            <div style={styles.header} className="animate-fade-up">
                <h1 style={styles.title} className="font-heading">
                    <FilePlus size={32} style={{ color: '#f59e0b', marginRight: '15px' }} />
                    <span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                        AI JD Architect
                    </span>
                </h1>
                <p style={styles.subtitle}>Construct high-conversion, bias-free job descriptions in seconds</p>
            </div>

            <div style={styles.mainGrid}>
                {/* Form Section */}
                <div style={styles.formArea} className="animate-fade-up delay-1">
                    <div className="glass-card" style={styles.cardPadding}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Briefcase size={16} /> Job Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g., Senior Systems Architect"
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Building size={16} /> Department
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="e.g., Engineering"
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Star size={16} /> Seniority Level
                                </label>
                                <select
                                    value={formData.seniorityLevel}
                                    onChange={(e) => setFormData({ ...formData, seniorityLevel: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="Entry-Level">Entry-Level</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Mid-Level">Mid-Level</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Lead">Lead</option>
                                    <option value="Principal">Principal</option>
                                    <option value="Director">Director</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <MapPin size={16} /> Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Remote / New York"
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <List size={16} /> Required Skills (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.requiredSkills}
                                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                                placeholder="React, Kubernetes, AWS, Go..."
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <TextCursor size={16} /> Key Responsibilities (Optional)
                            </label>
                            <textarea
                                rows="3"
                                value={formData.keyResponsibilities}
                                onChange={(e) => setFormData({ ...formData, keyResponsibilities: e.target.value })}
                                placeholder="Describe main tasks... AI will expand on this."
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Building size={16} /> Company Context
                                </label>
                                <input
                                    type="text"
                                    value={formData.companyDescription}
                                    onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                                    placeholder="Brief mission..."
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <DollarSign size={16} /> Salary Range
                                </label>
                                <input
                                    type="text"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    placeholder="e.g., $120k - $160k"
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={styles.error} className="animate-fade-up">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !formData.jobTitle}
                            className="posh-button posh-button-primary"
                            style={styles.generateBtn}
                        >
                            {loading ? (
                                <>⏳ Drafting Intelligent JD...</>
                            ) : (
                                <>
                                    Draft Job Description <Sparkles size={18} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result Section */}
                <div style={styles.resultArea}>
                    {jobDescription ? (
                        <div className="animate-fade-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div className="glass-card" style={styles.resultCard}>
                                <div style={styles.resultHeader}>
                                    <h3 style={styles.resultLabel} className="font-heading">Drafted Architecture</h3>
                                    <button onClick={handleCopy} style={styles.copyBtn}>
                                        <Copy size={14} /> Copy Content
                                    </button>
                                </div>
                                <div style={styles.jdWrapper}>
                                    <pre style={styles.jdText}>{jobDescription}</pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card animate-fade-up delay-2" style={styles.placeholder}>
                            <FilePlus size={48} color="rgba(255,255,255,0.05)" />
                            <p style={{ color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                                Your AI-generated job description will appear here.<br />
                                Defined requirements yield superior results.
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
        gridTemplateColumns: '1fr 1.2fr',
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
    generateBtn: {
        width: '100%',
        height: '50px',
        marginTop: '10px',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
    resultArea: {
        height: '100%',
        minHeight: '600px',
    },
    resultCard: {
        padding: '30px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    resultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid var(--glass-border)',
    },
    resultLabel: {
        fontSize: '1.3rem',
        fontWeight: '700',
    },
    copyBtn: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
    },
    jdWrapper: {
        flex: 1,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
        padding: '20px',
        overflowY: 'auto',
    },
    jdText: {
        whiteSpace: 'pre-wrap',
        fontFamily: "'Inter', sans-serif",
        color: 'rgba(255,255,255,0.9)',
        lineHeight: '1.8',
        margin: 0,
        fontSize: '0.95rem',
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
