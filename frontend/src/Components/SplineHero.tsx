import React from 'react';
import { motion } from 'framer-motion';

export const SplineHero = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] relative z-10 flex flex-col items-center justify-center">
      
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#7C3AED]/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute w-[200px] h-[200px] bg-[#A855F7]/30 blur-[80px] rounded-full" />
      </div>

      {/* Floating Holographic Robot */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Holographic Scanline Overlay */}
        <div className="absolute inset-x-0 bottom-[-50px] h-[100px] bg-gradient-to-t from-transparent via-[#7C3AED]/10 to-transparent blur-xl pointer-events-none" />

        {/* --- ROBOT HEAD --- */}
        <motion.div 
          className="relative w-48 h-40 md:w-56 md:h-48 rounded-[3rem] border border-[#7C3AED]/40 bg-[#0F172A]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(124,58,237,0.3)] flex flex-col items-center justify-center overflow-hidden"
          style={{
            boxShadow: "inset 0 0 30px rgba(168,85,247,0.2), 0 0 60px rgba(124,58,237,0.4)"
          }}
        >
          {/* Internal Grid Lines for Tech Vibe */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{ backgroundImage: 'linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(90deg, #7C3AED 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Eyes Container */}
          <div className="relative flex gap-8 z-10">
            {/* Left Eye */}
            <motion.div 
              className="w-12 h-6 md:w-16 md:h-8 rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] shadow-[0_0_20px_rgba(168,85,247,0.8)]"
              animate={{ 
                scaleY: [1, 0.1, 1], // Blink animation
                opacity: [0.8, 1, 0.8] 
              }}
              transition={{
                scaleY: { duration: 0.2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" },
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            {/* Right Eye */}
            <motion.div 
              className="w-12 h-6 md:w-16 md:h-8 rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] shadow-[0_0_20px_rgba(168,85,247,0.8)]"
              animate={{ 
                scaleY: [1, 0.1, 1],
                opacity: [0.8, 1, 0.8] 
              }}
              transition={{
                scaleY: { duration: 0.2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" },
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }
              }}
            />
          </div>
        </motion.div>

        {/* --- ROBOT NECK --- */}
        <div className="w-12 h-10 bg-gradient-to-b from-[#111827] to-[#1E3A8A] border-x border-[#7C3AED]/30 relative overflow-hidden">
          {/* Energy Core in Neck */}
          <motion.div 
            className="absolute inset-0 bg-[#A855F7]/40 blur-sm"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="w-full h-full flex flex-col justify-evenly">
            <div className="w-full h-[2px] bg-[#7C3AED]/50" />
            <div className="w-full h-[2px] bg-[#7C3AED]/50" />
            <div className="w-full h-[2px] bg-[#7C3AED]/50" />
          </div>
        </div>

        {/* --- ROBOT TORSO --- */}
        <motion.div 
          className="w-64 h-48 md:w-80 md:h-56 bg-[#020617]/90 border border-[#7C3AED]/50 rounded-[4rem] backdrop-blur-xl flex items-center justify-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          style={{
            boxShadow: "inset 0 10px 40px rgba(30,58,138,0.5), 0 0 80px rgba(168,85,247,0.2)"
          }}
        >
          {/* High-Tech Collar */}
          <div className="absolute top-0 w-48 h-8 rounded-b-3xl bg-[#1E3A8A]/30 border-b border-[#7C3AED]/40" />
          
          {/* Floating Energy Core */}
          <motion.div 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#7C3AED]/50 flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#A855F7]/60 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-4 rounded-full border-2 border-[#3B82F6]/40 animate-[spin_5s_linear_infinite]" />
            
            {/* Core Center Pulse */}
            <motion.div 
              className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#3B82F6] shadow-[0_0_40px_rgba(168,85,247,0.9)]"
              animate={{ 
                scale: [1, 1.2, 1],
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hologram Base Projector */}
      <motion.div 
        className="mt-12 relative w-64 md:w-96 flex justify-center h-16"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute bottom-0 w-32 h-4 bg-[#7C3AED] blur-lg rounded-full" />
        <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#A855F7] to-transparent" />
        <div className="w-full h-full bg-gradient-to-t from-[#7C3AED]/30 to-transparent rounded-t-full opacity-40 blur-md pointer-events-none" />
      </motion.div>

    </div>
  );
};
