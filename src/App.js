
"use client"
import "./App.css";
import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard.js";
import Signup from "./Signup.js";
import LoginPage from "./Login.js";
import QuizPage from "./QuizPage.js";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LiveTranscriber from "./LiveTranscriber.js";


function App() {
  console.log(localStorage.getItem("token")) // Debugging line to check token in localStorage
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false) // ✅ NEW
  const [showSignup, setShowSignup] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCourse, setQuizCourse] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showTranscriber, setShowTranscriber] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const res = await fetch("http://localhost:5050/api/auth/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (!res.ok) throw new Error("Unauthorized")

          const data = await res.json()
          setCurrentUser(data.user)
          setIsLoggedIn(true)
        } catch (err) {
          console.error("Auth failed:", err)
          setIsLoggedIn(false)
          localStorage.removeItem("token")
        }
      }
      setAuthChecked(true) // ✅ wait until check completes
    }

    checkAuth()
  }, [])

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError("")

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()
      setIsLoggedIn(true)
      setCurrentUser(data)
      setIsLoading(false)
      localStorage.setItem("token", data._id) // use Mongo _id as token


    
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed: " + error.message)
      setIsLoading(false)
    }
  }

  // Persist login state to localStorage
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn)
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("currentUser")
    }
  }, [isLoggedIn, currentUser])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowSignup(false)
    setShowQuiz(false)
    setQuizCourse("")
    setEmail("")
    setPassword("")
    setRememberMe(false)
    setEmailError("")
    localStorage.removeItem("token")
    navigate("/")
  }

  const handleShowSignup = () => navigate("/signup")
  const handleBackToLogin = () => navigate("/")
  const handleShowQuiz = (course) => navigate("/quiz")
  const handleBackToDashboard = () => navigate("/dashboard")

  if (!authChecked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route
            path="/"
            element={
              <LoginPage
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                handleSubmit={handleSubmit}
                emailError={emailError}
                isLoading={isLoading}
                handleShowSignup={handleShowSignup}
                setCurrentUser={setCurrentUser}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route path="/signup" element={<Signup onBackToLogin={handleBackToLogin} />} />
        </>
      ) : (
        <>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                user={currentUser}
                onLogout={handleLogout}
                onShowQuiz={handleShowQuiz}
                onShowTranscriber={() => navigate("/transcriber")}
              />
            }
          />
          <Route path="/quiz" element={<QuizPage onBackToDashboard={handleBackToDashboard} />} />
          <Route path="/transcriber" element={<LiveTranscriber onBack={() => navigate("/dashboard")} />} />
        </>
      )}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
    </Routes>
  )
}

export default App
