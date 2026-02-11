import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../config";
import { Bot, User, Paperclip, Send, Download, Trash2, Sparkles, MessageSquare, ShieldCheck, XCircle } from "lucide-react";

export default function AIBot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const chatBoxRef = useRef(null);
  const jobseeker = JSON.parse(localStorage.getItem("jobseeker"));

  // Auto-scroll logic
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat, loading]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await axios.get(
          `${config.url}/chat-history?userEmail=${jobseeker.email}&role=student`
        );
        setChat(res.data.messages || []);
      } catch (err) {
        console.log("No previous chat history");
      }
    };

    if (jobseeker?.email) {
      loadHistory();
    }
  }, [jobseeker?.email]);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setResume(file);
      setResumeUploaded(true);
      setChat(prev => [...prev, {
        sender: "system",
        text: `📎 Context updated with resume: ${file.name}`
      }]);
    }
  };

  const removeResume = () => {
    setResume(null);
    setResumeUploaded(false);
    setChat(prev => [...prev, {
      sender: "system",
      text: "❌ Resume context removed"
    }]);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setChat(prev => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      if (resume) {
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("question", userMessage);
        formData.append("userEmail", jobseeker.email);
        formData.append("role", "student");

        const res = await axios.post(
          `${config.url}/ask-with-resume`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setChat(prev => [...prev, { sender: "bot", text: res.data.answer }]);
      } else {
        const payload = {
          message: userMessage,
          userEmail: jobseeker.email,
          role: "student"
        };

        const res = await axios.post(
          `${config.url}/chat`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        setChat(prev => [...prev, { sender: "bot", text: res.data.reply }]);
      }
    } catch (err) {
      setChat(prev => [...prev, {
        sender: "bot",
        text: "My neural circuits are temporary busy. Let's try that again in a moment."
      }]);
    }

    setLoading(false);
  };

  const downloadLastResponse = async () => {
    const botMessages = chat.filter(m => m.sender === "bot");
    if (botMessages.length === 0) return;
    const lastResponse = botMessages[botMessages.length - 1].text;

    try {
      const res = await axios.post(
        `${config.url}/generate-questions-pdf`,
        { questions: [lastResponse] },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `AI_Response_${new Date().getTime()}.pdf`;
      link.click();
    } catch (err) {
      alert("Failed to generate PDF");
    }
  };

  const downloadAllQuestions = async () => {
    const questions = chat.filter(m => m.sender === "bot").map(m => m.text);
    if (questions.length === 0) return;

    try {
      const res = await axios.post(
        `${config.url}/generate-questions-pdf`,
        { questions },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "Full_Interview_Session.pdf";
      link.click();
    } catch (err) {
      alert("Failed to generate PDF");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header} className="animate-fade-up">
        <h1 style={styles.title} className="font-heading">
          <Bot size={32} style={{ color: 'var(--primary)', marginRight: '15px' }} />
          <span className="gradient-text">AI Interview Coach</span>
        </h1>
        <p style={styles.subtitle}>Your personalized mentorship for technical and behavioral mastery</p>
      </div>

      <div className="glass-card animate-fade-up delay-1" style={styles.chatWrapper}>
        {/* Context Bar */}
        <div style={styles.contextBar}>
          {resumeUploaded ? (
            <div style={styles.contextBadge}>
              <ShieldCheck size={14} color="#10b981" />
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Resume Context Active: {resume.name}</span>
              <button onClick={removeResume} style={styles.iconBtn}>
                <XCircle size={14} color="#ef4444" />
              </button>
            </div>
          ) : (
            <label style={styles.uploadLabel}>
              <Paperclip size={14} />
              Attach Resume for Context
              <input type="file" accept=".pdf" onChange={handleResumeUpload} style={{ display: "none" }} />
            </label>
          )}

          <div style={styles.actionRow}>
            <button onClick={downloadLastResponse} disabled={chat.filter(m => m.sender === 'bot').length === 0} style={styles.miniActionBtn}>
              <Download size={14} /> Export Last
            </button>
            <button onClick={downloadAllQuestions} disabled={chat.filter(m => m.sender === 'bot').length === 0} style={styles.miniActionBtn}>
              <MessageSquare size={14} /> Full Transcript
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={chatBoxRef} style={styles.chatBox}>
          {chat.length === 0 && (
            <div style={styles.emptyState}>
              <Sparkles size={48} color="rgba(255,255,255,0.05)" style={{ marginBottom: '20px' }} />
              <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Neural Engine Ready</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Ask about specific technologies, mock interview scenarios, or upload your resume for tailored feedback.
              </p>
            </div>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className="animate-fade-up"
              style={{
                ...styles.messageContainer,
                justifyContent:
                  msg.sender === "user" ? "flex-end" :
                    msg.sender === "system" ? "center" : "flex-start",
              }}
            >
              {msg.sender === "bot" && (
                <div style={styles.avatarBot}><Bot size={16} color="white" /></div>
              )}

              <div
                style={{
                  ...styles.message,
                  ...(msg.sender === "user" ? styles.userMessage :
                    msg.sender === "system" ? styles.systemMessage : styles.botMessage)
                }}
              >
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div style={styles.avatarUser}><User size={16} color="white" /></div>
              )}
            </div>
          ))}

          {loading && (
            <div style={styles.messageContainer} className="animate-fade-up">
              <div style={styles.avatarBot}><Bot size={16} color="white" /></div>
              <div style={{ ...styles.message, ...styles.botMessage, fontStyle: 'italic', opacity: 0.7 }}>
                Processing response...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder={resumeUploaded ? "Ask about your profile..." : "Type your message..."}
              style={styles.input}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="posh-button posh-button-primary"
              style={styles.sendBtn}
              disabled={loading || !message.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "var(--text-muted)",
  },
  chatWrapper: {
    height: "700px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(20px)",
    border: "1px solid var(--glass-border)",
    borderRadius: "24px",
  },
  contextBar: {
    padding: "15px 25px",
    borderBottom: "1px solid var(--glass-border)",
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contextBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(16, 185, 129, 0.1)",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    color: "#10b981",
  },
  iconBtn: {
    background: "none",
    border: "none",
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  uploadLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "color 0.3s ease",
    ":hover": { color: 'var(--primary)' }
  },
  actionRow: {
    display: "flex",
    gap: "10px",
  },
  miniActionBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--text-main)",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  chatBox: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    scrollBehavior: "smooth",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    opacity: 0.8,
  },
  messageContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    maxWidth: "85%",
  },
  message: {
    padding: "14px 18px",
    borderRadius: "18px",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  userMessage: {
    background: "linear-gradient(135deg, var(--primary), #9333ea)",
    color: "white",
    borderBottomRightRadius: "4px",
    alignSelf: "flex-end",
  },
  botMessage: {
    background: "rgba(255, 255, 255, 0.05)",
    color: "var(--text-main)",
    borderBottomLeftRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  systemMessage: {
    background: "rgba(255, 255, 255, 0.03)",
    color: "var(--text-muted)",
    fontSize: "0.8rem",
    padding: "8px 16px",
    borderRadius: "20px",
    textAlign: "center",
    alignSelf: "center",
  },
  avatarBot: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    background: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarUser: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  inputArea: {
    padding: "20px 25px 30px",
    background: "rgba(0,0,0,0.2)",
    borderTop: "1px solid var(--glass-border)",
  },
  inputContainer: {
    display: "flex",
    gap: "12px",
    background: "rgba(0,0,0,0.3)",
    padding: "8px",
    borderRadius: "16px",
    border: "1px solid var(--glass-border)",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    padding: "0 15px",
    fontSize: "1rem",
    outline: "none",
  },
  sendBtn: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
  }
};
