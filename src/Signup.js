import React, { useState } from "react"
import './App.css'

function Signup({ onBackToLogin, onSignupSuccess }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
  
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5050/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      setIsLoading(false);
      alert("Account created successfully! Please sign in.");
      onBackToLogin();
    } catch (error) {
      setEmailError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo/Brand Section */}
        <div className="brand-section">
          <div className="logo-container">
            {/* Green Pineapple SVG */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <ellipse cx="24" cy="32" rx="12" ry="14" fill="#27ae60" />
              <path d="M24 10 L28 20 L20 20 Z" fill="#229954" />
              <path d="M24 6 L26 14 L22 14 Z" fill="#229954" />
              <path d="M24 2 L25 8 L23 8 Z" fill="#229954" />
            </svg>
          </div>
          <h1 className="brand-title">Recapcha</h1>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Sign Up</h2>
            <p className="card-description">Fill in your information to create an account</p>
          </div>

          <div className="card-content">
            <form onSubmit={handleSubmit} className="login-form">
              {/* First Name & Last Name Row */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <div className="input-container">
                    {/* User Icon */}
                    <span className="input-icon" style={{ display: "flex", alignItems: "center" }}>
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
                    </span>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <div className="input-container">
                    {/* User Icon */}
                    <span className="input-icon" style={{ display: "flex", alignItems: "center" }}>
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
                    </span>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-container">
                  {/* Email Icon */}
                  <span className="input-icon" style={{ display: "flex", alignItems: "center" }}>
                    <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><polyline points="2,7 12,13 22,7" /></svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                {emailError && (
                  <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-container">
                  {/* Lock Icon */}
                  <span className="input-icon" style={{ display: "flex", alignItems: "center" }}>
                    <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="7" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label="Toggle password visibility"
                    style={{ background: "none", border: "none", marginLeft: 6, cursor: "pointer" }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.92"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-container">
                  {/* Lock Icon */}
                  <span className="input-icon" style={{ display: "flex", alignItems: "center" }}>
                    <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="7" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    aria-label="Toggle confirm password visibility"
                    style={{ background: "none", border: "none", marginLeft: 6, cursor: "pointer" }}
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.92"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`submit-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="signup-section">
              <p className="signup-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="signup-link"
                  onClick={onBackToLogin}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="footer" style={{ textAlign: "center", marginTop: 32, color: "#229954", fontWeight: 600 }}>
          Green Pineapple SpurHacks 2025
        </div>
      </div>
    </div>
  )
}

export default Signup