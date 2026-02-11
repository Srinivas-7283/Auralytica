import React from 'react'
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './recruiter.css'
import RecruiterHome from './RecruiterHome';
import RecruiterProfile from './RecruiterProfile';
import AddJob from './AddJob';
import ViewJobs from './ViewJobs';
import ViewJobApplicants from './ViewJobApplicants';
import AIBot from "./AIBot";
import RecruiterMeetings from './RecruiterMeetings';
import ScheduleMeeting from './ScheduleMeeting';
import JitsiMeeting from '../components/JitsiMeeting';

// AI Features
import JobDescriptionGenerator from './JobDescriptionGenerator';
import InterviewQuestionGenerator from './InterviewQuestionGenerator';
import EmailGenerator from './EmailGenerator';
import BiasChecker from './BiasChecker';
import HiringAnalytics from './HiringAnalytics';
export default function RecruiterNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isRecruiterLoggedIn');
    localStorage.removeItem('recruiter');
    navigate('/recruiterlogin');
    window.location.reload();
  };

  const recruiter = JSON.parse(localStorage.getItem('recruiter') || '{}');

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
              <li><Link to="/recruiterhome" style={navStyles.link}>Dashboard</Link></li>

              <li className="dropdown">
                <span style={navStyles.link} className="dropdown-trigger">
                  💼 Talent <span style={{ fontSize: '10px' }}>▼</span>
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdown}>
                  <Link to="/addjob">➕ Post New Job</Link>
                  <Link to="/viewjobs">📋 View My Jobs</Link>
                  <Link to="/viewjobapplicants">👥 Review Applicants</Link>
                </div>
              </li>

              <li><Link to="/recruiter/meetings" style={navStyles.link}>📅 Interviews</Link></li>

              <li className="dropdown">
                <span style={navStyles.link} className="dropdown-trigger">
                  🤖 AI Hiring <span style={{ fontSize: '10px' }}>▼</span>
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdown}>
                  <Link to="/recruiter-ai">✨ Hiring Assistant</Link>
                  <Link to="/recruiter/jd-generator">📝 Contextual JD</Link>
                  <Link to="/recruiter/interview-questions">❓ Question Bank</Link>
                  <Link to="/recruiter/email-generator">📧 Outreach Gen</Link>
                  <Link to="/recruiter/bias-checker">🔍 Bias Shield</Link>
                  <Link to="/recruiter/analytics">📊 Insights</Link>
                </div>
              </li>

              <li className="dropdown">
                <span style={navStyles.profileBadge} className="dropdown-trigger">
                  {recruiter.companyname?.charAt(0) || 'R'}
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdownRight}>
                  <Link to="/recruiterprofile">👤 Company Profile</Link>
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
          <Route path="/recruiterhome" element={<RecruiterHome />} exact />
          <Route path="/recruiterprofile" element={<RecruiterProfile />} exact />
          <Route path="/addjob" element={<AddJob />} exact />
          <Route path="/viewjobs" element={<ViewJobs />} exact />
          <Route path="/viewjobapplicants" element={<ViewJobApplicants />} exact />
          <Route path="/recruiter-ai" element={<AIBot />} exact />
          <Route path="/recruiter/meetings" element={<RecruiterMeetings />} />
          <Route path="/recruiter/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/meeting/:meetingRoom" element={<JitsiMeeting />} />
          <Route path="/recruiter/jd-generator" element={<JobDescriptionGenerator />} />
          <Route path="/recruiter/interview-questions" element={<InterviewQuestionGenerator />} />
          <Route path="/recruiter/email-generator" element={<EmailGenerator />} />
          <Route path="/recruiter/bias-checker" element={<BiasChecker />} />
          <Route path="/recruiter/analytics" element={<HiringAnalytics />} />
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
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    cursor: 'pointer',
    marginLeft: '10px',
    boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
  },
  dropdown: {
    minWidth: '220px',
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
