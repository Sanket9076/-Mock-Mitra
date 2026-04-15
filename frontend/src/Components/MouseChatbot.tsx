import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCpuChip } from 'react-icons/hi2';

export const MouseChatbot = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (['button', 'a'].includes(target.tagName.toLowerCase()) || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: isHovering ? 1.2 : 1,
            x: mousePosition.x + 15,
            y: mousePosition.y + 15,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 250,
            mass: 0.5
          }}
          className="fixed top-0 left-0 z-[9999] pointer-events-none select-none"
        >
          <div className="relative">
            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 bg-purple-500/30 blur-xl rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 ${isHovering ? 'bg-purple-600 border-purple-400/50 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/10'}`}>
              <HiCpuChip className={`text-xl transition-colors duration-300 ${isHovering ? 'text-white' : 'text-purple-400'}`} />
              
              {/* Pulsing indicator */}
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-[#0a0a0a] animate-pulse"></div>
            </div>

            {/* Subtle shadow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-black/40 blur-sm rounded-full"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
