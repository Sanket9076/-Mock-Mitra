import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { HiRocketLaunch, HiCpuChip, HiChartBar, HiSquare3Stack3D } from "react-icons/hi2";

import UnicornScene from "unicornstudio-react";

const ROLES = [
  {
    id: 'mern',
    title: 'MERN Stack',
    description: 'Evaluate proficiency in MongoDB, Express, React, and Node.js ecosystems.',
    icon: <HiRocketLaunch />,
    color: 'text-fuchsia-500',
    bg: 'bg-fuchsia-500/10'
  },
  {
    id: 'node',
    title: 'Backend Engineering',
    description: 'Test knowledge in Node.js server-side logic and microservices architecture.',
    icon: <HiCpuChip />,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    id: 'java',
    title: 'Java Enterprise',
    description: 'Assessment for JVM tuning, Spring Boot, and enterprise design patterns.',
    icon: <HiSquare3Stack3D />,
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  },
  {
    id: 'data-analyst',
    title: 'Data Analysis',
    description: 'Evaluate statistical modeling, SQL processing, and data visualization skills.',
    icon: <HiChartBar />,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  }
];

export const InterviewTypes = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!localStorage.getItem('mock_mitra_token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen text-white pt-40 pb-20 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)' }}>
      
      {/* 3D Dynamic Cubes Background */}
      <div className="absolute -inset-[10%] z-0 opacity-40 mix-blend-screen pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[120%] h-[120%]">
          <UnicornScene
            projectId="I4F5GWyDcPEafKOk7NqU"
            width="100%"
            height="100%"
            scale={1}
            dpi={1.5}
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.9/dist/unicornStudio.umd.js"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Choose your <span className="text-[#A855F7]">path</span>.</h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
          Select a domain to begin your AI-powered interview simulation. We've optimized each track for industry-standard technical roles.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {ROLES.map((role, idx) => (
          <motion.div 
            key={role.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <Link to={`/interview/${role.id}`} className="block h-full transition-all duration-300 hover:-translate-y-2">
              <div className="h-full p-8 glass-card rounded-3xl transition-all duration-300 hover:border-[#A855F7]/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 ${role.bg} rounded-2xl flex items-center justify-center text-3xl ${role.color} transition-transform group-hover:scale-110`}>
                    {role.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest pt-2">Available</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white group-hover:text-[#A855F7] transition-colors">
                    {role.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-base font-medium">
                    {role.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Session <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
