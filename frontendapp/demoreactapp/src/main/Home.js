import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Zap, Briefcase, Sparkles,
  TrendingUp, Users, Cpu, ArrowRight,
  Globe, Activity, Layers, Rocket
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <header className="animate-fade-up" style={styles.heroSection}>
        <div style={styles.badge}>
          <Sparkles size={14} color="#3b82f6" />
          <span>The Future of Talent Acquisition is Here</span>
        </div>
        <h1 style={styles.mainTitle} className="font-heading">
          <span className="gradient-text">AURALYTICA</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Synchronizing human potential with institutional opportunity through
          <span style={styles.highlightText}> high-precision AI orchestration</span>.
        </p>
        <div style={styles.heroActions}>
          <button
            onClick={() => navigate('/jobseekerlogin')}
            className="posh-button posh-button-primary"
            style={styles.heroBtn}
          >
            Propel Your Career <Rocket size={18} />
          </button>
          <button
            onClick={() => navigate('/recruiterlogin')}
            className="posh-button"
            style={{ ...styles.heroBtn, background: 'rgba(255,255,255,0.05)' }}
          >
            Optimize Workforce <Users size={18} />
          </button>
        </div>
      </header>

      <div style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle} className="font-heading">Strategic Pillars</h2>
          <p style={styles.sectionSub}>Architecture designed for the modern professional ecosystem.</p>
        </div>

        <div style={styles.featuresGrid}>
          {/* ADMIN PILLAR */}
          <div className="glass-card animate-fade-up delay-1" style={styles.featureCard}>
            <div style={styles.iconBox}>
              <ShieldCheck size={28} color="#3b82f6" />
            </div>
            <h3 style={styles.cardTitle}>Enterprise Admin</h3>
            <p style={styles.cardDesc}>Maintain platform integrity and manage the global talent directory with institutional-grade security.</p>
            <ul style={styles.featureList}>
              <li><Activity size={14} /> Protocol Compliance</li>
              <li><Users size={14} /> Identity Management</li>
              <li><Layers size={14} /> Network Analytics</li>
            </ul>
            <button className="posh-button" style={styles.cardBtn}>Access Admin Console <ArrowRight size={14} /></button>
          </div>

          {/* RECRUITER PILLAR */}
          <div className="glass-card animate-fade-up delay-2" style={{ ...styles.featureCard, ...styles.highlightCard }}>
            <div style={{ ...styles.iconBox, background: 'rgba(59, 130, 246, 0.2)' }}>
              <Cpu size={28} color="#3b82f6" />
            </div>
            <h3 style={styles.cardTitle}>AI Strategist</h3>
            <p style={styles.cardDesc}>Leverage neural intelligence to source, evaluate, and engage elite talent with surgical precision.</p>
            <ul style={styles.featureList}>
              <li><Zap size={14} /> Interview Intelligence</li>
              <li><Briefcase size={14} /> Job Design Studio</li>
              <li><TrendingUp size={14} /> Predictive Hiring</li>
            </ul>
            <button className="posh-button posh-button-primary" style={styles.cardBtn}>Dispatch AI Agent <ArrowRight size={14} /></button>
          </div>

          {/* SEEKER PILLAR */}
          <div className="glass-card animate-fade-up delay-3" style={styles.featureCard}>
            <div style={styles.iconBox}>
              <Globe size={28} color="#3b82f6" />
            </div>
            <h3 style={styles.cardTitle}>Career Architect</h3>
            <p style={styles.cardDesc}>Navigate the market with AI-optimized profiles, direct matching, and real-time trajectory tracking.</p>
            <ul style={styles.featureList}>
              <li><Sparkles size={14} /> Resume Synthesis</li>
              <li><Briefcase size={14} /> Matrix Matching</li>
              <li><Activity size={14} /> Growth Roadmap</li>
            </ul>
            <button className="posh-button" style={styles.cardBtn}>Begin Ascent <ArrowRight size={14} /></button>
          </div>
        </div>
      </div>

      <footer style={styles.platformMeta} className="animate-fade-up delay-4">
        <div style={styles.metaItem}>
          <strong style={styles.metaVal}>14k+</strong>
          <span style={styles.metaLabel}>Intelligent Syncs</span>
        </div>
        <div style={styles.metaDivider} />
        <div style={styles.metaItem}>
          <strong style={styles.metaVal}>99.8%</strong>
          <span style={styles.metaLabel}>Match Precision</span>
        </div>
        <div style={styles.metaDivider} />
        <div style={styles.metaItem}>
          <strong style={styles.metaVal}>20+</strong>
          <span style={styles.metaLabel}>Industry Sectors</span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  heroSection: {
    textAlign: 'center',
    padding: '80px 0',
    marginBottom: '60px',
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
    fontSize: '6rem',
    margin: 0,
    fontWeight: '900',
    letterSpacing: '-2px',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: 'var(--text-muted)',
    maxWidth: '800px',
    margin: '20px auto 40px',
    lineHeight: '1.6',
  },
  highlightText: {
    color: 'white',
    fontWeight: '700',
  },
  heroActions: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  heroBtn: {
    padding: '0 40px',
    height: '65px',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  featuresSection: {
    marginTop: '100px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
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
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
  },
  featureCard: {
    padding: '50px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
    borderRadius: '35px',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  highlightCard: {
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    transform: 'scale(1.05)',
    zIndex: 2,
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
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
  },
  cardDesc: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    margin: 0,
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0 20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  featureList_li: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  cardBtn: {
    marginTop: 'auto',
    width: '100%',
    height: '50px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  platformMeta: {
    marginTop: '120px',
    padding: '60px',
    borderRadius: '40px',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '80px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  metaItem: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  metaVal: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'white',
  },
  metaLabel: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  metaDivider: {
    width: '1px',
    height: '60px',
    background: 'rgba(255,255,255,0.1)',
  }
};
