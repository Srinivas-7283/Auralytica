import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import './style.css';
import JobSeekerLogin from './../jobseeker/JobSeekerLogin';
import Registration from './../jobseeker/Registration';
import Contact from './Contact';
import AdminLogin from './../admin/AdminLogin';
import RecruiterLogin from '../recruiter/RecruiterLogin';
import PageNotFound from './PageNotFound';

export default function MainNavBar({ onAdminLogin, onJobSeekerLogin, onRecruiterLogin }) {
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
              <li><Link to="/" style={navStyles.link}>Home</Link></li>
              <li><Link to="/about" style={navStyles.link}>About</Link></li>
              <li><Link to="/registration" style={navStyles.link}>Register</Link></li>
              <li className="dropdown">
                <span style={navStyles.link} className="dropdown-trigger">
                  Login <span style={{ fontSize: '10px' }}>▼</span>
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdown}>
                  <Link to="/jobseekerlogin">Job Seeker</Link>
                  <Link to="/recruiterlogin">Recruiter</Link>
                  <Link to="/adminlogin">Admin</Link>
                </div>
              </li>
              <li>
                <Link to="/contact" className="posh-button posh-button-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div style={navStyles.content}>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/about" element={<About />} exact />
          <Route path="/registration" element={<Registration />} exact />
          <Route path="/jobseekerlogin" element={<JobSeekerLogin onJobSeekerLogin={onJobSeekerLogin} />} exact />
          <Route path="/adminlogin" element={<AdminLogin onAdminLogin={onAdminLogin} />} exact />
          <Route path="/recruiterlogin" element={<RecruiterLogin onRecruiterLogin={onRecruiterLogin} />} exact />
          <Route path="/contact" element={<Contact />} exact />
          <Route path="*" element={<PageNotFound />} exact />
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
    fontSize: '24px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '28px',
  },
  ul: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
    padding: '10px 15px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  dropdown: {
    minWidth: '180px',
    marginTop: '10px',
  },
  content: {
    paddingTop: '100px',
  }
};






