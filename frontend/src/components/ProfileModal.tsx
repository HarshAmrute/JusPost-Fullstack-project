"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { API_URL } from '@/utils/api';
import { HiOutlineUserCircle, HiOutlineX, HiOutlineCheck, HiOutlineExclamation } from 'react-icons/hi';

interface ProfileModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ProfileModal({ show, onClose }: ProfileModalProps) {
  const { user, login } = useUser();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_URL}/users/${user.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ nickname })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      login({
        ...user,
        nickname
      });
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants: Variants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute top-0 right-0 p-4">
                <motion.button
                  onClick={onClose}
                  className="p-1 rounded-full bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiOutlineX className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <HiOutlineUserCircle className="w-14 h-14 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Your Profile
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Username
                    </label>
                    <div className="px-4 py-3 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {user?.username}
                      </p>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      This is your private username used for login.
                    </p>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Public Nickname
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          placeholder="Enter your public nickname"
                          required
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                          <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {user?.nickname}
                          </p>
                        </div>
                      )}
                      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        This is the name displayed to other users.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      {isEditing ? (
                        <>
                          <motion.button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setNickname(user?.nickname || '');
                            }}
                            className="px-4 py-2 mr-2 text-sm font-medium rounded-lg bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-colors"
                            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 text-sm font-medium rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200/50 dark:border-gray-700/50"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit Profile
                        </motion.button>
                      )}
                    </div>
                  </form>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="p-3 rounded-lg bg-red-100/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-center gap-2">
                          <HiOutlineExclamation className="w-5 h-5 text-red-500" />
                          <p>{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        className="p-3 rounded-lg bg-green-100/80 dark:bg-green-900/30 backdrop-blur-sm border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-center gap-2">
                          <HiOutlineCheck className="w-5 h-5 text-green-500" />
                          <p>{success}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your permissions level
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                      {user?.role === 'admin' ? 'Admin' : 'User'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 