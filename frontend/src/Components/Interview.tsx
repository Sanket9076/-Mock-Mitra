import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Loader } from "./Loader";
import { generateQuestion, submitAndAnalyze } from "../api/interview";
import { motion, AnimatePresence } from "framer-motion";
import { HiCpuChip, HiUserGroup, HiRocketLaunch, HiBolt, HiCheckBadge, HiChartBar, HiXMark, HiVideoCamera, HiClock } from "react-icons/hi2";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import Webcam from "react-webcam";

// --- SUB-COMPONENTS ---

// --- SUB-COMPONENTS ---

const TypingText = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);
    return () => clearInterval(typingInterval);
  }, [text, speed]);
  return <span>{displayedText}</span>;
};

const MetricCircle = ({ score, label, color }: { score: number; label: string; color: string }) => {
  const percentage = score || 0; // Score is already 0-100
  const strokeDasharray = 2 * Math.PI * 30;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="30" className="stroke-white/5 fill-none stroke-[6]" />
          <motion.circle
            cx="50%" cy="50%" r="30"
            className={`fill-none stroke-[6] ${color}`}
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </svg>
        <span className="absolute text-lg font-black italic tracking-tighter text-white">{score}</span>
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">{label}</p>
    </div>
  );
};

// Types
type QuestionObj = { section: string; question: string; difficulty: string };
type FeedbackObj = { 
  score: number; 
  detected_level: string;
  analysis: {
    concepts_captured: string[];
    missing_terms: string[];
    technical_errors: string[];
  };
  feedback_direct: string;
  next_step: string;
};
type QnaRecord = { 
  question: string; 
  answer: string; 
  feedback: FeedbackObj | null;
};
type FinalReportObj = { 
  overall_score: number; 
  metrics?: {
    communication: number;
    technical: number;
    confidence: number;
    overall: number;
  };
  section_analysis: {
    section_name: string;
    score: number;
    comments: string;
  }[];
  weak_areas: string[]; 
  improvement_plan: string[]; 
  personalized_tips: string[] 
};

const SoundVisualizer = ({ active }: { active: boolean }) => {
    return (
        <div className="flex items-center gap-1 h-4">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={active ? {
                        height: [4, 16, 8, 14, 4],
                    } : { height: 4 }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.5 + (i * 0.1),
                        ease: "easeInOut"
                    }}
                    className="w-1 bg-accent-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
            ))}
        </div>
    );
};

// --- MAIN COMPONENT ---

