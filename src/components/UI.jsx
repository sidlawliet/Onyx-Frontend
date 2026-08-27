import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Check, 
  LogOut, 
  User, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

/**
 * Shared Glassmorphism UI Component Suite
 */

// 1. Framer-Motion Animated Glass Card
export function GlassCard({ children, className = '', hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// 2. 3D Holographic Animated Circular Risk Gauge (0 - 100%)
export function RiskGauge({ score = 0, size = 170, strokeWidth = 14 }) {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    let animId;
    let startTimestamp = null;
    const duration = 1500; // 1.5s lockstep animation

    const tick = (now) => {
      if (!startTimestamp) startTimestamp = now;
      const progress = Math.min((now - startTimestamp) / duration, 1);
      // Smooth cubic-bezier ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrentVal(ease * score);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };

    const timer = setTimeout(() => {
      animId = requestAnimationFrame(tick);
    }, 120);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, [score]);

  const radius = (size - strokeWidth) / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentVal / 100) * circumference;
  const displayScore = Math.round(currentVal);

  // Determine colors & 3D gradient stops
  const isHigh = score > 70;
  const isMed = score > 35 && score <= 70;

  const gradientId = `gaugeGrad_${isHigh ? 'high' : isMed ? 'med' : 'low'}`;
  const glowColor = isHigh 
    ? 'rgba(239, 68, 68, 0.45)' 
    : isMed 
      ? 'rgba(245, 158, 11, 0.45)' 
      : 'rgba(16, 185, 129, 0.45)';

  const primaryColor = isHigh ? '#DC2626' : isMed ? '#D97706' : '#059669';
  const riskLabel = isHigh ? 'HIGH RISK' : isMed ? 'MEDIUM RISK' : 'LOW RISK';
  const badgeClass = isHigh ? 'badge-high' : isMed ? 'badge-med' : 'badge-low';

  // Calculate tip sphere position synchronized with current value
  const angleRad = (currentVal / 100) * 2 * Math.PI - Math.PI / 2;
  const tipX = size / 2 + radius * Math.cos(angleRad);
  const tipY = size / 2 + radius * Math.sin(angleRad);

  return (
    <div style={{
      width: size,
      height: size,
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: 800,
    }}>
      {/* 3D Outer Bezel Ring with metallic sheen */}
      <div style={{
        position: 'absolute',
        width: size - 4,
        height: size - 4,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(226,232,240,0.6) 50%, rgba(203,213,225,0.8) 100%)',
        boxShadow: `0 14px 28px rgba(15, 23, 42, 0.08), inset 0 2px 4px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06), 0 0 20px ${glowColor}`,
        border: '1px solid rgba(255,255,255,0.8)',
      }} />

      {/* SVG 3D Tube Track & Fill */}
      <svg
        width={size}
        height={size}
        style={{
          position: 'relative',
          zIndex: 2,
          transform: 'rotate(-90deg)',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))'
        }}
      >
        <defs>
          {/* Low Risk 3D Emerald Gradient */}
          <linearGradient id="gaugeGrad_low" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Med Risk 3D Amber Gradient */}
          <linearGradient id="gaugeGrad_med" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* High Risk 3D Crimson Gradient */}
          <linearGradient id="gaugeGrad_high" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* 3D Inset Track Channel */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(226, 232, 240, 0.75)"
          fill="none"
          strokeLinecap="round"
        />

        {/* Inner track bevel shadow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth - 4}
          stroke="rgba(203, 213, 225, 0.45)"
          fill="none"
        />

        {/* 3D Animated Fill Progress - 100% Lockstep Sync with Counter */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* 3D Glowing Lead Sphere at Arc Tip */}
      {currentVal > 1 && (
        <div
          style={{
            position: 'absolute',
            left: tipX - strokeWidth / 2,
            top: tipY - strokeWidth / 2,
            width: strokeWidth,
            height: strokeWidth,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, rgba(255,255,255,0.9) 30%, transparent 80%)',
            backgroundColor: primaryColor,
            boxShadow: `0 0 10px ${primaryColor}, 0 2px 4px rgba(0,0,0,0.3)`,
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 3D Convex Glass Dome & Live Value Ticker */}
      <div style={{
        position: 'absolute',
        width: size * 0.64,
        height: size * 0.64,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 70%, #EDF2F7 100%)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        border: '1px solid rgba(255,255,255,0.9)',
      }}>
        {/* Specular curved reflection across dome */}
        <div style={{
          position: 'absolute',
          top: 3,
          left: '15%',
          width: '70%',
          height: '35%',
          borderRadius: '50% 50% 40% 40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
        }} />

        <span style={{
          fontSize: size * 0.23,
          fontWeight: 900,
          fontFamily: 'var(--font-main)',
          lineHeight: 1,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          textShadow: '0 1px 2px rgba(0,0,0,0.08)'
        }}>
          {displayScore}%
        </span>
        <span
          className={`badge ${badgeClass}`}
          style={{
            marginTop: 5,
            fontSize: size * 0.065,
            fontWeight: 800,
            padding: '3px 8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            letterSpacing: '0.04em'
          }}
        >
          {riskLabel}
        </span>
      </div>
    </div>
  );
}

