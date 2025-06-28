"use client";

import { usePosts } from '@/context/PostContext';
import { useUser } from '@/context/UserContext';
import { FiTrash2, FiHeart, FiMessageSquare } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { formatDateTime, formatTimeAgo } from '@/utils/format';
import { HiSearch, HiFilter, HiOutlineCalendar, HiOutlineHeart, HiHeart, HiOutlineTrash } from 'react-icons/hi';
import ParticleBackground from '@/components/ParticleBackground';

export default function PostsPage() {
  const { posts, deletePost, likePost } = usePosts();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!user) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">My Posts</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Please log in to manage your personal posts.</p>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter((post) => post.username === user.username);
  
  // Filter and sort posts
  const filteredPosts = userPosts
    .filter(post => 
      post.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else { // popular
        return b.likes.length - a.likes.length;
      }
    });

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <ParticleBackground className="absolute inset-0" preset="light" />
      </div>

      <div className={`max-w-3xl mx-auto transition-opacity duration-500 relative z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">My Posts</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search my posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <HiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Liked</option>
              </select>
              <HiFilter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {filteredPosts.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              {searchQuery ? 'No posts match your search.' : 'You haven\'t created any posts yet.'}
            </p>
            {!searchQuery && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Head over to the "Create Post" page to share your thoughts!
              </p>
            )}
          </div>
        )}

        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const isLiked = user ? post.likes.includes(user.username) : false;

            return (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-200 dark:border-gray-700">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-full flex items-center justify-center text-white font-bold">
                      {post.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        {post.nickname}
                        {post.authorRole === 'admin' && (
                          <img src="/Admin.webp" alt="Verified admin" className="w-4 h-4 inline-block align-middle" title="Admin Verified" />
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <HiOutlineCalendar className="w-3.5 h-3.5" />
                          {formatTimeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.message}</p>
                </div>
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => likePost(post._id)} 
                        className={`flex items-center gap-1.5 ${isLiked 
                          ? 'text-red-500 dark:text-red-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
                        } transition-colors duration-200`}
                      >
                        {isLiked ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                        <span className="text-sm font-medium">{post.likes.length}</span>
                      </button>
                    </div>
                    
                    <button 
                      title="Delete post" 
                      onClick={() => deletePost(post._id)} 
                      className="text-gray-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
