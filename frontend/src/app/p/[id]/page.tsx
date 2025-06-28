"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { FiClock, FiUser, FiHash } from 'react-icons/fi';
import { HiOutlineCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { formatTimeAgo } from '@/utils/format';

interface PrivatePost {
  _id: string;
  message: string;
  uniqueId: string;
  authorId: string;
  nickname?: string;
  authorRole: string;
  createdAt: string;
  expiresAt?: string;
}

export default function PrivatePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<PrivatePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/private-posts/${id}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.data);
        } else {
          throw new Error(data.message || 'Post not found or has expired.');
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Post Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">This post may have been deleted or expired.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-full flex items-center justify-center text-white font-bold">
            {(post.nickname || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <p className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              {post.nickname || 'Anonymous'}
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                private
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
        
        <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-6">{post.message}</p>
        
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <span className="flex items-center gap-1.5">
              <FiHash />
              <span className="font-mono">{post.uniqueId}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock />
            <span>{post.expiresAt ? `Expires: ${formatTimeAgo(post.expiresAt)}` : 'Never expires'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
