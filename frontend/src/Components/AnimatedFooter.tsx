import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from "../assets/pngwing3.png";

// Social icon components (inline SVG for glow effect support)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const AnimatedFooter = () => {
  return (
    <footer className="relative overflow-hidden mt-0">
      {/* UnicornStudio animated wave background */}
      <div className="relative w-full overflow-hidden" style={{ height: '300px' }}>
        {/* Gradient mesh background as fallback/overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#0F172A]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated energy waves */}
          <div className="absolute bottom-0 left-0 right-0 h-full">
            <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full opacity-40">
              <defs>
                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.6"/>
                </linearGradient>
                <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.5"/>
                  <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0.5"/>
                </linearGradient>
              </defs>
              <path d="M0,150 C360,50 720,250 1080,130 C1260,70 1380,180 1440,150 L1440,300 L0,300 Z" fill="url(#waveGrad1)">
                <animateTransform attributeName="transform" type="translate" from="-1440 0" to="0 0" dur="8s" repeatCount="indefinite" />
              </path>
              <path d="M0,180 C400,80 800,260 1200,160 C1320,120 1400,200 1440,180 L1440,300 L0,300 Z" fill="url(#waveGrad2)" opacity="0.7">
                <animateTransform attributeName="transform" type="translate" from="0 0" to="-1440 0" dur="12s" repeatCount="indefinite" />
              </path>
              <path d="M0,200 C300,100 600,280 900,180 C1100,120 1300,220 1440,200 L1440,300 L0,300 Z" fill="#7C3AED" opacity="0.3">
                <animateTransform attributeName="transform" type="translate" from="1440 0" to="0 0" dur="10s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
          {/* Glowing orbs */}
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-[#7C3AED]/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[150px] bg-[#A855F7]/15 blur-[60px] rounded-full" />
        </div>

      {/* Footer content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-6">
          {/* Brand */}
          <Link to="/" className="flex flex-col items-center group">
            <motion.div 
               animate={{ y: [0, -3, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-10 h-10 mb-2 relative"
            >
              <div className="absolute inset-0 bg-[#7C3AED]/20 blur-md rounded-full group-hover:bg-[#A855F7]/40 transition-all" />
              <img 
                src={Logo} 
                alt="Mock Mitra" 
                className="w-full h-full object-contain brightness-110 relative z-10" 
                style={{ filter: 'drop-shadow(0 0 5px rgba(124, 58, 237, 0.5))' }}
              />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent group-hover:from-[#F8FAFC] group-hover:to-[#A855F7] transition-all duration-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Mock Mitra
            </span>
            <p className="text-[#94A3B8] text-xs mt-1 tracking-wide group-hover:text-[#F8FAFC] transition-colors">AI-Powered Technical Intelligence</p>
          </Link>

          {/* Navigation Links Removed */}

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {[
              { icon: <GithubIcon />, href: '#', label: 'GitHub' },
              { icon: <LinkedinIcon />, href: '#', label: 'LinkedIn' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full border border-[#7C3AED]/30 flex items-center justify-center text-[#94A3B8] hover:text-[#A855F7] hover:border-[#A855F7]/60 hover:bg-[#7C3AED]/10 transition-all duration-300 neon-glow-hover"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[#94A3B8]/50 text-xs tracking-widest uppercase">
            © 2026 Mock Mitra AI Inc. Built for the future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AnimatedFooter;
