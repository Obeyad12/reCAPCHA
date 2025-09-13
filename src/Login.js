import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  handleSubmit,
  emailError,
  isLoading,
  handleShowSignup,
  setCurrentUser,
  setIsLoggedIn
}) => {

    const navigate = useNavigate();

    // Dev login handler (only for login page)
  const handleDevLogin = () => {
    setCurrentUser({
      firstName: 'Dev',
      lastName: 'User',
      email: 'dev@localhost',
      _id: 'dev123',
      googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID // from .env
    });
    setIsLoggedIn(true);
    localStorage.setItem("token", "dev-token-123");
    navigate("/dashboard"); // Redirect to dashboard
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
            <h2 className="card-title">Sign In</h2>
            <p className="card-description">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="card-content">
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-container">
                  {/* Email Icon (Envelope SVG) */}
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
                  <p
                    style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                  >
                    {emailError}
                  </p>
                )}
              </div>

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
                    placeholder="Enter your password"
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
                    {/* Eye/Eye-off SVG */}
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 1l22 22"/><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.92"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Removed remember me and forgot password */}

              <button
                type="submit"
                disabled={isLoading}
                className={`submit-button ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            {/* Removed Dev Login Button */}
            <div className="signup-section">
              <p className="signup-text">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="signup-link"
                  onClick={handleShowSignup}
                >
                  Sign up
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
  );
};

export default LoginPage;