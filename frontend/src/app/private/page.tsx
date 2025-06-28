"use client";

import { useState } from 'react';
import { usePosts } from '@/context/PostContext';
import { FiLock, FiClipboard, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ParticleBackground from '@/components/ParticleBackground';

interface NewPostInfo {
  uniqueId: string;
  message: string;
}

export default function PrivatePostsPage() {
  const { createPost } = usePosts();
  const [message, setMessage] = useState('');
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [newPost, setNewPost] = useState<NewPostInfo | null>(null);
  const [accessCode, setAccessCode] = useState('');

  const handleCreatePrivatePost = async () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }
    const result = await createPost(message, true, expiresIn);
    if (result) {
      setNewPost({ uniqueId: result.uniqueId, message: result.message });
      setMessage('');
      setExpiresIn(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleGoToPost = () => {
    if (accessCode.trim()) {
      window.location.href = `/p/${accessCode.trim()}`;
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <ParticleBackground className="absolute inset-0" preset="light" />
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <FiLock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Private Posts</h1>
        </div>

        {/* Access Post Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Access a Private Post</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
              placeholder="Enter post code..."
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
            <button 
              onClick={handleGoToPost}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-sm disabled:bg-green-300 dark:disabled:bg-green-800"
              disabled={!accessCode.trim()}
            >
              Go
            </button>
          </div>
        </div>

        {/* Create Post Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Create a New Private Post</h2>
          <textarea
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            rows={4}
            placeholder="Write a private message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiClock className="w-5 h-5" />
              <select 
                className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={expiresIn === null ? '' : String(expiresIn)}
                onChange={(e) => setExpiresIn(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Never expires</option>
                <option value="3600000">1 Hour</option>
                <option value="86400000">1 Day</option>
                <option value="604800000">7 Days</option>
              </select>
            </div>
            <button 
              onClick={handleCreatePrivatePost}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-sm disabled:bg-blue-300 dark:disabled:bg-blue-800"
              disabled={!message.trim()}
            >
              Create Post
            </button>
          </div>
        </div>

        {newPost && (
          <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-800 dark:text-green-200 p-6 rounded-xl shadow-md mb-10">
            <h3 className="text-xl font-bold mb-3">Post Created Successfully!</h3>
            <p className="mb-4 whitespace-pre-wrap"><strong>Message:</strong> {newPost.message}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <span className="font-mono text-lg text-gray-900 dark:text-white">{newPost.uniqueId}</span>
                <button onClick={() => copyToClipboard(newPost.uniqueId)} className="px-4 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm font-semibold">Copy Code</button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <span className="text-sm text-blue-600 dark:text-blue-400 truncate">{`${window.location.origin}/p/${newPost.uniqueId}`}</span>
                <button onClick={() => copyToClipboard(`${window.location.origin}/p/${newPost.uniqueId}`)} className="px-4 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm font-semibold">Copy Link</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
