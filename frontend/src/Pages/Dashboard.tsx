import React, { useState, useEffect, Suspense, lazy } from 'react';
import { getInterviewHistory } from '../api/interview';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiArrowPath, HiChevronRight, HiXCircle, HiClock,
  HiCalendar, HiLightBulb, HiSparkles, HiChartBar,
  HiCheckBadge, HiChartPie, HiRocketLaunch,
  HiCommandLine
} from 'react-icons/hi2';

const Spline = lazy(() => import('@splinetool/react-spline'));
// 🌌 Galaxy/Cube scene — works beautifully as a translucent dashboard background
const SPLINE_SCENE = "https://prod.spline.design/FfqCG0x1ZxwWi88g/scene.splinecode";

// ─── Helpers ────────────────────────────────────────────────
const getScoreColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#A855F7';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
};
const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Exceptional';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Developing';
  return 'Critical';
};

// ─── Glassmorphism StatCard ──────────────────────────────────
const StatCard = ({ icon, label, value, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, boxShadow: `0 20px 40px ${color}20` }}
    className="rounded-3xl p-6 text-center space-y-4 transition-all duration-300 cursor-default"
    style={{
      background: 'rgba(2, 6, 23, 0.5)',
      border: `1px solid ${color}30`,
      backdropFilter: 'blur(16px)',
    }}
  >
    <div
      className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-xl"
      style={{ background: `${color}15`, color }}
    >
      {icon}
    </div>
    <div>
      <div className="text-2xl font-black text-[#F8FAFC]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mt-1">{label}</div>
    </div>
  </motion.div>
);

