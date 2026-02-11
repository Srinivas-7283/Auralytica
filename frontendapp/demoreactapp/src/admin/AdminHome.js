import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

export default function AdminHome() {
  const [adminData, setAdminData] = useState("");
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedAdminData = localStorage.getItem('admin');
    if (storedAdminData) {
      const parsedAdminData = JSON.parse(storedAdminData);
      setAdminData(parsedAdminData);
      fetchCounts();
    }
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await axios.get(`${config.url}/analysis`);
      setCounts(response.data);
    } catch (error) {
      setError('Failed to fetch counts');
    }
  };

  const dashboardContainerStyle = {
    padding: '40px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
    animation: 'fadeIn 0.8s ease-out'
  };

  const welcomeStyle = {
    textAlign: 'center',
    color: '#e0e6ed',
    fontSize: '2rem',
    marginBottom: '40px',
    animation: 'slideInFromLeft 0.6s ease-out'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginTop: '30px'
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(15, 22, 41, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    padding: '35px',
    borderRadius: '20px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    animation: 'cardSlideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) backwards'
  };

  const cardHoverStyle = {
    transform: 'translateY(-10px)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    boxShadow: '0 25px 60px rgba(59, 130, 246, 0.3)'
  };

  const cardTitleStyle = {
    color: '#94a3b8',
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const cardValueStyle = {
    color: '#3b82f6',
    fontSize: '3rem',
    fontWeight: '700',
    margin: '10px 0'
  };

  const loadingStyle = {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '1.2rem',
    marginTop: '50px'
  };

  const errorStyle = {
    textAlign: 'center',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ef4444',
    marginTop: '20px'
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  const getCardColor = (index) => {
    const colors = [
      '#3b82f6', // Blue
      '#10b981', // Green
      '#8b5cf6', // Purple
      '#f59e0b', // Orange
      '#06b6d4', // Cyan
      '#ef4444'  // Red
    ];
    return colors[index % colors.length];
  };

  return (
    <div style={dashboardContainerStyle}>
      {adminData && (
        <div>
          <h4 style={welcomeStyle}>Welcome, {adminData.username}!</h4>
          {counts ? (
            <div style={gridStyle}>
              {[
                { title: 'Job Seekers', value: counts.jobseekerCount, icon: '👤' },
                { title: 'Recruiters', value: counts.recruiterCount, icon: '🏢' },
                { title: 'Jobs', value: counts.jobCount, icon: '💼' },
                { title: 'Job Applicants', value: counts.jobApplicantCount, icon: '📋' },
                { title: 'Selected Applicants', value: counts.selectedCount, icon: '✅' },
                { title: 'Rejected Applicants', value: counts.rejectedCount, icon: '❌' }
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...cardStyle,
                    ...(hoveredCard === index ? cardHoverStyle : {}),
                    animationDelay: `${index * 0.1}s`
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                    {item.icon}
                  </div>
                  <h3 style={cardTitleStyle}>{item.title}</h3>
                  <p style={{
                    ...cardValueStyle,
                    color: getCardColor(index)
                  }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={loadingStyle}>Loading dashboard data...</p>
          )}
          {error && <p style={errorStyle}>{error}</p>}
        </div>
      )}
    </div>
  );
}