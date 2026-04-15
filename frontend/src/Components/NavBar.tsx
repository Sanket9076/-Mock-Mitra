import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiUserCircle, HiBars3BottomRight, HiXMark } from "react-icons/hi2";
import Logo from "../assets/pngwing3.png"

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('mock_mitra_token');
    const user = localStorage.getItem('mock_mitra_user');
    if (token) {
      setIsLogged(true);
      setUserName(user?.split(' ')[0] || "User");
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mock_mitra_token');
    localStorage.removeItem('mock_mitra_user');
    setIsLogged(false);
    navigate('/');
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Interviews", path: "/interviews" },
    { name: "Contact", path: "/contact" },
  ];

  if (isLogged) navLinks.splice(2, 0, { name: "Dashboard", path: "/dashboard" });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-[100] h-16 transition-all duration-500 ${
        scrolled
          ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-[#7C3AED]/20 shadow-lg shadow-[#7C3AED]/5'
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-9 h-9 flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-[#7C3AED]/40 blur-lg rounded-full group-hover:bg-[#A855F7]/60 transition-all group-hover:scale-110" />
            <motion.img 
              whileHover={{ scale: 1.15, rotate: 5 }}
              src={Logo} 
              alt="Mock Mitra" 
              className="w-full h-full object-contain brightness-125 relative z-10 transition-all" 
              style={{ filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.8))' }}
            />
          </motion.div>
          <span
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#F8FAFC] to-[#A855F7] bg-clip-text text-transparent group-hover:from-[#A855F7] group-hover:to-[#F8FAFC] transition-all duration-500"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Mock Mitra
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 relative pb-1 ${
                  location.pathname === link.path
                    ? 'text-[#A855F7]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#7C3AED] to-[#A855F7]"
                  />
                )}
              </Link>
            ))}
          </div>
          
          <div className="w-px h-4 bg-[#7C3AED]/30" />

          {isLogged ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <HiUserCircle className="text-xl text-[#A855F7]" />
                <span>{userName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-[#94A3B8] hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="relative px-5 py-2 text-sm font-semibold text-white rounded-full overflow-hidden group inline-block"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7]" />
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
                <span className="relative z-10">Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-[#F8FAFC] text-2xl p-2 rounded-xl border border-[#7C3AED]/20 hover:border-[#A855F7]/40 hover:bg-[#7C3AED]/10 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiXMark /> : <HiBars3BottomRight />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[#020617]/95 backdrop-blur-xl border-b border-[#7C3AED]/20 p-6 flex flex-col gap-4 shadow-2xl shadow-[#7C3AED]/10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  location.pathname === link.path ? 'text-[#A855F7]' : 'text-[#94A3B8]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#7C3AED]/20 flex flex-col gap-4">
              {!isLogged ? (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-[#94A3B8] font-medium">Login</Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-5 py-3 text-center bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl font-bold"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="text-left text-red-400 font-medium">Logout</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
