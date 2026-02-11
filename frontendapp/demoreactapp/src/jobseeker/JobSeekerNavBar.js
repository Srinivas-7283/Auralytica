import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './jobseeker.css';

import JobSeekerHome from './JobSeekerHome';
import JobSeekerProfile from './JobSeekerProfile';
import ViewJobsPosted from './ViewJobsPosted';
import ViewAppliedJobs from './ViewAppliedJobs';
import UpdateJSProfile from './UpdateJSProfile';
import AIBot from './AIBot';
import JobSeekerMeetings from './JobSeekerMeetings';
import JitsiMeeting from '../components/JitsiMeeting';

// AI Features
import ResumeOptimizer from './ResumeOptimizer';
import SmartJobMatching from './SmartJobMatching';
import CoverLetterGenerator from './CoverLetterGenerator';
import CareerPathAdvisor from './CareerPathAdvisor';

export default function JobSeekerNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isJobSeekerLoggedIn');
    localStorage.removeItem('jobseeker');
    navigate('/jobseekerlogin');
    window.location.reload();
  };

  const jobseeker = JSON.parse(localStorage.getItem('jobseeker') || '{}');

  return (
    <div style={navStyles.wrapper}>
      <div style={navStyles.navContainer}>
        <nav style={navStyles.nav} className="glass-panel animate-fade-up">
          <div style={navStyles.container}>
            <div style={navStyles.logo} className="font-heading">
              <span style={navStyles.logoIcon}>🚀</span>
              <span className="gradient-text">Auralytica</span>
            </div>

            <ul style={navStyles.ul}>
              <li><Link to="/jobseekerhome" style={navStyles.link}>Home</Link></li>
              <li><Link to="/viewjobsposted" style={navStyles.link}>Find Jobs</Link></li>
              <li><Link to="/viewappliedjobs" style={navStyles.link}>My Applications</Link></li>

              <li className="dropdown">
                <span style={navStyles.link} className="dropdown-trigger">
                  🤖 AI Tools <span style={{ fontSize: '10px' }}>▼</span>
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdown}>
                  <Link to="/student-ai">✨ Interview Coach</Link>
                  <Link to="/jobseeker/resume-optimizer">🎯 Resume Optimizer</Link>
                  <Link to="/jobseeker/job-matching">🔍 Smart Match</Link>
                  <Link to="/jobseeker/cover-letter">✉️ Cover Letter</Link>
                  <Link to="/jobseeker/career-advisor">🚀 Career Advisor</Link>
                </div>
              </li>

              <Link to="/jobseeker/meetings" style={navStyles.link}>📅 Interviews</Link>

              <li className="dropdown">
                <span style={navStyles.profileBadge} className="dropdown-trigger">
                  {jobseeker.name?.charAt(0) || 'U'}
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdownRight}>
                  <Link to="/jobseekerprofile">👤 View Profile</Link>
                  <Link to="/updatejobseekerprofile">⚙️ Settings</Link>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '5px 0' }}></div>
                  <button
                    onClick={handleLogout}
                    style={{ ...navStyles.logoutBtn, width: '100%', textAlign: 'left' }}
                  >
                    🚪 Logout
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div style={navStyles.content}>
        <Routes>
          <Route path="/jobseekerhome" element={<JobSeekerHome />} exact />
          <Route path="/jobseekerprofile" element={<JobSeekerProfile />} exact />
          <Route path="/updatejobseekerprofile" element={<UpdateJSProfile />} exact />
          <Route path="/viewjobsposted" element={<ViewJobsPosted />} exact />
          <Route path="/viewappliedjobs" element={<ViewAppliedJobs />} exact />
          <Route path="/student-ai" element={<AIBot />} exact />
          <Route path="/jobseeker/meetings" element={<JobSeekerMeetings />} />
          <Route path="/meeting/:meetingRoom" element={<JitsiMeeting />} />
          <Route path="/jobseeker/resume-optimizer" element={<ResumeOptimizer />} />
          <Route path="/jobseeker/job-matching" element={<SmartJobMatching />} />
          <Route path="/jobseeker/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="/jobseeker/career-advisor" element={<CareerPathAdvisor />} />
        </Routes>
      </div>
    </div>
  );
}

const navStyles = {
  wrapper: {
    minHeight: '100vh',
    position: 'relative',
  },
  navContainer: {
    position: 'fixed',
    top: '20px',
    left: '0',
    right: '0',
    width: '100%',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  nav: {
    width: '95%',
    maxWidth: '1300px',
    padding: '8px 25px',
    margin: '0 auto',
    pointerEvents: 'auto',
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '24px',
  },
  ul: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  profileBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    cursor: 'pointer',
    marginLeft: '10px',
    boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
  },
  dropdown: {
    minWidth: '200px',
    marginTop: '10px',
  },
  dropdownRight: {
    minWidth: '200px',
    marginTop: '10px',
    right: 0,
    left: 'auto',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    padding: '12px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  content: {
    paddingTop: '100px',
  }
};
