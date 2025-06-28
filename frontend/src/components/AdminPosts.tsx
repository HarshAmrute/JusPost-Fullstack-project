"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/utils/api";
import { useUser } from "@/context/UserContext";
import { HiOutlineTrash, HiSearch, HiFilter, HiOutlineCalendar } from "react-icons/hi";
import { formatTimeAgo } from '@/utils/format';

interface PostItem {
  _id: string;
  message: string;
  username?: string;
  nickname?: string;
  uniqueId?: string; // for private posts
  createdAt: string;
}

interface Props {
  adminUsername: string | null;
}

const PostCard = ({ post, onDelete }: { post: PostItem, onDelete: (postId: string, postType: 'public' | 'private') => void }) => {
  const postType = post.uniqueId ? 'private' : 'public';
  const postId = postType === 'private' ? post.uniqueId! : post._id;
  const displayName = post.nickname || post.username || post.uniqueId || 'Anonymous';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
            postType === 'private' 
              ? 'bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700'
          }`}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              {displayName}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                postType === 'private'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {postType}
              </span>
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
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button 
          onClick={() => onDelete(postId, postType)} 
          className="text-gray-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
          title="Delete post"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function AdminPosts({ adminUsername }: Props) {
  const { user } = useUser();
  const currentUsername = user?.username;
  const [publicPosts, setPublicPosts] = useState<PostItem[]>([]);
  const [privatePosts, setPrivatePosts] = useState<PostItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchPosts = useCallback(async () => {
    setError(null);
    try {
      const [publicRes, privateRes] = await Promise.all([
        fetch(`${API_URL}/posts`),
        adminUsername ? fetch(`${API_URL}/private-posts?adminUsername=${adminUsername}`) : Promise.resolve(null)
      ]);

      const publicData = await publicRes.json();
      if (publicData.success) setPublicPosts(publicData.data);

      if (privateRes) {
        const privateData = await privateRes.json();
        if (privateData.success) setPrivatePosts(privateData.data);
      }
      
      setIsLoaded(true);
    } catch (err: any) {
      setError("Failed to fetch posts.");
      setIsLoaded(true);
    }
  }, [adminUsername]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filterFn = (post: PostItem) => {
    const text = (post.message + ' ' + (post.nickname || post.username || '') + ' ' + (post.uniqueId || '')).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  };

  // Filter and sort posts
  const filteredPublic = publicPosts.filter(filterFn);
  const filteredPrivate = privatePosts.filter(filterFn);

  // Combine and sort posts based on the active tab
  let displayPosts: PostItem[] = [];
  
  if (activeTab === 'all') {
    displayPosts = [...filteredPublic, ...filteredPrivate];
  } else if (activeTab === 'public') {
    displayPosts = filteredPublic;
  } else {
    displayPosts = filteredPrivate;
  }

  // Sort posts
  displayPosts.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const handleDeletePost = async (postId: string, postType: 'public' | 'private') => {
    if (!currentUsername) return;

    const endpoint = postType === 'public' 
      ? `${API_URL}/posts/${postId}` 
      : `${API_URL}/private-posts/${postId}?adminUsername=${adminUsername}`;

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const res = await fetch(endpoint, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            postType === 'public'
              ? { username: currentUsername } // public posts use username for auth
              : { userId: currentUsername, userRole: user?.role ?? 'user' } // private posts expect both id and role
          ),
        });

        if (res.ok) {
          if (postType === 'public') {
            setPublicPosts((prev) => prev.filter((p) => p._id !== postId));
          } else {
            setPrivatePosts((prev) => prev.filter((p) => p.uniqueId !== postId));
          }
        } else {
          const data = await res.json().catch(() => ({}));
          alert(`Failed to delete post: ${data.message || 'Server error'}`);
        }
      } catch (err: any) {
        alert(`An error occurred: ${err.message}`);
      }
    }
  };

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {error && (
        <div className="mb-6 text-red-500 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <HiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <HiFilter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All Posts ({filteredPublic.length + filteredPrivate.length})
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'public'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Public Posts ({filteredPublic.length})
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'private'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Private Posts ({filteredPrivate.length})
          </button>
        </div>
      </div>

      {displayPosts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No posts match your search.' : 'No posts available.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayPosts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}
    </div>
  );
}
