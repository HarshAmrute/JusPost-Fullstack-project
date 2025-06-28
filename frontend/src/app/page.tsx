"use client";

import Link from 'next/link';
import { FiFeather, FiMessageSquare, FiUsers, FiArrowRight, FiShield, FiLock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const featureCardVariants: Variants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground className="absolute inset-0" preset="default" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 pt-20 pb-20">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
          variants={container}
        >
          <motion.div 
            className="relative mb-6"
            variants={item}
          >
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full -z-10"></div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">JusPost</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            variants={item}
          >
            A minimalist platform for sharing your thoughts, ideas, and stories with the world. Clean, simple, and focused on what matters: your content.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={item}
          >
            <Link href="/post"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <FiFeather className="w-5 h-5" />
              <span>Create a Post</span>
            </Link>
            <Link href="/feeds"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <span>View Posts</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-32 w-full max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Features</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">Everything you need to express yourself and connect with others</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              variants={featureCardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center mb-4">
                <FiFeather size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple Posting</h3>
              <p className="text-gray-600 dark:text-gray-400">A clean, distraction-free editor to get your ideas out quickly and beautifully.</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              variants={featureCardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg flex items-center justify-center mb-4">
                <FiMessageSquare size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Feed</h3>
              <p className="text-gray-600 dark:text-gray-400">See new posts appear instantly without needing to refresh the page.</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              variants={featureCardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center mb-4">
                <FiUsers size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600 dark:text-gray-400">Engage with others through likes and comments in a respectful environment.</p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <motion.div 
              className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              variants={featureCardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg flex items-center justify-center mb-4">
                <FiShield size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Controls</h3>
              <p className="text-gray-600 dark:text-gray-400">Powerful moderation tools for administrators to maintain a healthy community environment.</p>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              variants={featureCardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg flex items-center justify-center mb-4">
                <FiLock size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Private Posts</h3>
              <p className="text-gray-600 dark:text-gray-400">Create posts that are only visible to you or share with specific people via a unique link.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
