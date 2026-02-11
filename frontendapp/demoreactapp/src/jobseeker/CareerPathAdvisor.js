import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Compass, Briefcase, Target, Clock, ArrowUpRight, CheckCircle, Star, TrendingUp, Sparkles, AlertCircle, Award, List } from 'lucide-react';

export default function CareerPathAdvisor() {
    const [formData, setFormData] = useState({
        currentRole: '',
        skills: '',
        goals: '',
        timeframe: '2-3 years',
        experience: ''
    });
    const [careerPlan, setCareerPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const jobseeker = JSON.parse(localStorage.getItem('jobseeker'));

    const handleGetAdvice = async () => {
        if (!formData.currentRole || !formData.goals) {
            setError('Current role and career goals are required');
            return;
        }

        setLoading(true);
        setError('');
        setCareerPlan(null);

        try {
            const response = await axios.post(`${config.url}/api/ai/career-path`, {
                ...formData,
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
                userEmail: jobseeker?.email || 'anonymous'
            });
            setCareerPlan(response.data.careerPlan);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to get career advice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Header section */}
            <div style={styles.header} className="animate-fade-up">
                <h1 style={styles.title} className="font-heading">
                    <Compass size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                    <span className="gradient-text">Career Path Advisor</span>
                </h1>
                <p style={styles.subtitle}>Strategize your professional evolution with AI-powered roadmaps</p>
            </div>

            <div style={styles.mainGrid}>
                {/* Input Panel */}
                <div style={styles.inputArea} className="animate-fade-up delay-1">
                    <div className="glass-card" style={styles.cardPadding}>
                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Briefcase size={16} /> Current Role
                                </label>
                                <input
                                    type="text"
                                    value={formData.currentRole}
                                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                                    placeholder="e.g., Junior Developer"
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label} className="font-heading">
                                    <Clock size={16} /> Experience
                                </label>
                                <input
                                    type="text"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    placeholder="e.g., 2 years"
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <Star size={16} /> Your Skills (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                placeholder="React, Node.js, Leadership..."
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <Target size={16} /> Career Goals
                            </label>
                            <textarea
                                rows="4"
                                value={formData.goals}
                                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                placeholder="Where do you see yourself? e.g., Senior Architect"
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label} className="font-heading">
                                <ArrowUpRight size={16} /> Target Timeframe
                            </label>
                            <select
                                value={formData.timeframe}
                                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                                style={styles.select}
                            >
                                <option value="1 year">1 Year Plan</option>
                                <option value="2-3 years">2-3 Years Plan</option>
                                <option value="3-5 years">3-5 Years Plan</option>
                                <option value="5+ years">Long-term Vision (5+ yrs)</option>
                            </select>
                        </div>

                        {error && (
                            <div style={styles.error} className="animate-fade-up">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleGetAdvice}
                            disabled={loading || !formData.currentRole || !formData.goals}
                            className="posh-button posh-button-primary"
                            style={styles.fullWidthBtn}
                        >
                            {loading ? (
                                <>⏳ Mapping Career Path...</>
                            ) : (
                                <>
                                    Generate Roadmap <Sparkles size={18} style={{ marginLeft: '10px' }} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Panel */}
                <div style={styles.resultsArea}>
                    {careerPlan ? (
                        <div className="animate-fade-up">
                            {/* Roadmap Steps */}
                            <div className="glass-card" style={styles.roadmapCard}>
                                <h3 style={styles.sectionHeading} className="font-heading">
                                    <TrendingUp size={20} color="var(--primary)" /> Strategic Roadmap
                                </h3>
                                {careerPlan.careerPath?.map((step, idx) => (
                                    <div key={idx} className="animate-fade-up" style={{ ...styles.stepItem, animationDelay: `${idx * 0.15}s` }}>
                                        <div style={styles.stepHeader}>
                                            <div style={styles.stepBadge}>Step {step.step}</div>
                                            <div style={styles.stepTime}>{step.timeline}</div>
                                        </div>
                                        <div style={styles.stepTitle}>{step.targetRole}</div>

                                        <div style={styles.stepMeta}>
                                            <div style={styles.metaLabel}>Required Mastery:</div>
                                            <div style={styles.metaSkills}>
                                                {step.requiredSkills?.map((s, i) => (
                                                    <span key={i} style={styles.miniPill}>{s}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={styles.stepSalary}>
                                            <Award size={14} /> Expected: {step.expectedSalaryRange}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Skills & Certs Grid */}
                            <div style={styles.infoGrid}>
                                <div className="glass-card" style={styles.gridSection}>
                                    <h4 style={styles.gridTitle} className="font-heading">
                                        <List size={18} color="var(--primary)" /> Skill Evolution
                                    </h4>
                                    <div style={styles.skillList}>
                                        {careerPlan.skillDevelopmentPlan?.map((s, i) => (
                                            <div key={i} style={styles.skillItem}>
                                                <div style={styles.skillName}>
                                                    {s.skill}
                                                    <span style={styles.priorityLabel(s.priority)}>{s.priority}</span>
                                                </div>
                                                <div style={styles.skillPath}>{s.learningPath}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card" style={styles.gridSection}>
                                    <h4 style={styles.gridTitle} className="font-heading">
                                        <Award size={18} color="#f59e0b" /> Required Certs
                                    </h4>
                                    <div style={styles.certList}>
                                        {careerPlan.certifications?.map((c, i) => (
                                            <div key={i} style={styles.certItem}>
                                                <div style={styles.certName}>{c.name}</div>
                                                <div style={styles.certProvider}>{c.provider}</div>
                                                <div style={styles.certMeta}>
                                                    {c.estimatedCost} • {c.timeToComplete}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Industry Trends & Actions */}
                            <div className="glass-card" style={styles.actionCard}>
                                <h4 style={styles.gridTitle} className="font-heading">
                                    <CheckCircle size={18} color="#10b981" /> Immediate Strategic Actions
                                </h4>
                                <div style={styles.actionList}>
                                    {careerPlan.immediateActions?.map((a, i) => (
                                        <div key={i} style={styles.actionItem}>
                                            <ArrowUpRight size={14} style={{ marginRight: '10px' }} />
                                            {a}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card animate-fade-up delay-2" style={styles.placeholder}>
                            <Compass size={48} color="rgba(255,255,255,0.05)" />
                            <p style={{ color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                                Let AI architect your future.<br />Define your goals to view your roadmap.
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
        gridTemplateColumns: '1fr 1.3fr',
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
        marginBottom: '10px',
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
    resultsArea: {
        minHeight: '600px',
    },
    roadmapCard: {
        padding: '30px',
        marginBottom: '25px',
    },
    sectionHeading: {
        fontSize: '1.3rem',
        fontWeight: '700',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    stepItem: {
        position: 'relative',
        padding: '25px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '15px',
        marginBottom: '20px',
        borderLeft: '4px solid var(--primary)',
    },
    stepHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    stepBadge: {
        fontSize: '0.75rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--primary)',
    },
    stepTime: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    stepTitle: {
        fontSize: '1.3rem',
        fontWeight: '700',
        color: 'white',
        marginBottom: '15px',
    },
    stepMeta: {
        marginBottom: '15px',
    },
    metaLabel: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginBottom: '8px',
    },
    metaSkills: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    miniPill: {
        padding: '4px 10px',
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#a78bfa',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    stepSalary: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        color: '#f59e0b',
        fontWeight: '600',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '25px',
    },
    gridSection: {
        padding: '25px',
    },
    gridTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    skillItem: {
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
    },
    skillName: {
        fontSize: '0.95rem',
        fontWeight: '700',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
    },
    priorityLabel: (level) => ({
        fontSize: '0.65rem',
        padding: '2px 8px',
        borderRadius: '4px',
        background: level === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        color: level === 'HIGH' ? '#ef4444' : '#3b82f6',
    }),
    skillPath: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        lineHeight: '1.4',
    },
    certItem: {
        marginBottom: '15px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '10px',
    },
    certName: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: 'white',
        marginBottom: '4px',
    },
    certProvider: {
        fontSize: '0.8rem',
        color: 'var(--primary)',
        fontWeight: '600',
        marginBottom: '8px',
    },
    certMeta: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
    },
    actionCard: {
        padding: '25px',
    },
    actionList: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
    },
    actionItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.9rem',
        color: 'var(--text-main)',
        padding: '12px 15px',
        background: 'rgba(16, 185, 129, 0.05)',
        borderRadius: '10px',
        border: '1px solid rgba(16, 185, 129, 0.1)',
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