// ─── ScoreBar ────────────────────────────────────────────────
const ScoreBar = ({ question, score, index, topic }: any) => {
  const color = getScoreColor(score);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl p-6 space-y-4 transition-all duration-300 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(124, 58, 237, 0.15)',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={e => (e.currentTarget.style.border = `1px solid ${color}40`)}
      onMouseLeave={e => (e.currentTarget.style.border = '1px solid rgba(124, 58, 237, 0.15)')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-[#94A3B8] flex-shrink-0"
            style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            {index + 1}
          </span>
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#F8FAFC] leading-relaxed">{question}</p>
            {topic && (
              <span className="inline-block text-[9px] font-bold text-[#A855F7] uppercase tracking-widest mt-1">
                #{topic}
              </span>
            )}
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex-shrink-0"
          style={{ background: `${color}15`, color }}>
          {getScoreLabel(score)}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-[#94A3B8]/60 uppercase tracking-widest">Performance</span>
          <span className="text-xs font-black" style={{ color }}>{score}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, delay: index * 0.05 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── MetricsVisualizer ───────────────────────────────────────
const MetricsVisualizer = ({ metrics }: any) => {
  if (!metrics) return null;
  const data = [
    { label: 'Technical', val: metrics.technical || 0, color: '#7C3AED' },
    { label: 'Communication', val: metrics.communication || 0, color: '#A855F7' },
    { label: 'Confidence', val: metrics.confidence || 0, color: '#1E3A8A' },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 h-full py-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center justify-end gap-3 h-full group">
          <div className="relative w-full flex-1 flex flex-col justify-end rounded-xl border border-[#7C3AED]/10 overflow-hidden"
            style={{ background: 'rgba(124, 58, 237, 0.05)' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${item.val}%` }}
              transition={{ duration: 1, delay: i * 0.15 }}
              className="w-full relative"
              style={{ background: `linear-gradient(180deg, ${item.color}80, ${item.color})` }}
            >
              <div className="absolute top-2 w-full text-center text-[9px] font-black text-white/70">{item.val}</div>
            </motion.div>
          </div>
          <span className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-widest text-center leading-tight">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────
export const Dashboard = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);
  const username = localStorage.getItem('mock_mitra_user') || 'User';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const data = await getInterviewHistory(username);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (interview: any) => {
    if (!interview) return null;
    const avg = interview.finalReport?.overall_score ?? interview.overallScore ?? 0;
    const passed = interview.finalReport?.section_analysis?.filter((s: any) => s.score >= 60).length || 0;
    const failed = interview.finalReport?.section_analysis?.filter((s: any) => s.score < 60).length || 0;
    const total = interview.qnaHistory?.length || 0;
    return { avg, passed, failed, total };
  };

  const stats = computeStats(selectedInterview);

  return (
    <div className="min-h-screen text-[#F8FAFC] pt-16 relative overflow-hidden">

      {/* ── Spline 3D Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <Spline scene={SPLINE_SCENE} className="w-full h-full opacity-20" />
        </Suspense>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0" style={{ background: 'rgba(2, 6, 23, 0.75)' }} />
      </div>

      {/* ── Ambient Glow Orbs ── */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-[#7C3AED]/8 blur-[160px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#A855F7]/6 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-8 pb-8 space-y-8 h-[calc(100vh-4rem)] flex flex-col">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 pb-6 border-b shrink-0"
          style={{ borderColor: 'rgba(124, 58, 237, 0.15)' }}>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.25)' }}>
              <HiSparkles className="text-[#A855F7] text-xs" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A855F7]">Personal Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                {username}
              </span>
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <p className="text-[#94A3B8] font-medium tracking-wide">Review your professional evaluation history</p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#A855F7]/50 to-transparent" />
          </div>
        </header>

        {/* Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-[#7C3AED]/20 border-t-[#A855F7] rounded-full animate-spin" />
              <div className="absolute inset-3 border border-[#A855F7]/20 border-t-[#7C3AED] rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Syncing Intelligence Data...</span>
          </div>

        ) : history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#7C3AED]/20 blur-2xl rounded-full" />
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl text-[#A855F7]/50 relative z-10"
                style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                <HiRocketLaunch />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No sessions recorded yet</h3>
            <p className="text-[#94A3B8] max-w-sm font-medium">Complete your first technical evaluation to see performance metrics here.</p>
          </div>

        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

            {/* Session List */}
            <div className="lg:col-span-3 flex flex-col space-y-4 h-full min-h-0">
              <div className="flex items-center justify-between px-2 shrink-0">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                  <HiArrowPath className="text-[#A855F7]" /> Sessions
                </h3>
                <span
                  className="text-[10px] font-black text-[#A855F7] px-2 py-1 rounded-md"
                  style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}
                >
                  {history.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {history.map((item) => {
                  const itemAvg = item.finalReport?.overall_score ?? item.overallScore ?? 0;
                  const isActive = selectedInterview?._id === item._id;
                  const color = getScoreColor(itemAvg);
                  return (
                    <motion.div
                      key={item._id}
                      whileHover={{ x: 4, y: -2 }}
                      onClick={() => setSelectedInterview(item)}
                      className="p-4 rounded-3xl cursor-pointer transition-all duration-300 flex items-center justify-between group"
                      style={{
                        background: isActive ? 'rgba(124, 58, 237, 0.12)' : 'rgba(2, 6, 23, 0.5)',
                        border: isActive ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(124, 58, 237, 0.1)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: isActive ? '0 0 20px rgba(124, 58, 237, 0.15)' : 'none',
                      }}
                    >
                      <div className="space-y-1.5">
                        <span className="text-xs font-black tracking-widest uppercase transition-colors"
                          style={{ color: isActive ? '#A855F7' : '#94A3B8' }}>
                          {item.techStack}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#94A3B8]/50">
                          <HiCalendar />
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black"
                          style={{ border: `1px solid ${color}30`, color, background: `${color}08` }}
                        >
                          {itemAvg}
                        </div>
                        <HiChevronRight className={`transition-all ${isActive ? 'translate-x-1 text-[#A855F7]' : 'text-[#94A3B8]/20'}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Analytics Detail */}
            <div className="lg:col-span-9 h-full min-h-0">
              <AnimatePresence mode="wait">
                {selectedInterview ? (
                  <motion.div
                    key={selectedInterview._id}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="h-full flex flex-col overflow-hidden rounded-[2.5rem]"
                    style={{
                      background: 'rgba(2, 6, 23, 0.6)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 0 60px rgba(124, 58, 237, 0.08)',
                    }}
                  >
                    {/* Card Header */}
                    <div className="p-8 md:p-10 border-b shrink-0"
                      style={{ borderColor: 'rgba(124, 58, 237, 0.15)', background: 'rgba(124, 58, 237, 0.04)' }}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-full text-[10px] font-black text-[#A855F7] uppercase tracking-widest"
                              style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                              {selectedInterview.techStack} Report
                            </div>
                            <div className="text-[10px] font-bold text-[#94A3B8]/60 flex items-center gap-2">
                              <HiClock />
                              {new Date(selectedInterview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <h2 className="text-4xl font-black tracking-tight text-[#F8FAFC]"
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Executive Summary
                          </h2>
                          <div className="flex items-center gap-4 text-xs font-bold text-[#94A3B8]/60">
                            <span className="flex items-center gap-2"><HiCalendar /> {new Date(selectedInterview.date).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-[#7C3AED]/40" />
                            <span>ID: {selectedInterview._id?.slice(-8).toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Score Circle */}
                        <div className="flex items-center gap-6 p-4 pr-6 rounded-[2rem]"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#7C3AED]/10" />
                              <motion.circle
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * (stats?.avg ?? 0)) / 100 }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                cx="48" cy="48" r="40"
                                stroke={getScoreColor(stats?.avg ?? 0)}
                                strokeWidth="6" fill="transparent"
                                strokeDasharray="251.2" strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-black tracking-tighter"
                                style={{ color: getScoreColor(stats?.avg ?? 0), fontFamily: 'Space Grotesk, sans-serif' }}>
                                {stats?.avg ?? 0}
                              </span>
                              <span className="text-[8px] font-bold text-[#94A3B8]/60 uppercase">Score</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xl font-black uppercase text-[#F8FAFC] tracking-widest"
                              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {getScoreLabel(stats?.avg ?? 0)}
                            </div>
                            <div className="text-[10px] font-bold text-[#94A3B8]/60 uppercase tracking-widest">Global Aggregate</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">

                      {/* Top Stats Row */}
                      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-4 grid grid-cols-2 gap-4">
                          <StatCard icon={<HiCheckBadge />} label="Strong Sectors" value={stats?.passed} color="#10b981" />
                          <StatCard icon={<HiXCircle />} label="Weak Sectors" value={stats?.failed} color="#ef4444" />
                        </div>
                        <div className="xl:col-span-8 rounded-[2rem] p-8"
                          style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.12)' }}>
                          <div className="flex items-center justify-between mb-8 shrink-0">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]/60 flex items-center gap-2">
                              <HiChartPie className="text-[#A855F7]" /> Multidimensional Competency
                            </h3>
                          </div>
                          <div className="h-40">
                            <MetricsVisualizer metrics={selectedInterview.finalReport?.metrics} />
                          </div>
                        </div>
                      </div>

                      {/* Focus Areas */}
                      {selectedInterview.qnaHistory?.some((q: any) => q.topic_to_study || q.feedback?.topic_to_study) && (
                        <div className="relative rounded-[2rem] p-10 space-y-6 overflow-hidden"
                          style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
                          <div className="absolute top-0 right-0 p-8 opacity-10">
                            <HiLightBulb className="text-7xl text-[#A855F7]" />
                          </div>
                          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A855F7] flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
                            Critical Focus Areas
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {Array.from(new Set(
                              selectedInterview.qnaHistory
                                .map((q: any) => q.topic_to_study || q.feedback?.topic_to_study)
                                .filter(Boolean)
                            )).map((topic: any, i: number) => (
                              <div key={i}
                                className="px-6 py-3 rounded-2xl text-xs font-bold text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#A855F7]/50 hover:bg-[#7C3AED]/10 transition-all cursor-default"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124, 58, 237, 0.15)' }}>
                                #{topic}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Q&A Breakdown */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]/60 flex items-center gap-2">
                            <HiChartBar className="text-[#A855F7]" /> Session Granularity
                          </h3>
                          <div className="h-px flex-1 mx-6" style={{ background: 'rgba(124, 58, 237, 0.15)' }} />
                          <span className="text-[10px] font-bold text-[#94A3B8]/40">{selectedInterview.qnaHistory?.length} Sequences</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedInterview.qnaHistory?.map((q: any, i: number) => (
                            <ScoreBar
                              key={i}
                              question={q.question}
                              score={q.score ?? selectedInterview.finalReport?.overall_score ?? 0}
                              index={i}
                              topic={q.topic_to_study || q.feedback?.topic_to_study}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Narrative Feedback */}
                      {(selectedInterview.finalReport?.weak_areas?.length > 0 ||
                        selectedInterview.finalReport?.improvement_plan?.length > 0) && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 border-t pt-10"
                          style={{ borderColor: 'rgba(124, 58, 237, 0.15)' }}>
                          {selectedInterview.finalReport?.weak_areas?.length > 0 && (
                            <div className="space-y-5">
                              <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                                style={{ color: 'rgba(239, 68, 68, 0.8)' }}>
                                <HiXCircle /> Targeted Deficiencies
                              </h4>
                              <div className="space-y-3">
                                {selectedInterview.finalReport.weak_areas.map((w: string, i: number) => (
                                  <div key={i} className="p-4 rounded-2xl text-xs font-medium text-[#94A3B8]"
                                    style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                    {w}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedInterview.finalReport?.improvement_plan?.length > 0 && (
                            <div className="space-y-5">
                              <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-[#A855F7]/80">
                                <HiSparkles /> Optimization Protocol
                              </h4>
                              <div className="space-y-3">
                                {selectedInterview.finalReport.improvement_plan.map((p: string, i: number) => (
                                  <div key={i} className="flex gap-4 p-4 rounded-2xl text-xs font-medium text-[#94A3B8] list-none"
                                    style={{ background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                                    <span className="text-[#A855F7] font-black">0{i + 1}</span> {p}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>

                ) : (
                  <div className="h-full rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-8"
                    style={{
                      background: 'rgba(2, 6, 23, 0.4)',
                      border: '1px dashed rgba(124, 58, 237, 0.2)',
                      backdropFilter: 'blur(12px)',
                    }}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#7C3AED]/20 blur-2xl rounded-full" />
                      <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl text-[#A855F7]/40 relative z-10"
                        style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                        <HiCommandLine />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black tracking-tight text-[#F8FAFC]"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Select a session report
                      </h3>
                      <p className="text-[#94A3B8] max-w-sm mx-auto font-medium">
                        Choose a technical evaluation from the timeline to initialize the deep-dive analytics report.
                      </p>
                    </div>
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-[#A855F7]/30"
                    >
                      <HiChevronRight className="-rotate-90 text-4xl" />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.5); }
      `}</style>
    </div>
  );
};

export default Dashboard;
