import React from 'react';
import {
  Target, Lightbulb, Award, Cpu,
  Zap, Sparkles, Globe, ShieldCheck,
  Layers, Users, Activity, TrendingUp,
  Rocket, Info
} from 'lucide-react';

export default function About() {
  return (
    <div style={styles.container}>
      <header className="animate-fade-up" style={styles.header}>
        <div style={styles.badge}>
          <Info size={14} color="#3b82f6" />
          <span>PLATFORM INTELLIGENCE REPORT</span>
        </div>
        <h1 style={styles.mainTitle} className="font-heading">About Auralytica</h1>
        <p style={styles.heroSub}>Neural infrastructure for the next generation of global recruitment.</p>
      </header>

      <div style={styles.missionGrid}>
        {/* MISSION */}
        <div className="glass-card animate-fade-up delay-1" style={styles.missionCard}>
          <div style={styles.iconBox}>
            <Target size={28} color="#3b82f6" />
          </div>
          <h3 style={styles.cardTitle}>Our Mission</h3>
          <p style={styles.cardDesc}>
            To revolutionize the talent-opportunity bridge through AI-orchestrated precision.
            We don't just post jobs; we synthesize professional narratives into actionable intelligence,
            eliminating the friction of traditional recruitment loops.
          </p>
        </div>

        {/* VISION */}
        <div className="glass-card animate-fade-up delay-2" style={{ ...styles.missionCard, ...styles.highlightCard }}>
          <div style={{ ...styles.iconBox, background: 'rgba(59, 130, 246, 0.2)' }}>
            <Lightbulb size={28} color="#3b82f6" />
          </div>
          <h3 style={styles.cardTitle}>The Vision</h3>
          <p style={styles.cardDesc}>
            A world where hire-readiness objective, measurable, and accessible.
            Auralytica aims to be the definitive institutional layer for career
            orchestration—going beyond the social surface of LinkedIn to the
            neural core of competency and fit.
          </p>
        </div>
      </div>

      <div style={styles.ecosystemSection} className="animate-fade-up delay-3">
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle} className="font-heading">The Ecosystem Infrastructure</h2>
          <p style={styles.sectionSub}>A multi-layered approach to professional synchronization.</p>
        </div>

        <div style={styles.intelGrid}>
          <div className="glass-card" style={styles.intelCard}>
            <h4 style={styles.intelTitle}><ShieldCheck size={18} /> Core Architecture</h4>
            <ul style={styles.intelList}>
              <li>Institutional-Grade Security Protocols</li>
              <li>Multi-Tenant Role-Based Access</li>
              <li>Real-Time Application Synchronization</li>
              <li>Unified Recruitment Command Center</li>
            </ul>
          </div>

          <div className="glass-card" style={{ ...styles.intelCard, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <h4 style={{ ...styles.intelTitle, color: '#a78bfa' }}><Cpu size={18} /> Neural Advantage</h4>
            <ul style={styles.intelList}>
              <li>AI-Synthesized Mock Interview Labs</li>
              <li>Dynamic Speech-to-Market Mapping</li>
              <li>Predictive Hire-Readiness Scoring</li>
              <li>Automated Narrative Optimization</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-card animate-fade-up delay-4" style={styles.differencePanel}>
        <div style={styles.diffHeader}>
          <Rocket size={32} color="#3b82f6" />
          <h3 style={styles.diffTitle} className="font-heading">What Defines Us</h3>
        </div>
        <p style={styles.diffText}>
          Traditional platforms are static repositories of history. Auralytica is an active
          orchestration engine. We don't just report on where you've been; we calibrate
          where you are going. Through integrated AI simulation labs, candidates
          close their own competency gaps in real-time, arriving at interviews
          not just with a resume, but with a proven data-driven baseline of performance.
        </p>
        <div style={styles.diffMeta}>
          <div style={styles.metaBadge}><TrendingUp size={12} /> Data Velocity</div>
          <div style={styles.metaBadge}><Globe size={12} /> Global Standard</div>
          <div style={styles.metaBadge}><Sparkles size={12} /> AI-First</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 20px',
    borderRadius: '100px',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '30px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  mainTitle: {
    fontSize: '4rem',
    margin: 0,
    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    marginTop: '15px',
  },
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '100px',
  },
  missionCard: {
    padding: '50px',
    borderRadius: '35px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  highlightCard: {
    background: 'rgba(59, 130, 246, 0.03)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
  },
  iconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
  },
  cardDesc: {
    fontSize: '1.05rem',
    color: 'var(--text-muted)',
    lineHeight: '1.7',
    margin: 0,
  },
  ecosystemSection: {
    marginBottom: '100px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    color: 'white',
    margin: 0,
  },
  sectionSub: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    marginTop: '10px',
  },
  intelGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  intelCard: {
    padding: '40px',
    borderRadius: '25px',
  },
  intelTitle: {
    fontSize: '1.1rem',
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
  },
  intelList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  intelligenceItem: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  differencePanel: {
    padding: '60px',
    borderRadius: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
    background: 'rgba(15, 23, 42, 0.4)',
  },
  diffHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  diffTitle: {
    fontSize: '2.5rem',
    color: 'white',
    margin: 0,
  },
  diffText: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    lineHeight: '1.8',
    maxWidth: '900px',
    margin: 0,
  },
  diffMeta: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
  },
  metaBadge: {
    padding: '8px 16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  }
};