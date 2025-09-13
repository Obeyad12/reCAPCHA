"use client"

import { useState, useEffect, useRef } from "react"
import "./App.css"
import CourseModel from "./CourseModel.js"
import QuizModel from "./QuizModel.js"
import { useNavigate } from "react-router-dom"
import { gapi } from "gapi-script"

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
const SCOPES = "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file"

function Dashboard({ user, onLogout, onShowQuiz, onShowTranscriber }) {
  const [isRecording, setIsRecording] = useState(false)
  const [showCourseModel, setShowCourseModel] = useState(false)
  const [showQuizModel, setShowQuizModel] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState("")
  const [recordingTimer, setRecordingTimer] = useState(0)

  const tokenClient = useRef(null)
  const accessToken = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1"],
      })
    }
    gapi.load("client", start)

    const interval = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        tokenClient.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            accessToken.current = tokenResponse.access_token
            gapi.client.setToken({ access_token: accessToken.current })
          },
        })
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`
  const firstName = user.firstName

  const handleStartRecording = () => {
    if (!isRecording) {
      setShowCourseModel(true)
    } else {
      setIsRecording(false)
      setRecordingTimer(0)
      setShowQuizModel(true)
    }
  }

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId)
    setIsRecording(true)
    setShowCourseModel(false)

    const timer = setInterval(() => {
      setRecordingTimer((prev) => prev + 1)
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      if (isRecording) {
        setIsRecording(false)
        setRecordingTimer(0)
        setShowQuizModel(true)
      }
    }, 10000)
  }

  const handleTakeQuiz = () => {
    setShowQuizModel(false)
    onShowQuiz(selectedCourse)
  }

  const handleBackToDashboard = () => {
    setShowQuizModel(false)
    setSelectedCourse("")
  }

  const handleLogout = () => {
    console.log("Logging out...")
    onLogout()
    setTimeout(() => navigate("/"), 0)
  }

  const getCourseName = (courseId) => {
    const courseNames = {
      calculus: "Calculus",
      "linear-algebra": "Linear Algebra",
      biology: "Biology",
      physics: "Physics",
      chemistry: "Chemistry",
      history: "History",
      music: "Music",
    }
    return courseNames[courseId] || courseId
  }

  const realRecording = () => {
    navigate("/transcriber")
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const quickActions = [
    {
      title: "Start Live Transcription",
      description: "Begin recording and transcribing audio in real-time",
      icon: "🎤",
      color: "emerald",
      action: onShowTranscriber,
    },
  ]

  return (
    <div className="dashboard-container">
      {/* Enhanced Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="dashboard-brand-section">
            <div className="dashboard-brand-logo">
              <span className="dashboard-brand-icon">R</span>
              <div className="brand-glow"></div>
            </div>
            <div className="brand-text">
              <h1 className="dashboard-brand-title">recapCHA</h1>
              <p className="dashboard-brand-subtitle">AI Learning Assistant</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="user-section">
              <div className="user-info">
                <p className="user-name">{fullName}</p>
                <p className="user-email">{user.email}</p>
              </div>
              <div className="user-avatar">
                <span className="avatar-text">{firstName.charAt(0).toUpperCase()}</span>
                <div className="avatar-status"></div>
              </div>
              <button className="logout-button" onClick={onLogout} title="Logout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Enhanced Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h2 className="welcome-title">
              Welcome back, {firstName}!<span className="wave-emoji">👋</span>
            </h2>
            <p className="welcome-subtitle">Ready to continue your learning journey? </p>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h3 className="section-title">Quick Actions</h3>
          </div>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className={`action-card ${action.color}`} onClick={action.action}>
                <div className="action-content">
                  <div className="action-icon-wrapper">
                    <div className="action-icon">
                      <span>{action.icon}</span>
                    </div>
                  </div>
                  <div className="action-text">
                    <h4 className="action-title">{action.title}</h4>
                    <p className="action-description">{action.description}</p>
                  </div>
                  <div className="action-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section - Why recapCHA? */}
        <div className="about-section" style={{ maxWidth: 700, margin: "40px auto 0", padding: "32px 24px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.04)", textAlign: "center" }}>
          {/* Why It Matters */}
          <h2 style={{ fontSize: "2rem", color: "#1a2a4f", marginBottom: 8 }}>
            Why recapCHA?
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#3a3a3a", marginBottom: 24 }}>
            Taking notes while trying to learn is hard.<br />
            With recapCHA, just hit <strong>Record</strong> — we transcribe, summarize, and store your lecture notes, so you never miss a thing.
          </p>
          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "32px 0" }} />

          {/* Simple Illustration */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🧑‍🎓</div>
              <div style={{ color: "#1a2a4f", fontWeight: 500 }}>Focused Learning</div>
            </div>
            <div style={{ fontSize: 32, color: "#bbb" }}>vs</div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🤹‍♂️</div>
              <div style={{ color: "#1a2a4f", fontWeight: 500 }}>Multitasking Mess</div>
            </div>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "32px 0" }} />

          {/* How It Works */}
          <h3 style={{ fontSize: "1.3rem", color: "#1a2a4f", marginBottom: 16 }}>How It Works</h3>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎙️</div>
              <div>1. Record your lecture with one click</div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✍️</div>
              <div>2. See live transcription in real-time</div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
              <div>3. Get summarized notes and export as .txt or Google Doc</div>
            </div>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "32px 0" }} />

          {/* Key Features */}
          <h3 style={{ fontSize: "1.3rem", color: "#1a2a4f", marginBottom: 16 }}>Key Features</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", color: "#3a3a3a", fontSize: "1.05rem" }}>
            <li style={{ marginBottom: 8 }}>✅ AI-Powered Summarization</li>
            <li style={{ marginBottom: 8 }}>🎧 Real-Time Transcription</li>
            <li style={{ marginBottom: 8 }}>📝 Export to Google Docs or Download .txt</li>
            <li>🔒 No distractions, no clutter — just focused learning</li>
          </ul>
          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "32px 0" }} />

          {/* Final CTA */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontWeight: 600, color: "#1a2a4f", marginBottom: 12 }}>Ready to Learn Smarter?</h3>
            <p style={{ color: "#3a3a3a", marginBottom: 16 }}>🎧 Just hit record. We’ll handle the notes.</p>
            <button
              onClick={onShowTranscriber}
              style={{
                background: "#1a2a4f",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px 36px",
                fontSize: "1.1rem",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              Start Recording Now
            </button>
          </div>
        </div>

        {/* Models */}
        <CourseModel
          isOpen={showCourseModel}
          onClose={() => setShowCourseModel(false)}
          onSelectCourse={handleCourseSelect}
        />

        <QuizModel
          isOpen={showQuizModel}
          onClose={handleBackToDashboard}
          onTakeQuiz={handleTakeQuiz}
          courseName={getCourseName(selectedCourse)}
        />
      </div>
    </div>
  )
}

export default Dashboard
