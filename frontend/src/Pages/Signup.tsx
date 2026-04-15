import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../api/config';
import { HiUser, HiEnvelope, HiLockClosed, HiUserPlus, HiSparkles } from "react-icons/hi2";

// Reusing the same animated background
const FuturisticBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }} />
    <div
      className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20"
      style={{ background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)', animation: 'pulse 6s ease-in-out infinite' }}
    />
    <div
      className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-15"
      style={{ background: 'radial-gradient(circle, #7C3AED 0%, #1E3A8A 50%, transparent 70%)', animation: 'pulse 8s ease-in-out 2s infinite' }}
    />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
    <svg className="absolute top-0 left-0 w-full opacity-15" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ height: '200px' }}>
      <defs>
        <linearGradient id="signupWave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path d="M0,100 C360,20 720,180 1080,80 C1260,30 1380,140 1440,100 L1440,0 L0,0 Z" fill="url(#signupWave)">
        <animate attributeName="d" dur="7s" repeatCount="indefinite"
          values="M0,100 C360,20 720,180 1080,80 C1260,30 1380,140 1440,100 L1440,0 L0,0 Z;M0,80 C360,60 720,120 1080,60 C1260,30 1380,100 1440,80 L1440,0 L0,0 Z;M0,100 C360,20 720,180 1080,80 C1260,30 1380,140 1440,100 L1440,0 L0,0 Z"
        />
      </path>
    </svg>
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-[#7C3AED]"
        style={{
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.2 + Math.random() * 0.4,
          animation: `floating ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`,
        }}
      />
    ))}
  </div>
);

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${API_ENDPOINTS.users}/register`, { username, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(124, 58, 237, 0.2)',
  };
  const focusStyle = { border: '1px solid rgba(168, 85, 247, 0.6)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)' };
  const blurStyle = { border: '1px solid rgba(124, 58, 237, 0.2)', boxShadow: 'none' };

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-6 relative overflow-hidden">
      <FuturisticBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
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
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#7C3AED]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              <HiSparkles className="text-[#A855F7] text-sm" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A855F7]">Account Creation</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Join{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                Mock Mitra
              </span>
            </h1>
            <p className="text-sm text-[#94A3B8] font-medium tracking-wide">Start your professional evaluation journey</p>
          </div>

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

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Full Name / Alias</label>
              <div className="relative group">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]/50 group-focus-within:text-[#A855F7] transition-colors z-10" />
                <input
                  type="text" required placeholder="John Doe" value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-medium text-[#F8FAFC] rounded-2xl outline-none transition-all duration-300 placeholder:text-[#94A3B8]/30"
                  style={inputStyle}
                  onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={e => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Email Address</label>
              <div className="relative group">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]/50 group-focus-within:text-[#A855F7] transition-colors z-10" />
                <input
                  type="email" required placeholder="name@company.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-medium text-[#F8FAFC] rounded-2xl outline-none transition-all duration-300 placeholder:text-[#94A3B8]/30"
                  style={inputStyle}
                  onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={e => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Secure Password</label>
              <div className="relative group">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8]/50 group-focus-within:text-[#A855F7] transition-colors z-10" />
                <input
                  type="password" required placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-medium text-[#F8FAFC] rounded-2xl outline-none transition-all duration-300 placeholder:text-[#94A3B8]/30"
                  style={inputStyle}
                  onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={e => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-bold text-white uppercase tracking-widest text-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Provisioning..." : "Create Account"}
                <HiUserPlus className="text-xl" />
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-[#94A3B8]/60 uppercase tracking-widest">
              Already have an account?{" "}
              <Link to="/login" className="text-[#A855F7] hover:text-[#F8FAFC] transition-colors ml-2 font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
