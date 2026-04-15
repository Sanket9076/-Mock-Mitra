import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../api/config';
import { HiEnvelope, HiLockClosed, HiArrowRightOnRectangle, HiShieldCheck } from "react-icons/hi2";

// Animated background using CSS - matches the UnicornStudio aesthetic
const FuturisticBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Deep gradient base */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }} />

    {/* Animated orbs */}
    <div
      className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20"
      style={{
        background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
        animation: 'pulse 6s ease-in-out infinite',
      }}
    />
    <div
      className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-15"
      style={{
        background: 'radial-gradient(circle, #A855F7 0%, #1E3A8A 50%, transparent 70%)',
        animation: 'pulse 8s ease-in-out 2s infinite',
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-10"
      style={{
        background: 'radial-gradient(circle, #1E3A8A 0%, transparent 60%)',
        animation: 'pulse 10s ease-in-out 1s infinite',
      }}
    />

    {/* Grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />

    {/* Animated wave bars */}
    <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ height: '200px' }}>
      <defs>
        <linearGradient id="loginWave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path d="M0,100 C360,20 720,180 1080,80 C1260,30 1380,140 1440,100 L1440,200 L0,200 Z" fill="url(#loginWave)">
        <animate attributeName="d" dur="6s" repeatCount="indefinite"
          values="M0,100 C360,20 720,180 1080,80 C1260,30 1380,140 1440,100 L1440,200 L0,200 Z;M0,120 C360,60 720,140 1080,100 C1260,70 1380,120 1440,120 L1440,200 L0,200 Z;M0,100 C360,20 720,180 1080,80 C1260,30 1380,140 1440,100 L1440,200 L0,200 Z"
        />
      </path>
    </svg>

    {/* Floating particles */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-[#A855F7]"
        style={{
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.2 + Math.random() * 0.4,
          animation: `floating ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`,
        }}
      />
    ))}
  </div>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_ENDPOINTS.users}/login`, { email, password });
      if (res.data.token) {
        localStorage.setItem('mock_mitra_token', res.data.token);
        localStorage.setItem('mock_mitra_user', res.data.username);
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-6 relative overflow-hidden">
      <FuturisticBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism Card */}
        <div
          className="rounded-3xl p-10 md:p-12 shadow-2xl relative overflow-hidden"
          style={{
            background: 'rgba(2, 6, 23, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.15), inset 0 0 40px rgba(124, 58, 237, 0.05)',
          }}
        >
          {/* Inner glow top-right */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#A855F7]/10 blur-3xl rounded-full pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              <HiShieldCheck className="text-[#A855F7] text-sm" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A855F7]">Secure Access</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Welcome{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                Back
              </span>
            </h1>
            <p className="text-sm text-[#94A3B8] font-medium tracking-wide">Sign in to your professional account</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl text-xs font-bold text-center mb-8"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Email Address</label>
              <div className="relative group">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]/50 group-focus-within:text-[#A855F7] transition-colors z-10" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-medium text-[#F8FAFC] rounded-2xl outline-none transition-all duration-300 placeholder:text-[#94A3B8]/30"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.6)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.15)'; }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(124, 58, 237, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Password</label>
              <div className="relative group">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]/50 group-focus-within:text-[#A855F7] transition-colors z-10" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-medium text-[#F8FAFC] rounded-2xl outline-none transition-all duration-300 placeholder:text-[#94A3B8]/30"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.6)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.15)'; }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(124, 58, 237, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-bold text-white uppercase tracking-widest text-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Authenticating..." : "Sign In"}
                <HiArrowRightOnRectangle className="text-xl" />
              </span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs font-bold text-[#94A3B8]/60 uppercase tracking-widest">
              New to Mock Mitra?{" "}
              <Link to="/signup" className="text-[#A855F7] hover:text-[#F8FAFC] transition-colors ml-2 font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