// 3. Buttons & Micro-animated Freeze Button
export function Button({ 
  children, 
  variant = 'primary', 
  loading = false, 
  icon = null, 
  className = '', 
  ...props 
}) {
  let variantClass = 'btn-primary';
  if (variant === 'secondary') variantClass = 'btn-secondary';
  if (variant === 'freeze') variantClass = 'btn-freeze';

  return (
    <button className={`btn ${variantClass} ${className}`} disabled={loading} {...props}>
      {loading ? (
        <RefreshCw className="animate-spin" style={{ width: 18, height: 18 }} />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

// Freeze Button with Settle Micro-Animation
export function FreezeButton({ isFrozen = false, onFreeze, loading = false }) {
  const [locked, setLocked] = useState(isFrozen);

  useEffect(() => {
    setLocked(isFrozen);
  }, [isFrozen]);

  const handleClick = async () => {
    if (locked || loading) return;
    if (onFreeze) {
      await onFreeze();
      setLocked(true);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: locked ? 1 : 0.96 }}
      onClick={handleClick}
      className={`btn ${locked ? 'btn-frozen-active' : 'btn-freeze'}`}
      disabled={locked || loading}
      style={{ minWidth: 160 }}
    >
      <motion.div
        animate={locked ? { scale: [1, 1.25, 1], rotate: [0, -10, 0] } : {}}
        transition={{ duration: 0.35 }}
      >
        {locked ? <Lock style={{ width: 16, height: 16, color: '#475569' }} /> : <ShieldAlert style={{ width: 16, height: 16 }} />}
      </motion.div>
      <span>{locked ? 'Account Frozen' : loading ? 'Freezing...' : 'Freeze Account'}</span>
    </motion.button>
  );
}

// 4. Tab Switcher with Sliding Spring Pill
export function Tabs({ tabs = [], activeTab, onChange, layoutId = 'activeTabPill' }) {
  return (
    <div className="glass-tabs" style={{ position: 'relative' }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`glass-tab-btn ${isActive ? 'active' : ''}`}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#FFFFFF',
                  borderRadius: 'calc(var(--radius-md) - 3px)',
                  boxShadow: '0 3px 12px rgba(15, 23, 42, 0.1)',
                  zIndex: -1
                }}
              />
            )}
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// 5. Official Onyx Logo Icon
export function OnyxLogoIcon({ size = 28, glow = false }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Glow Filter */}
        <filter id="onyxCyanGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Left dark facet gradient */}
        <linearGradient id="onyxLeftFacet" x1="12" y1="27" x2="50" y2="73" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        {/* Top-right vibrant blue */}
        <linearGradient id="onyxTopRight" x1="50" y1="5" x2="88" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#00A3FF" />
        </linearGradient>
        {/* Bottom-right cobalt */}
        <linearGradient id="onyxBottomRight" x1="50" y1="55" x2="88" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        {/* Center radiant diamond */}
        <linearGradient id="onyxDiamond" x1="36" y1="36" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Hexagon Outer Frame */}
      <path
        d="M50 5L88 27V73L50 95L12 73V27L50 5Z"
        fill="#0F172A"
        stroke="rgba(56, 189, 248, 0.3)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Left Facet: Dark Navy */}
      <path
        d="M50 5L12 27V73L50 95L50 50Z"
        fill="url(#onyxLeftFacet)"
      />

      {/* Top Right Facet: Bright Azure */}
      <path
        d="M50 5L88 27L65 58L50 50Z"
        fill="url(#onyxTopRight)"
      />

      {/* Bottom Right Facet: Cobalt */}
      <path
        d="M88 27V73L50 95L65 58Z"
        fill="url(#onyxBottomRight)"
      />

      {/* Inner facet dividing line accents */}
      <path d="M50 5L50 50L12 73" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <path d="M50 50L88 27" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M50 50L65 58L50 95" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* Center Radiant Diamond */}
      <path
        d="M50 36L64 50L50 64L36 50Z"
        fill="url(#onyxDiamond)"
        filter={glow ? "url(#onyxCyanGlow)" : undefined}
      />
      {/* Inner diamond bright core */}
      <path
        d="M50 42L58 50L50 58L42 50Z"
        fill="#E0F2FE"
        opacity="0.75"
      />
    </svg>
  );
}

// 6. Global Glass Navbar
export function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (!user) {
      navigate('/');
    } else if (user.role === 'officer') {
      navigate('/complaints');
    } else {
      navigate('/check');
    }
  };

  return (
    <header className="glass-header">
      <div className="nav-container">
        <div className="logo-brand" onClick={handleLogoClick}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <OnyxLogoIcon size={32} glow={true} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
              ONYX
            </span>
          </div>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: user.role === 'officer' ? 'uppercase' : 'capitalize' }}>
              {user.role === 'officer' 
                ? (user.officerId || 'OFFICER-901') 
                : (user.accountHolderName || user.username?.replace(/_/g, ' ') || 'User')}
            </div>

            <button
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
              title="Logout"
            >
              <LogOut style={{ width: 14, height: 14 }} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

