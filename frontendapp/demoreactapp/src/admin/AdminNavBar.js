import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './admin.css';

import AdminHome from './AdminHome';
import ViewJobSeekers from './ViewJobSeekers';
import AddRecruiter from './AddRecruiter';
import ViewRecruiters from './ViewRecruiters';
import ChangeAdminPwd from './ChangeAdminPwd';
import ViewJobSeekerProfile from './ViewJobSeekerProfile';
import AddEvent from './AddEvent';
import ViewEvents from './ViewEvents';

export default function AdminNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('admin');
    navigate('/adminlogin');
    window.location.reload();
  };

  return (
    <div style={navStyles.wrapper}>
      <div style={navStyles.navContainer}>
        <nav style={navStyles.nav} className="glass-panel animate-fade-up">
          <div style={navStyles.container}>
            <div style={navStyles.logo} className="font-heading">
              <span style={navStyles.logoIcon}>🚀</span>
              <span className="gradient-text">Auralytica</span>
              <span style={{ fontSize: '10px', color: '#94a3b8', verticalAlign: 'middle', marginLeft: '5px' }}>ADMIN</span>
            </div>

            <ul style={navStyles.ul}>
              <li><Link to="/adminhome" style={navStyles.link}>Home</Link></li>

              <li className="dropdown">
                <span style={navStyles.link} className="dropdown-trigger">
                  👥 Users <span style={{ fontSize: '10px' }}>▼</span>
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdown}>
                  <Link to="/viewjobseekers">View Seekers</Link>
                  <Link to="/addrecruiter">Add Recruiter</Link>
                  <Link to="/viewrecruiters">View Recruiters</Link>
                </div>
              </li>

              <li className="dropdown">
                <span style={navStyles.link} className="dropdown-trigger">
                  📅 Events <span style={{ fontSize: '10px' }}>▼</span>
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdown}>
                  <Link to="/createevent">Create Event</Link>
                  <Link to="/viewevents">Monitor Events</Link>
                </div>
              </li>

              <li className="dropdown">
                <span style={navStyles.profileBadge} className="dropdown-trigger">
                  A
                </span>
                <div className="dropdown-content glass-panel" style={navStyles.dropdownRight}>
                  <Link to="/changeadminpwd">⚙️ Security</Link>
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
          <Route path="/adminhome" element={<AdminHome />} exact />
          <Route path="/viewjobseekers" element={<ViewJobSeekers />} exact />
          <Route path="/addrecruiter" element={<AddRecruiter />} exact />
          <Route path="/viewrecruiters" element={<ViewRecruiters />} exact />
          <Route path="/changeadminpwd" element={<ChangeAdminPwd />} exact />
          <Route path="/viewjobseekerprofile/:email" element={<ViewJobSeekerProfile />} exact />
          <Route path="/createevent" element={<AddEvent />} exact />
          <Route path="/viewevents" element={<ViewEvents />} exact />
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
    maxWidth: '1200px',
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
    fontSize: '20px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '22px',
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
    background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    cursor: 'pointer',
    marginLeft: '10px',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
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