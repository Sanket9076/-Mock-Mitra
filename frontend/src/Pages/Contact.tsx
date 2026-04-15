import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { HiEnvelope, HiChatBubbleLeftRight, HiGlobeAlt, HiPaperAirplane, HiCommandLine } from "react-icons/hi2";

export const Contact = () => {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setStatus("Message sent successfully. We will contact you soon.");
        setIsSubmitting(false);
        setTimeout(() => setStatus(""), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white pt-32 pb-20 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }}>
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* INFO SECTION */}
        <div className="space-y-12">
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Support // Available</span>
            </motion.div>
            
            <motion.h1 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="text-5xl md:text-7xl font-black tracking-tight leading-tight"
            >
               GET IN <br/>
               <span className="text-[#A855F7]">TOUCH</span>
            </motion.h1>
            
            <motion.p 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="text-lg text-gray-500 font-medium leading-relaxed max-w-md"
            >
               Connect with our team to discuss Enterprise solutions, platform support, or feedback.
            </motion.p>
          </div>

          <div className="space-y-6">
            {[
                { icon: <HiEnvelope/>, label: "Email Support", val: "support@mockmitra.ai", color: "#A855F7" },
                { icon: <HiChatBubbleLeftRight/>, label: "Live Assistance", val: "Available 24/7", color: "#10b981" },
                { icon: <HiGlobeAlt/>, label: "Headquarters", val: "San Francisco, CA", color: "#6366f1" },
            ].map((info, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-5 group"
                >
                    <div className="w-14 h-14 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center text-xl transition-all group-hover:scale-105" style={{ color: info.color }}>
                        {info.icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{info.label}</p>
                        <p className="text-lg font-bold text-white tracking-tight">{info.val}</p>
                    </div>
                </motion.div>
            ))}
          </div>
        </div>

        {/* FORM SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:border-[#A855F7] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:border-[#A855F7] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-2">Message</label>
              <textarea 
                required 
                rows={5} 
                placeholder="How can we help you?" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:border-[#A855F7] outline-none transition-all resize-none"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-[#7C3AED] hover:bg-[#A855F7] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-[#7C3AED]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <HiPaperAirplane className="text-lg" />
            </button>

            <AnimatePresence>
                {status && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-500 text-center text-[10px] font-bold uppercase tracking-widest"
                    >
                        {status}
                    </motion.div>
                )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact;
