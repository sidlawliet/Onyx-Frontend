import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button, Tabs } from '../components/UI';
import NodeGraph from '../components/NodeGraph';
import { api } from '../api';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  UserPlus,
  CreditCard,
  LogIn
} from 'lucide-react';

/* ================================================================
   Onyx Logo SVG — Hexagonal Crystal with Radiant Diamond Core
   ================================================================ */
function OnyxLogo({ size = 150 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes onyxHexPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.45; }
        }
        @keyframes onyxCoreGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.7)); }
          50% { filter: drop-shadow(0 0 22px rgba(0, 240, 255, 1)); }
        }
      `}</style>
      
      {/* Outer ambient glow pulse ring */}
      <div style={{
        position: 'absolute',
        width: size * 1.15,
        height: size * 1.15,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 163, 255, 0.25) 0%, transparent 70%)',
        animation: 'onyxHexPulse 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="loginOnyxLeft" x1="12" y1="27" x2="50" y2="73" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>
          <linearGradient id="loginOnyxTopRight" x1="50" y1="5" x2="88" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#00A3FF" />
          </linearGradient>
          <linearGradient id="loginOnyxBottomRight" x1="50" y1="55" x2="88" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="loginOnyxDiamond" x1="36" y1="36" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="50%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon Frame */}
        <path
          d="M50 5L88 27V73L50 95L12 73V27L50 5Z"
          fill="#0F172A"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Left Dark Navy Facet */}
        <path
          d="M50 5L12 27V73L50 95L50 50Z"
          fill="url(#loginOnyxLeft)"
        />

        {/* Top-Right Vibrant Azure Facet */}
        <path
          d="M50 5L88 27L65 58L50 50Z"
          fill="url(#loginOnyxTopRight)"
        />

        {/* Bottom-Right Cobalt Facet */}
        <path
          d="M88 27V73L50 95L65 58Z"
          fill="url(#loginOnyxBottomRight)"
        />

        {/* Facet Lines */}
        <path d="M50 5L50 50L12 73" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <path d="M50 50L88 27" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M50 50L65 58L50 95" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Center Radiant Diamond */}
        <g style={{ animation: 'onyxCoreGlow 3s ease-in-out infinite' }}>
          <path
            d="M50 36L64 50L50 64L36 50Z"
            fill="url(#loginOnyxDiamond)"
          />
          <path
            d="M50 42L58 50L50 58L42 50Z"
            fill="#F0F9FF"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
}

/* ================================================================
   Main Login / Create Account Page Component
   ================================================================ */
export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  
  // 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'officer'

  // Customer Login State
  const [username, setUsername] = useState('siddharth_kumar');
  const [customerPassword, setCustomerPassword] = useState('secure_pass_123');
  const [customerLoading, setCustomerLoading] = useState(false);

  // Officer Login State
  const [officerId, setOfficerId] = useState('OFFICER-901');
  const [officerPassword, setOfficerPassword] = useState('bank_secure_pass');
  const [officerLoading, setOfficerLoading] = useState(false);

  // Register State
  const [regRole, setRegRole] = useState('customer'); // 'customer' | 'officer'
  const [regHolderName, setRegHolderName] = useState('');
  const [regAccountNumber, setRegAccountNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmployeeId, setRegEmployeeId] = useState('');
  const [regOfficerPassword, setRegOfficerPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Error/Message state
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Switch Auth Mode
  const switchMode = (mode) => {
    setAuthMode(mode);
    setError(null);
    setMessage(null);
  };

  // 1. Customer: Direct Password Login
  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setCustomerLoading(true);
    try {
      const user = await api.customerLogin({ username, password: customerPassword });
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/check');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setCustomerLoading(false);
    }
  };

  // 2. Bank Officer: Login
  const handleOfficerLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setOfficerLoading(true);
    try {
      const user = await api.officerLogin({ officerId, password: officerPassword });
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/complaints');
    } catch (err) {
      setError(err.message || 'Officer login failed.');
    } finally {
      setOfficerLoading(false);
    }
  };

  // 3a. Create User / Customer Account
  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setRegisterLoading(true);
    try {
      const user = await api.customerRegister({
        accountHolderName: regHolderName,
        accountNumber: regAccountNumber,
        password: regPassword
      });
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/check');
    } catch (err) {
      setError(err.message || 'Failed to create user account.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // 3b. Create Bank Officer Account
  const handleOfficerRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setRegisterLoading(true);
    try {
      const user = await api.officerRegister({
        employeeId: regEmployeeId,
        password: regOfficerPassword
      });
      if (onLoginSuccess) onLoginSuccess(user);
      navigate('/complaints');
    } catch (err) {
      setError(err.message || 'Failed to create officer account.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Dynamic CSS for 3D flip card animation */}
      <style>{`
        .auth-perspective-box {
          perspective: 1000px;
          width: 100%;
        }
        .auth-flipper {
          position: relative;
          width: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .auth-flipper.is-register {
          transform: rotateY(180deg);
        }
        .auth-face {
          width: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .auth-face-front {
          position: relative;
          z-index: 2;
          transform: rotateY(0deg);
        }
        .auth-face-back {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotateY(180deg);
        }
      `}</style>

      {/* ====== LEFT HALF — Dark branded panel with node animation ====== */}
      <div style={styles.leftPanel}>
        <NodeGraph theme="cyan" />
        <div style={styles.leftOverlay} />

        <div style={styles.leftContent}>
          <div style={styles.logoContainer}>
            <OnyxLogo size={140} />
          </div>
          <h1 style={styles.brandName}>ONYX</h1>
          <div style={styles.brandDivider} />
          <p style={styles.brandTagline}>
            PURE SIGNAL. ZERO FRAUD.
          </p>
        </div>
      </div>

      {/* ====== RIGHT HALF — Tilted divider & animated Auth Card ====== */}
      <div style={styles.rightPanel}>
        {/* Emerald Green Node Graph Canvas in Background */}
        <NodeGraph theme="emerald" />

        {/* Ambient Emerald Overlay */}
        <div style={styles.rightOverlay} />

        <div style={styles.rightInner}>

          {/* Header text changes based on mode */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={styles.welcomeTitle}>
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={styles.welcomeSub}>
              {authMode === 'login' 
                ? 'Sign in to access your secure portal' 
                : 'Join Onyx for autonomous transaction protection'}
            </p>
          </div>

          {/* 3D Animated Flip Container */}
          <div className="auth-perspective-box">
            <div className={`auth-flipper ${authMode === 'register' ? 'is-register' : ''}`}>
              
              {/* ================= FRONT: LOGIN CARD ================= */}
              <div className="auth-face auth-face-front">
                <GlassCard style={{ padding: '28px' }}>
                  
                  {/* Dual Tabs for Customer / Officer with Sliding Pill */}
                  <div style={{ marginBottom: 20 }}>
                    <Tabs
                      layoutId="loginTabsPill"
                      activeTab={activeTab}
                      onChange={(tab) => {
                        setActiveTab(tab);
                        setError(null);
                        setMessage(null);
                      }}
                      tabs={[
                        { id: 'customer', label: 'Customer Portal', icon: <User style={{ width: 16, height: 16 }} /> },
                        { id: 'officer', label: 'Bank Officer', icon: <ShieldCheck style={{ width: 16, height: 16 }} /> }
                      ]}
                    />
                  </div>

                  {/* Feedback Alerts */}
                  {message && authMode === 'login' && (
                    <div style={styles.alertSuccess}>
                      <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
                      <span>{message}</span>
                    </div>
                  )}

                  {error && authMode === 'login' && (
                    <div style={styles.alertError}>
                      {error}
                    </div>
                  )}

                  {/* Sliding Form Container */}
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <AnimatePresence mode="wait" initial={false}>
                      {activeTab === 'customer' ? (
                        <motion.form
                          key="login-customer"
                          initial={{ opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 22 }}
                          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                          onSubmit={handleCustomerLogin}
                        >
                          <div className="form-group">
                            <label className="form-label">Username / Account Number</label>
                            <input
                              type="text"
                              className="glass-input"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="e.g. siddharth_kumar"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                              type="password"
                              className="glass-input"
                              value={customerPassword}
                              onChange={(e) => setCustomerPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            variant="primary"
                            loading={customerLoading}
                            icon={<LogIn style={{ width: 16, height: 16 }} />}
                            style={{ width: '100%', marginTop: 8 }}
                          >
                            Sign In
                          </Button>
                        </motion.form>
                      ) : (
                        <motion.form
                          key="login-officer"
                          initial={{ opacity: 0, x: 22 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -22 }}
                          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                          onSubmit={handleOfficerLogin}
                        >
                          <div className="form-group">
                            <label className="form-label">Officer ID</label>
                            <input
                              type="text"
                              className="glass-input glass-input-mono"
                              value={officerId}
                              onChange={(e) => setOfficerId(e.target.value)}
                              placeholder="e.g. OFFICER-901"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Security Password</label>
                            <input
                              type="password"
                              className="glass-input"
                              value={officerPassword}
                              onChange={(e) => setOfficerPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            variant="primary"
                            loading={officerLoading}
                            icon={<Lock style={{ width: 16, height: 16 }} />}
                            style={{ width: '100%', marginTop: 8 }}
                          >
                            Login as Officer
                          </Button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Switch to Create Account */}
                  <div style={styles.switchRow}>
                    <span style={styles.switchText}>Don't have an account?</span>
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      style={styles.switchButton}
                    >
                      Create Account <ArrowRight style={{ width: 14, height: 14 }} />
                    </button>
                  </div>

                </GlassCard>
              </div>

              {/* ================= BACK: CREATE ACCOUNT CARD ================= */}
              <div className="auth-face auth-face-back">
                <GlassCard style={{ padding: '28px' }}>
                  
                  {/* Dual Tabs for Registration with Sliding Pill */}
                  <div style={{ marginBottom: 20 }}>
                    <Tabs
                      layoutId="regTabsPill"
                      activeTab={regRole}
                      onChange={(tab) => {
                        setRegRole(tab);
                        setError(null);
                        setMessage(null);
                      }}
                      tabs={[
                        { id: 'customer', label: 'User Account', icon: <User style={{ width: 16, height: 16 }} /> },
                        { id: 'officer', label: 'Bank Officer', icon: <ShieldCheck style={{ width: 16, height: 16 }} /> }
                      ]}
                    />
                  </div>

                  {/* Feedback Alerts */}
                  {message && authMode === 'register' && (
                    <div style={styles.alertSuccess}>
                      <CheckCircle2 style={{ width: 16, height: 16, flexShrink: 0 }} />
                      <span>{message}</span>
                    </div>
                  )}

                  {error && authMode === 'register' && (
                    <div style={styles.alertError}>
                      {error}
                    </div>
                  )}

                  {/* Sliding Registration Form Container */}
                  <div style={{ overflow: 'hidden', position: 'relative' }}>
                    <AnimatePresence mode="wait" initial={false}>
                      {regRole === 'customer' ? (
                        <motion.form
                          key="reg-customer"
                          initial={{ opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 22 }}
                          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                          onSubmit={handleCustomerRegister}
                        >
                          <div className="form-group">
                            <label className="form-label">Account Holder Name</label>
                            <input
                              type="text"
                              className="glass-input"
                              value={regHolderName}
                              onChange={(e) => setRegHolderName(e.target.value)}
                              placeholder="e.g. Siddharth Kumar"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Account Number</label>
                            <input
                              type="text"
                              className="glass-input glass-input-mono"
                              value={regAccountNumber}
                              onChange={(e) => setRegAccountNumber(e.target.value)}
                              placeholder="e.g. ACC-7829104"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Create Password</label>
                            <input
                              type="password"
                              className="glass-input"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            variant="primary"
                            loading={registerLoading}
                            icon={<UserPlus style={{ width: 16, height: 16 }} />}
                            style={{ width: '100%', marginTop: 8 }}
                          >
                            Create User Account
                          </Button>
                        </motion.form>
                      ) : (
                        <motion.form
                          key="reg-officer"
                          initial={{ opacity: 0, x: 22 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -22 }}
                          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                          onSubmit={handleOfficerRegister}
                        >
                          <div className="form-group">
                            <label className="form-label">Employee ID</label>
                            <input
                              type="text"
                              className="glass-input glass-input-mono"
                              value={regEmployeeId}
                              onChange={(e) => setRegEmployeeId(e.target.value)}
                              placeholder="e.g. OFFICER-901 or EMP-8820"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Create Password</label>
                            <input
                              type="password"
                              className="glass-input"
                              value={regOfficerPassword}
                              onChange={(e) => setRegOfficerPassword(e.target.value)}
                              placeholder="••••••••••••"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            variant="primary"
                            loading={registerLoading}
                            icon={<Lock style={{ width: 16, height: 16 }} />}
                            style={{ width: '100%', marginTop: 8 }}
                          >
                            Register as Officer
                          </Button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Switch back to Login */}
                  <div style={styles.switchRow}>
                    <span style={styles.switchText}>Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      style={styles.switchButton}
                    >
                      <ArrowLeft style={{ width: 14, height: 14 }} /> Sign In
                    </button>
                  </div>

                </GlassCard>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Inline Styles
   ================================================================ */
const styles = {
  wrapper: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
  },

  /* ---------- Left Panel ---------- */
  leftPanel: {
    position: 'relative',
    width: '50%',
    height: '100%',
    background: 'linear-gradient(160deg, #0a0f1c 0%, #0d1a2d 40%, #0f1f35 70%, #081428 100%)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at 30% 50%, rgba(2, 132, 199, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  leftContent: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    padding: '0 48px',
    maxWidth: 480,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  brandName: {
    fontSize: '3.75rem',
    fontWeight: 900,
    letterSpacing: '0.12em',
    color: '#FFFFFF',
    lineHeight: 1.1,
    textShadow: '0 0 40px rgba(0, 163, 255, 0.4), 0 4px 16px rgba(0,0,0,0.6)',
    marginBottom: 14,
  },
  brandDivider: {
    width: 240,
    height: 1.5,
    background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.5) 20%, rgba(56, 189, 248, 0.5) 80%, transparent)',
    margin: '0 auto 16px',
    borderRadius: 2,
  },
  brandTagline: {
    fontSize: '0.9375rem',
    fontWeight: 800,
    lineHeight: 1.5,
    color: '#38BDF8',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    textShadow: '0 0 24px rgba(56, 189, 248, 0.6)',
    maxWidth: 420,
    margin: '0 auto',
  },

  /* ---------- Right Panel (with diagonal left edge & white background) ---------- */
  rightPanel: {
    position: 'relative',
    width: '55%',
    marginLeft: '-5%',
    height: '100%',
    background: '#FFFFFF',
    clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.12)',
  },
  rightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at 70% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 65%)',
    pointerEvents: 'none',
    zIndex: 2,
  },
  rightInner: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: 460,
    padding: '32px 40px 32px 60px',
  },

  /* ---------- Header inside right panel ---------- */
  welcomeTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  welcomeSub: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginTop: 4,
  },

  /* ---------- Card Bottom Switcher ---------- */
  switchRow: {
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid rgba(226, 232, 240, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: '0.8125rem',
  },
  switchText: {
    color: 'var(--text-muted)',
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#0284C7',
    fontWeight: 700,
    fontSize: '0.8125rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 6px',
    borderRadius: 6,
    transition: 'all 0.2s ease',
  },

  /* ---------- Feedback alerts ---------- */
  alertSuccess: {
    padding: '10px 14px',
    borderRadius: 10,
    background: 'var(--risk-low-bg)',
    border: '1px solid var(--risk-low-border)',
    color: 'var(--risk-low)',
    fontSize: '0.8125rem',
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  alertError: {
    padding: '10px 14px',
    borderRadius: 10,
    background: 'var(--risk-high-bg)',
    border: '1px solid var(--risk-high-border)',
    color: 'var(--risk-high)',
    fontSize: '0.8125rem',
    marginBottom: 18,
  },
};