export const Interview = () => {
  const navigate = useNavigate();
  const { techStack: routeTechStack } = useParams();
  const [searchParams] = useSearchParams();
  const techStack = routeTechStack || searchParams.get("techStack") || "Full Stack Web Developer";

  // Auth Guard
  useEffect(() => {
    if (!localStorage.getItem('mock_mitra_token')) {
      navigate('/login');
    }
  }, [navigate]);

  // Speech hooks
  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  
  // States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>("Establishing Encrypted Link...");
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [qnaHistory, setQnaHistory] = useState<QnaRecord[]>([]);

  // Meeting Features
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionObj | null>(null);
  const [finalReport, setFinalReport] = useState<FinalReportObj | null>(null);
  const [lastFeedback, setLastFeedback] = useState<FeedbackObj | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Score tracker: array of scores as answered
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [lastScoreBadge, setLastScoreBadge] = useState<number | null>(null);
  const [globalTimeLeft, setGlobalTimeLeft] = useState<number>(1800); // 30 Minutes
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Audio / Voice Logic (REMOVED)

  // Timer Logic
  useEffect(() => {
    if (isLoading || isFinalizing) return;
    const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        setGlobalTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading, isFinalizing]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Auto-submit on time up (STRICT 1-MIN LIMIT)
  useEffect(() => {
    if (timeLeft === 0 && !isFinalizing && !isLoading) {
      // If time is up, force submission even if silent
      submitAnswer(true); 
    }
  }, [timeLeft]);

  // Load Initial Question
  useEffect(() => {
    fetchNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Voice effect on question change (REMOVED)
  useEffect(() => {
    if (currentQuestion && !isLoading) {
      // AI Voice Disabled
    }
  }, [currentQuestion, isLoading]);

  const fetchNextQuestion = async (providedHistory?: QnaRecord[]) => {
  setTimeLeft(60);
  setIsLoading(true);
  resetTranscript();

  let section = "Technical";
  let difficulty = "Easy";
  if (currentIndex >= 10 && currentIndex < 20) {
    section = "Behavioral";
    difficulty = "Intermediate";
  } else if (currentIndex >= 20) {
    section = "Situational";
    difficulty = "Expert/Hard";
  }

  const historyToUse = providedHistory || qnaHistory;
  const historyStr = historyToUse.map((q) => q.question);
  let attempts = 0;
  let nextQ: any = null;
  while (attempts < 3) {
    try {
      const candidate = await generateQuestion(techStack, section, difficulty, historyStr);
      if (!historyStr.includes(candidate.question)) {
        nextQ = candidate;
        break;
      }
    } catch (e) {
      console.error(e);
    }
    attempts++;
  }
  if (!nextQ) {
    // fallback generic question
    nextQ = {
      section,
      difficulty,
      question: `Tell me about your experience with ${techStack}.`
    };
  }
  setCurrentQuestion(nextQ);
  setIsLoading(false);
};



  const submitAnswer = async (isForcedMove: boolean = false) => {
    if (!currentQuestion) return;
    
    // Auto-skip logic for silent/timeout responses
    if (!transcript || transcript.trim() === "") {
        if (isForcedMove) {
            const newRecord: QnaRecord = {
                question: currentQuestion.question,
                answer: "[TIMEOUT / NO RESPONSE]",
                feedback: null
            };
            setQnaHistory(prev => [...prev, newRecord]);
            setScoreHistory(prev => [...prev, 0]);
            resetTranscript();
            if (currentIndex < 29) {
                setCurrentIndex(prev => prev + 1);
                fetchNextQuestion([...qnaHistory, newRecord]);
                setTimeLeft(60);
            } else {
                handleFinalSubmission([...qnaHistory, newRecord]);
            }
            return;
        } else {
            alert("No audio detected. Please provide an answer or wait for the timer to auto-skip.");
            return;
        }
    }

    const finalAnswer = transcript.trim();
    SpeechRecognition.stopListening();
    
    const newRecord: QnaRecord = {
        question: currentQuestion.question,
        answer: finalAnswer,
        feedback: null
    };
    
    setQnaHistory(prev => [...prev, newRecord]);
    setScoreHistory(prev => [...prev, 100]); // Mark as answered for progress bar
    resetTranscript();

    if (currentIndex < 29) {
        setCurrentIndex(prev => prev + 1);
        fetchNextQuestion([...qnaHistory, newRecord]);
    } else {
        handleFinalSubmission([...qnaHistory, newRecord]);
    }
  };

  const handleFinalSubmission = async (fullHistory: QnaRecord[]) => {
      setIsFinalizing(true);
      setIsLoading(true);
      setLoadingText("Compiling overall performance evaluation...");
      try {
          const username = localStorage.getItem('mock_mitra_user') || 'Anonymous';
          // Send all QnAs to backend for macro evaluation and storage
          const report = await submitAndAnalyze(username, techStack, fullHistory);
          setFinalReport(report);
      } catch (error) {
          console.error("Report Error:", error);
      } finally {
          setIsLoading(false);
      }
  };

  // REMOVED EFFECT: fetchNextQuestion is now called explicitly in submitAnswer
  // to avoid stale state issues with qnaHistory.

  if (!browserSupportsSpeechRecognition) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Browser support missing for AI Link.</div>;
  }

  return (
    <div className="h-screen text-white font-sans overflow-hidden flex flex-col pt-16" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }}>
      
      {/* HEADER: DUAL TIMERS & SESSION INFO */}
      <header className="h-16 border-b border-white/5 bg-[#111] flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/10 border border-purple-600/20 rounded-full">
             <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
             <p className="text-[10px] font-bold tracking-widest uppercase text-purple-400">
                Live: {techStack}
             </p>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden sm:block">Section: {currentQuestion?.section || "Syncing"}</p>
        </div>

        {/* PROGRESS DOTS - COMPACT */}
        <div className="hidden xl:flex items-center gap-1 opacity-80">
          {Array.from({ length: 30 }).map((_, i) => {
            const answered = i < scoreHistory.length;
            const score = scoreHistory[i] ?? 0;
            const dotColor = answered
              ? score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-purple-500' : score >= 30 ? 'bg-orange-500' : 'bg-red-500'
              : 'bg-white/5';
            const isCurrent = i === currentIndex;
            return (
              <div 
                key={i} 
                className={`w-1 h-4 rounded-full transition-all duration-300 ${isCurrent ? 'bg-purple-500 ring-2 ring-purple-500/30' : dotColor}`}
              />
            );
          })}
        </div>
        
        <div className="flex items-center gap-6">
           {/* GLOBAL TIMER */}
           <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-black text-gray-600 tracking-widest leading-none mb-1">Total Remaining</span>
              <div className="flex items-center gap-2">
                <HiClock className="text-gray-500 text-xs" />
                <span className="text-sm font-mono font-black text-white">
                  {Math.floor(globalTimeLeft / 60)}:{String(globalTimeLeft % 60).padStart(2, '0')}
                </span>
              </div>
           </div>

           {/* QUESTION TIMER */}
           <div className={`flex flex-col items-end px-4 py-1.5 rounded-xl border transition-all duration-300 ${timeLeft < 15 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
              <span className="text-[9px] uppercase font-black text-gray-600 tracking-widest leading-none mb-1">Time Left</span>
              <div className="flex items-center gap-2">
                <HiClock className={`${timeLeft < 15 ? 'text-red-500' : 'text-purple-500'} text-xs`} />
                <span className={`text-base font-mono font-black ${timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-purple-500'}`}>
                  {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
           </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA: NO SCROLL */}
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden">
        
        {/* LEFT: INTERVIEWER & QUESTION */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 bg-[#121212] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
                {/* AMBIENCE */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>

                {/* QUESTION BOX - CENTERED & EXPANSIVE */}
                <div className="w-full max-w-3xl text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                      <HiCpuChip className="text-purple-500 text-xs" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono">Channel {currentIndex + 1} // Technical Phase</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-5xl font-black italic tracking-tight leading-[1.15] text-white line-clamp-6">
                      <TypingText text={currentQuestion?.question || "Establishing link to AI core..."} />
                    </h2>
                    
                    <AnimatePresence>
                      {isEvaluating && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-center gap-3 text-purple-400 font-bold text-sm uppercase tracking-widest italic"
                        >
                          <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          Synthesizing evaluate...
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* TRANSCRIPTION FOOTER - INCREASED SCALE */}
            <div className="h-48 shrink-0 bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-30 transition-opacity group-hover:opacity-100">
                  <SoundVisualizer active={listening} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Live Transcription Feed</span>
                </div>
                <div ref={transcriptRef} className="flex-1 overflow-y-auto pr-6 custom-scrollbar">
                    <p className={`text-xl font-bold leading-relaxed tracking-tight ${transcript ? 'text-gray-200' : 'text-gray-700 italic'}`}>
                        {transcript || (listening ? "Node active. Initializing speech-to-text..." : "Mic standby. Please speak to initiate protocol.")}
                    </p>
                </div>
            </div>
        </div>

        {/* RIGHT: CAMERA & CONTROLS */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col gap-4 overflow-hidden">
            {/* WEBCAM FEED - VERTICALLY FLEXIBLE */}
            <div className="relative flex-1 min-h-0 bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
                <Webcam audio={false} className="w-full h-full object-cover grayscale-[0.2]" mirrored={true} />
                
                {/* HUD Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none"></div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                   <div className="w-10 h-10 bg-black/60 backdrop-blur-xl rounded-xl flex items-center justify-center text-white/80 border border-white/10 shadow-lg">
                        <HiVideoCamera className="text-xl" />
                   </div>
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-lg ${listening ? 'bg-purple-600 border-purple-400 text-white animate-pulse' : 'bg-black/60 border-white/10 text-white/50'}`}>
                        {listening ? <BsMicFill className="text-lg" /> : <BsMicMuteFill className="text-lg" />}
                   </div>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10">
                  <div className={`w-1.5 h-1.5 rounded-full ${listening ? 'bg-purple-500 animate-pulse' : 'bg-gray-600'}`}></div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Capture: Synchronized</span>
                </div>
            </div>

            {/* CONTROL PANEL - COMPACT GRID */}
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shrink-0 shadow-xl relative overflow-hidden">
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button 
                        className={`h-14 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${listening ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 active:scale-95' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                        onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true, language: "en-IN" })}
                    >
                        {listening ? <HiXMark size={16} /> : <BsMicFill size={14} />}
                        {listening ? 'Stop' : 'Start Mic'}
                    </button>

                    <button 
                        className="h-14 bg-white/5 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                        onClick={() => resetTranscript()}
                    >
                        Clear
                    </button>
                </div>

                <button 
                    className="w-full h-16 bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale shadow-xl shadow-purple-600/20"
                    onClick={() => submitAnswer()}
                    disabled={isLoading || !transcript || isEvaluating}
                >
                    {isLoading ? 'Syncing...' : (currentIndex < 29 ? 'Next Protocol' : 'Finalize Session')}
                    <HiRocketLaunch className="text-base" />
                </button>
            </div>
        </div>
      </main>

      {/* FINAL REPORT OVERLAY */}
      <AnimatePresence>
          {isFinalizing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[100] p-8 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }}
              >
                  <div className="max-w-5xl mx-auto py-10">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white italic">
                            Performance <span className="text-purple-500 underline decoration-purple-500/20 underline-offset-8">Report</span>
                        </h1>
                        <p className="text-gray-500 font-medium tracking-wide text-xs uppercase tracking-[0.3em]">Candidate Technical Analysis Dashboard</p>
                    </div>

                    {finalReport ? (
                        <div className="space-y-12 pb-20">
                            {/* SCORE DASHBOARD */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <MetricCircle score={finalReport.metrics?.communication || 0} label="Communication" color="stroke-purple-500" />
                                <MetricCircle score={finalReport.metrics?.technical || 0} label="Technical" color="stroke-indigo-500" />
                                <MetricCircle score={finalReport.metrics?.confidence || 0} label="Confidence" color="stroke-green-500" />
                                <MetricCircle score={finalReport.overall_score || 0} label="Overall" color="stroke-white" />
                            </div>

                            {/* DETAILED FEEDBACK */}
                            <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                                <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                                    <HiCheckBadge className="text-purple-500 text-3xl" />
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Section-wise Analysis</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {finalReport.section_analysis?.map((item: any, i: number) => (
                                        <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-purple-500/30 transition-all group">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-purple-500 uppercase tracking-[0.2em] text-[10px]">{item.section_name}</span>
                                                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-[10px] font-black">{item.score}/100</span>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed font-bold group-hover:text-gray-200 transition-colors">{item.comments}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                className="w-full h-16 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl shadow-purple-600/20"
                                onClick={() => navigate('/dashboard')}
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 gap-8">
                            <Loader />
                            <div className="text-center">
                                <p className="text-xl font-black text-white tracking-[0.3em] uppercase animate-pulse">Analyzing Session Data</p>
                                <p className="mt-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Please wait while we synthesize your performance metrics...</p>
                            </div>
                        </div>
                    )}
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && !isFinalizing && (
            <motion.div 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }}
            >
                <Loader />
                <div className="text-center">
                    <p className="text-lg font-black text-white tracking-[0.4em] uppercase">Initializing Connection</p>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">{loadingText}</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interview;
