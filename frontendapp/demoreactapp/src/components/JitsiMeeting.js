import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';


export default function JitsiMeeting() {
  const { meetingRoom } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [meetingData, setMeetingData] = useState(null);
  const [error, setError] = useState(null);

  // Determine user type
  const recruiter = JSON.parse(localStorage.getItem('recruiter') || 'null');
  const jobseeker = JSON.parse(localStorage.getItem('jobseeker') || 'null');

  const userType = recruiter ? 'recruiter' : jobseeker ? 'jobseeker' : 'guest';
  const userName = recruiter?.name || jobseeker?.name || 'Guest';
  const userEmail = recruiter?.email || jobseeker?.email || '';

  useEffect(() => {
    // Load meeting details
    const loadMeetingDetails = async () => {
      try {
        const response = await axios.get(`${config.url}/api/meetings/${meetingRoom}`);
        setMeetingData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load meeting:', err);
        setError('Meeting not found');
        setLoading(false);
      }
    };

    if (meetingRoom) {
      loadMeetingDetails();
    }
  }, [meetingRoom]);

  useEffect(() => {
    // Only initialize Jitsi once we have meeting data and the container is ready
    if (!loading && !error && meetingData && jitsiContainerRef.current && !jitsiApiRef.current) {
      initializeJitsi();
    }

    // Cleanup function
    return () => {
      if (jitsiApiRef.current) {
        console.log('Cleaning up Jitsi instance');
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [loading, error, meetingData]);

  const initializeJitsi = () => {
    // Load Jitsi Meet API script if not already loaded
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      // Load script from the same domain we are using for meetings
      script.src = "https://meet.ffmuc.net/external_api.js";

      script.async = true;
      script.onload = () => startJitsi();
      document.body.appendChild(script);
    } else {
      startJitsi();
    }
  };

  const startJitsi = () => {
    if (jitsiApiRef.current) {
      console.log('Jitsi already initialized, skipping...');
      return;
    }

    // ✅ Using meet.ffmuc.net (Freifunk München) which is a stable community instance
    // that doesn't enforce the "Moderator Login" policy like meet.jit.si
    const domain = 'meet.ffmuc.net';

    const options = {
      roomName: meetingRoom,
      width: "100%",
      height: "100%",
      parentNode: jitsiContainerRef.current,

      configOverwrite: {
        prejoinPageEnabled: false, // Skip the "Before you join" screen
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableLobby: false,
        disableModeratorIndicator: false,
        enableUserRolesBasedOnToken: false,
        defaultLanguage: 'en',
        requireDisplayName: true
      },

      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        MOBILE_APP_PROMO: false,
        AUTHENTICATION_ENABLE: false, // Turn off auth UI
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'security'
        ]
      },

      userInfo: {
        displayName: userName,
        email: userEmail
      }
    };

    console.log(`🚀 Initializing Jitsi for room: ${meetingRoom} on domain: ${domain}`);

    try {
      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      // Event listeners
      api.addEventListener('videoConferenceJoined', async () => {
        console.log('✅ User joined the meeting');

        try {
          // Notify backend that user joined
          await axios.post(`${config.url}/api/meetings/join`, {
            meetingRoom: meetingRoom,
            userType: userType
          });
          console.log(`Backend notified of ${userType} joining`);
        } catch (err) {
          console.error('Failed to notify join:', err);
        }

        if (userType === 'recruiter') {
          api.executeCommand('toggleLobby', false);
        }
      });

      api.addEventListener('videoConferenceLeft', () => {
        console.log('👋 User left the meeting');
        handleMeetingLeave();
      });

      api.addEventListener('readyToClose', () => {
        console.log('🔴 Meeting ended');
        handleMeetingLeave();
      });

    } catch (error) {
      console.error('❌ Failed to initialize Jitsi:', error);
      setError('Failed to start meeting');
    }
  };

  const handleMeetingLeave = async () => {
    try {
      // Notify backend that user left
      await axios.post(`${config.url}/api/meetings/leave`, {
        meetingRoom: meetingRoom,
        userType: userType
      });
      console.log(`Backend notified of ${userType} leaving`);
    } catch (err) {
      console.error('Failed to notify leave:', err);
    }

    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }

    // Navigate based on user type
    if (userType === 'recruiter') {
      navigate('/recruiter/meetings');
    } else if (userType === 'jobseeker') {
      navigate('/jobseeker/meetings');
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading meeting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centerContainer}>
        <h2 style={styles.errorText}>❌ {error}</h2>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{meetingData?.meetingTitle || 'Interview Meeting'}</h2>
        <p style={styles.subtitle}>
          {userType === 'recruiter' ? '🎯 Recruiter View' : '👤 Candidate View'}
        </p>
      </div>

      {/* ✅ Single Jitsi Container */}
      <div ref={jitsiContainerRef} style={styles.jitsiContainer} />
    </div>
  );
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#1a1f3a'
  },
  header: {
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700'
  },
  subtitle: {
    margin: '5px 0 0 0',
    fontSize: '14px',
    opacity: 0.9
  },
  jitsiContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#1a1f3a',
    color: 'white'
  },
  loader: {
    border: '4px solid rgba(255,255,255,0.1)',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#94a3b8'
  },
  errorText: {
    color: '#ef4444',
    marginBottom: '20px'
  },
  backButton: {
    padding: '12px 30px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};