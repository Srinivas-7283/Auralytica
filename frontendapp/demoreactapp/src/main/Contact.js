import React from 'react';
import {
  Mail, Phone, MapPin, Clock,
  Send, Globe, MessageSquare,
  ShieldCheck, Sparkles, ArrowRight
} from 'lucide-react';

export default function Contact() {
  return (
    <div style={styles.container}>
      <header className="animate-fade-up" style={styles.header}>
        <div style={styles.badge}>
          <MessageSquare size={14} color="#3b82f6" />
          <span>GLOBAL ENGAGEMENT HUB</span>
        </div>
        <h1 style={styles.mainTitle} className="font-heading">Connect with Auralytica</h1>
        <p style={styles.heroSub}>Synchronizing professional inquiries with our strategic support nodes.</p>
      </header>

      <div style={styles.contactGrid}>
        {/* EMAIL CHANNELS */}
        <div className="glass-card animate-fade-up delay-1" style={styles.contactCard}>
          <div style={styles.iconBox}>
            <Mail size={28} color="#3b82f6" />
          </div>
          <h3 style={styles.cardTitle}>Digital Correspondence</h3>
          <div style={styles.infoSec}>
            <p style={styles.infoLabel}>General Inquiries</p>
            <p style={styles.infoVal}>hello@auralytica.ai</p>
          </div>
          <div style={styles.infoSec}>
            <p style={styles.infoLabel}>Institutional Support</p>
            <p style={styles.infoVal}>support@auralytica.ai</p>
          </div>
          <button className="posh-button posh-button-primary" style={styles.cardBtn}>
            Dispatch Signal <Send size={16} />
          </button>
        </div>

        {/* VOICE CHANNELS */}
        <div className="glass-card animate-fade-up delay-2" style={{ ...styles.contactCard, ...styles.highlightCard }}>
          <div style={{ ...styles.iconBox, background: 'rgba(59, 130, 246, 0.2)' }}>
            <Phone size={28} color="#3b82f6" />
          </div>
          <h3 style={styles.cardTitle}>Direct Dialogue</h3>
          <div style={styles.infoSec}>
            <p style={styles.infoLabel}>Strategic Partnerships</p>
            <p style={styles.infoVal}>+1 (888) AURA-LYT</p>
          </div>
          <div style={styles.infoSec}>
            <p style={styles.infoLabel}>Global Operations</p>
            <p style={styles.infoVal}>+1 (555) 012-3456</p>
          </div>
          <button className="posh-button" style={styles.cardBtn}>
            Initialize Call <Phone size={16} />
          </button>
        </div>

        {/* LOGISTICS HQ */}
        <div className="glass-card animate-fade-up delay-3" style={styles.contactCard}>
          <div style={styles.iconBox}>
            <MapPin size={28} color="#3b82f6" />
          </div>
          <h3 style={styles.cardTitle}>Physical Logistics</h3>
          <div style={styles.infoSec}>
            <p style={styles.infoLabel}>Global Headquarters</p>
            <p style={styles.infoVal}>
              123 Innovation Drive, Suite 400<br />
              Tech Valley, CA 94025
            </p>
          </div>
          <div style={styles.infoSec}>
            <p style={styles.infoLabel}><Clock size={12} /> Operational Window</p>
            <p style={styles.infoVal}>09:00 - 18:00 PST | Mon - Fri</p>
          </div>
          <button className="posh-button" style={styles.cardBtn}>
            Locate Node <Globe size={16} />
          </button>
        </div>
      </div>

      <div className="glass-card animate-fade-up delay-4" style={styles.securitySeal}>
        <ShieldCheck size={20} color="#3b82f6" />
        <span style={styles.sealText}>All communications are processed through our encrypted Auralytica Nodal Network (AES-256).</span>
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
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    marginBottom: '80px',
  },
  contactCard: {
    padding: '50px 40px',
    borderRadius: '35px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    textAlign: 'center',
    alignItems: 'center',
  },
  highlightCard: {
    background: 'rgba(59, 130, 246, 0.03)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    transform: 'translateY(-10px)',
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
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'white',
    margin: 0,
  },
  infoSec: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  infoLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  infoVal: {
    fontSize: '1.1rem',
    color: 'white',
    fontWeight: '600',
    margin: 0,
    lineHeight: '1.5',
  },
  cardBtn: {
    marginTop: '20px',
    width: '100%',
    height: '50px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  securitySeal: {
    padding: '30px',
    borderRadius: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  sealText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '500',
    maxWidth: '500px',
    textAlign: 'center',
  }
};