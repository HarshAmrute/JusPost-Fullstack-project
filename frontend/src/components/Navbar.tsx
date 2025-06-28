"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { API_URL } from '@/utils/api';
import { useTheme } from '@/context/ThemeContext';
import { HiPencil, HiOutlineX, HiMenu, HiSun, HiMoon, HiUser, HiLogout, HiOutlineUserCircle, HiHome } from 'react-icons/hi';
import ProfileModal from '@/components/ProfileModal';
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 font-semibold'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50'
      }`}
    >
      <motion.span 
        initial={{ y: -5, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
    </Link>
  );
};

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {mounted ? (
        theme === 'dark' ? (
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <HiSun className="w-5 h-5 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <HiMoon className="w-5 h-5 text-blue-500" />
          </motion.div>
        )
      ) : (
        <div className="w-5 h-5" /> // Placeholder to prevent layout shift and hydration mismatch
      )}
    </motion.button>
  );
};

export default function Navbar() {
  const { user, login, logout, showLogin, setShowLogin } = useUser();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginNickname, setLoginNickname] = useState('');
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, nickname: loginNickname }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login or registration failed');
      }
      login({
        username: data.data.username,
        nickname: data.data.nickname,
        role: data.data.role,
        token: data.token,
      });
      setShowLogin(false);
      setLoginUsername('');
      setLoginNickname('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const navLinks = (
    <>
      <NavLink href="/">
        <div className="flex items-center gap-1.5">
          <HiHome className="w-4 h-4" />
          <span>Home</span>
        </div>
      </NavLink>
      <NavLink href="/feeds">Feed</NavLink>
      {user && <NavLink href="/post">Create Post</NavLink>}
      <NavLink href="/posts">My Posts</NavLink>
      <NavLink href="/private">Private Posts</NavLink>
      {user?.role === 'admin' && <NavLink href="/admin">Admin</NavLink>}
      <NavLink href="/about">About</NavLink>
    </>
  );

  return (
    <>
      <motion.header 
        className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-all duration-300 ${
          isScrolled ? 'border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-black/70 shadow-sm' : 'bg-white/40 dark:bg-black/40'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold flex items-center">
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              JusPost
            </motion.span>
          </Link>
          <motion.nav 
            className="hidden md:flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {navLinks}
          </motion.nav>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ThemeToggleButton />
            {user ? (
              <div className="flex items-center gap-3">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <HiOutlineUserCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">Hi, {user.nickname}</span>
                </motion.div>
                <motion.button 
                  onClick={()=>setShowProfile(true)} 
                  className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Profile
                </motion.button>
                <motion.button 
                  onClick={logout} 
                  className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(239, 68, 68, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button 
                onClick={() => setShowLogin(true)} 
                className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            )}
            <motion.button 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </motion.button>
          </motion.div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="px-3 pt-2 pb-4 space-y-1.5 sm:px-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                {navLinks}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {showLogin && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLogin(false);
            }}
          >
            <motion.div 
              className="bg-white/90 dark:bg-gray-900/90 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Login or Register</h2>
              
              <AnimatePresence>
                {error && (
                  <motion.p 
                    className="text-red-500 bg-red-100 dark:bg-red-900/50 border border-red-500/30 p-3 rounded-lg text-center mb-4 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5" htmlFor="username">Private Username</label>
                  <input
                    id="username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5" htmlFor="nickname">Public Username (Nickname)</label>
                  <input
                    id="nickname"
                    type="text"
                    value={loginNickname}
                    onChange={(e) => setLoginNickname(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Only needed for new users.</p>
                </div>
                <div className="flex justify-end mt-6">
                  <motion.button 
                    type="button" 
                    onClick={() => setShowLogin(false)} 
                    className="px-4 py-2 mr-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors"
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loginUsername ? 'Login' : 'Register'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && <ProfileModal show={showProfile} onClose={()=>setShowProfile(false)} />}
      </AnimatePresence>
    </>
  );
}
