import React from 'react';
import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: 'rgba(2, 6, 23, 0.92)', backdropFilter: 'blur(12px)' }}
    >
      {/* Animated concentric rings */}
      <div className="relative w-48 h-48 mb-10">
        {/* Outermost glow */}
        <div className="absolute inset-0 bg-[#7C3AED]/20 blur-3xl rounded-full animate-pulse" />

        {/* Ring 1 */}
        <div className="absolute inset-0 border border-[#7C3AED]/30 rounded-full"
          style={{ animation: 'spin 6s linear infinite' }} />
        {/* Ring 2 */}
        <div className="absolute inset-4 border border-[#A855F7]/40 rounded-full"
          style={{ animation: 'spin 4s linear infinite reverse' }} />
        {/* Ring 3 */}
        <div className="absolute inset-8 border border-[#1E3A8A]/60 rounded-full"
          style={{ animation: 'spin 3s linear infinite' }} />

        {/* Center pulsing core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-[#7C3AED]/50 animate-pulse">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-[#A855F7]/30 blur-xl" />
          </div>
        </div>

        {/* Orbiting particles */}
        {[0, 90, 180, 270].map((deg, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{ animation: `spin ${6 + i}s linear infinite`, transformOrigin: 'center' }}
          >
            <div
              className="absolute w-2 h-2 bg-[#A855F7] rounded-full"
              style={{ top: '-4px', left: 'calc(50% - 4px)', boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)' }}
            />
          </div>
        ))}
      </div>

      {/* Text content */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p
          className="text-[#F8FAFC] text-lg font-semibold tracking-wide"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Analyzing with advanced intelligence...
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>

        <p className="text-[#94A3B8] text-xs tracking-widest uppercase font-medium">
          AI Processing • Please wait
        </p>
      </motion.div>

      {/* Scanning line animation */}
      <div className="absolute inset-x-0 top-0 overflow-hidden h-full pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/40 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;