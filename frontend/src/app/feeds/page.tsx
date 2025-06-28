"use client";

import { usePosts } from '@/context/PostContext';
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import { HiOutlineHeart, HiHeart, HiChevronDown, HiOutlineTrash, HiSearch, HiFilter } from 'react-icons/hi';
import { formatTimeAgo } from '@/utils/format';
import ParticleBackground from '@/components/ParticleBackground';
import toast from 'react-hot-toast';

export default function FeedsPage() {
  const { posts, likePost, deletePost, fetchLikerNicknames } = usePosts();
  const { user, anonymousId } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingNicknames, setIsLoadingNicknames] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLike = (postId: string) => {
    const userId = user?.username || anonymousId;
    if (!userId) {
      toast.error('You need to be logged in to like posts');
      return;
    }
    
    try {
      likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post. Please try again.');
    }
  };

  const handleDelete = (postId: string) => {
    if (confirm('Delete this post?')) {
      deletePost(postId);
    }
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => 
      post.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.nickname.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleFetchNicknames = async (likerIds: string[]) => {
    setIsLoadingNicknames(true);
    await fetchLikerNicknames(likerIds);
    setIsLoadingNicknames(false);
  };

  // Helper to resolve display name for a liker id
  const resolveDisplayName = (likerId: string): string => {
    // 1. If backend provided nickname mapping
    const anyPostWithNick = posts.find(p => p.likerNicknames && p.likerNicknames[likerId]);
    if (anyPostWithNick) {
      return (anyPostWithNick.likerNicknames as Record<string,string>)[likerId];
    }
    // 2. If anonymous pattern
    if (likerId.startsWith('anonymous_')) return 'Anonymous';
    // 3. If we can find a post authored by that user, use its nickname field
    const authoredPost = posts.find(p => p.username === likerId);
    if (authoredPost) return authoredPost.nickname;
    // 4. If current logged-in user matches
    if (user?.username === likerId) return user.nickname;
    return 'User';
  };

  return (
    <div className="min-h-screen relative">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground className="absolute inset-0" preset="light" />
      </div>
      
      <div className={`max-w-3xl mx-auto p-4 relative z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Feed</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <HiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No posts match your search.' : 'No posts yet. Be the first to post!'}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const currentUserId = user?.username || anonymousId;
            const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
            const canDelete = user?.role === 'admin' || post.username === user?.username || post.nickname === user?.nickname;

            return (
              <div key={post._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-visible">
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.message}</p>
                </div>
                <div className="px-5 py-3 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-100/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(post._id)} 
                        className={`flex items-center gap-2 px-2 py-1 rounded-full ${isLiked 
                          ? 'text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-500/10 dark:hover:bg-gray-500/20'
                        } transition-colors duration-200`}
                      >
                        {isLiked ? <HiHeart className="w-6 h-6" /> : <HiOutlineHeart className="w-6 h-6" />}
                        <span className="text-sm font-semibold">{post.likes.length}</span>
                      </button>
                      
                      {post.likes.length > 0 && (
                        <div className="relative" style={{ zIndex: 100 }}>
                          <button
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            onClick={()=>{
                              if(openDropdownId===post._id){
                                setOpenDropdownId(null);
                              }else{
                                // fetch missing nicknames for this post
                                const missing=post.likes.filter(id=>!post.likerNicknames?.[id] && !id.startsWith('anonymous_'));
                                if(missing.length>0){handleFetchNicknames(missing);} 
                                setOpenDropdownId(post._id);
                              }
                            }}
                          >
                            <span>Liked by</span>
                            <HiChevronDown className={`w-3 h-3 transform transition-transform ${openDropdownId===post._id? 'rotate-180':''}`} />
                          </button>

                          {openDropdownId===post._id && (
                            <div className="absolute left-0 bottom-full mb-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-lg w-48 origin-bottom animate-scale-fade" >
                              {isLoadingNicknames ? (
                                <div className="text-sm text-gray-500 p-3">Loading...</div>
                              ) : (
                                <ul className="p-3 space-y-1 text-sm text-gray-600 dark:text-gray-300 max-h-60 overflow-y-auto">
                                  {post.likes.map(id=> (
                                    <li key={id} className="py-1 px-2 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 rounded">
                                      {resolveDisplayName(id)}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {canDelete && (
                      <button 
                        title="Delete post" 
                        onClick={() => handleDelete(post._id)} 
                        className="text-gray-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-full"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    )}
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
