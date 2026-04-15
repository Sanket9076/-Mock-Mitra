import React, { Suspense, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  HiRocketLaunch, HiCpuChip, HiChartBar,
  HiSparkles, HiShieldCheck, HiArrowRight,
  HiPlay, HiBolt, HiGlobeAlt, HiCommandLine
} from "react-icons/hi2";
import { AnimatedFooter } from "../Components/AnimatedFooter";
import { SplineHero } from "../Components/SplineHero";

// Animated particle background
const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-[#A855F7]/40"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `floating ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 3}s infinite`,
          opacity: 0.3 + Math.random() * 0.5,
        }}
      />
    ))}
  </div>
);

// Scroll-reveal wrapper
const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const features = [
  {
    icon: <HiCpuChip className="text-2xl" />,
    title: "Precision AI Engine",
    desc: "Advanced semantic evaluation using Google Gemini for deeply personalised, accurate feedback on your coding interviews.",
    color: "#7C3AED",
  },
  {
    icon: <HiSparkles className="text-2xl" />,
    title: "Real-time Feedback",
    desc: "Instant multi-dimensional scoring across technical depth, communication, and confidence — delivered as you speak.",
    color: "#A855F7",
  },
  {
    icon: <HiShieldCheck className="text-2xl" />,
    title: "Full Privacy",
    desc: "Your sessions are end-to-end encrypted and only accessible by you. No data is shared or stored beyond your session.",
    color: "#1E3A8A",
  },
  {
    icon: <HiChartBar className="text-2xl" />,
    title: "Deep Analytics",
    desc: "Executive-grade performance reports, weakness breakdowns, and actionable improvement roadmaps for every session.",
    color: "#7C3AED",
  },
  {
    icon: <HiBolt className="text-2xl" />,
    title: "Adaptive Difficulty",
    desc: "Questions scale dynamically with your performance — ensuring you're always challenged at precisely the right level.",
    color: "#A855F7",
  },
  {
    icon: <HiGlobeAlt className="text-2xl" />,
    title: "Multi-Stack Support",
    desc: "From MERN and Java to Data Science — practice the exact technical stack your dream company interviews for.",
    color: "#1E3A8A",
  },
];

export const Home = () => {
  return (
    <div className="min-h-screen text-[#F8FAFC] overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }}>

      {/* ─── HERO SECTION ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-[#7C3AED]/10 blur-[150px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1E3A8A]/15 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A855F7]/5 blur-[200px] rounded-full -z-10" />
        <ParticleField />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full pt-24 lg:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen py-20">

            {/* LEFT: Text Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >

                <h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Your AI Universe{" "}
                  <span className="bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#1E3A8A] bg-clip-text text-transparent block mt-2">
                    Starts Here
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-[#94A3B8] leading-relaxed max-w-xl"
              >
                Analyze, automate, and create with intelligent systems built for the future. Prepare for elite technical interviews with our AI-powered simulation engine.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                {/* Primary CTA */}
                <Link to="/signup" id="hero-get-started-btn">
                  <button className="group relative px-8 py-4 rounded-full font-bold text-base text-white overflow-hidden transition-all duration-300 hover:scale-105">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7]" />
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2">
                      <HiRocketLaunch />
                      Get Started
                    </span>
                  </button>
                </Link>

                {/* Secondary CTA */}
                <Link to="/interviews" id="hero-demo-btn">
                  <button className="group px-8 py-4 rounded-full font-bold text-base text-[#94A3B8] border border-[#7C3AED]/30 backdrop-blur-sm hover:border-[#A855F7]/60 hover:text-[#F8FAFC] hover:bg-[#7C3AED]/10 transition-all duration-300 flex items-center gap-2">
                    <HiPlay className="text-[#A855F7] group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </button>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center gap-8 pt-4 border-t border-[#7C3AED]/10"
              >
                {[
                  { value: "98%", label: "Accuracy" },
                  { value: "4 Tracks", label: "Tech Stacks" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-black text-[#A855F7]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</div>
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-widest font-semibold">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: Spline 3D Robot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="order-1 lg:order-2 relative h-[400px] md:h-[500px] lg:h-[600px]"
            >
              {/* Glow halo behind the 3D scene */}
              <div className="absolute inset-0 bg-[#7C3AED]/10 blur-[80px] rounded-full" />
              {/* Floating ring decoration */}
              <div className="absolute inset-0 border border-[#7C3AED]/10 rounded-full floating-slow pointer-events-none" />
              <div className="absolute inset-8 border border-[#A855F7]/5 rounded-full floating pointer-events-none" />

              <SplineHero />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-[#0F172A]/50 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-[#7C3AED]/40" />

        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                <HiCommandLine className="text-[#A855F7]" />
                <span className="text-xs font-bold tracking-widest text-[#A855F7] uppercase">Platform Capabilities</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">succeed.</span>
              </h2>
              <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
                Intelligent tools designed to elevate your interview performance with AI-driven precision.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div
                  className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/5 transition-all duration-500 cursor-default hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#7C3AED]/10 relative overflow-hidden"
                >
                  {/* Glow corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${item.color}30 0%, transparent 70%)` }} />

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300"
                    style={{ background: `${item.color}20`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#F8FAFC]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.title}</h3>
                  <p className="text-[#94A3B8] leading-relaxed text-sm">{item.desc}</p>

                  <div className="mt-6 flex items-center gap-2 text-[#A855F7] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <RevealOnScroll>
          <div className="max-w-5xl mx-auto relative">
            {/* Border glow */}
            <div className="absolute -inset-px rounded-[2.5rem] bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#1E3A8A] opacity-50 blur-sm" />
            <div className="relative rounded-[2.5rem] p-12 md:p-20 text-center space-y-8 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a0a3a 50%, #0F172A 100%)' }}
            >
              {/* Internal glow orbs */}
              <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#7C3AED]/20 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#A855F7]/15 blur-[60px] rounded-full" />

              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#F8FAFC]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Start your journey today.
                </h2>
                <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
                  Join developers who have transformed their interview outcomes through autonomous AI simulation.
                </p>
                <Link to="/signup" id="cta-signup-btn">
                  <button className="group relative px-10 py-4 rounded-full font-bold text-base text-white overflow-hidden hover:scale-105 transition-transform inline-flex items-center gap-2">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7]" />
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] blur-xl opacity-0 group-hover:opacity-80 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2">
                      <HiRocketLaunch />
                      Sign Up for Free
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ─── ANIMATED FOOTER ─────────────────────────────────── */}
      <AnimatedFooter />
    </div>
  );
};

export default Home;
