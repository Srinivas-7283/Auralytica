import React, { useState } from 'react';
import './recruiter.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';



export default function RecruiterLogin({ onRecruiterLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.url}/checkrecruiterlogin`, formData);
      if (response.data != null) {
        onRecruiterLogin();

        localStorage.setItem('recruiter', JSON.stringify(response.data));

        navigate("/recruiterhome");
      }
      else {
        setMessage("Login Failed")
        setError("")
      }
    }
    catch (error) {
      setMessage("")
      setError(error.message)
    }
  };

  return (
    <div>
      <h3 align="center"><u>Recruiter Login</u></h3>
      {
        message ? <h4 align="center">{message}</h4> : <h4 align="center">{error}</h4>
      }
      <form onSubmit={handleSubmit} style={{
        maxWidth: '450px',
        margin: '40px auto',
        padding: '40px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white'
          }} />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white'
          }} />
        </div>
        <button type="submit" className="posh-button posh-button-primary" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
}
