"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className="relative z-10 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold flex items-center">
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                whileHover={{ scale: 1.05 }}
              >
                JusPost
              </motion.span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              A minimalist platform for sharing your thoughts, ideas, and stories with the world. Clean, simple, and focused on what matters: your content.
            </p>
            <div className="mt-6 flex space-x-4">
              <motion.a 
                href="https://github.com/HarshAmrute" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub />
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/harshamrute/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLinkedin />
              </motion.a>
              <motion.a 
                href="mailto:harsh1amrute@gmail.com" 
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMail />
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/feeds"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link 
                  href="/post"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Create Post
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/private"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Private Posts
                </Link>
              </li>
              <li>
                <Link 
                  href="/posts"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  My Posts
                </Link>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} JusPost. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <FiHeart className="mx-1 text-red-500" />
            <span>using Next.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
