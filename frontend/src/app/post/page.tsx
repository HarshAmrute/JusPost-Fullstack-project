"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { usePosts } from '@/context/PostContext';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';

export default function CreatePostPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useUser();
  const { createPost } = usePosts();

  // Allow all users to access this page, even if not logged in

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createPost(message, false, null);
      router.push('/feeds');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 relative">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground className="absolute inset-0" preset="light" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div 
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            <motion.h1 
              className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Create a New Post
            </motion.h1>

            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-100/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder={`What's on your mind, ${user ? user.nickname : 'guest'}?`}
                  rows={8}
                  required
                />
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Creating...' : 'Create Post'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Tips for creating great posts:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Be clear and concise with your message</li>
            <li>Structure your content with paragraphs for readability</li>
            <li>Be respectful and considerate of your audience</li>
            <li>Check your post for spelling and grammar</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
