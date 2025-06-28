"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { FiClock, FiUser, FiAlertTriangle } from 'react-icons/fi';

interface PrivatePost {
  _id: string;
  message: string;
  uniqueId: string;
  authorId: string;
  authorRole: string;
  createdAt: string;
  expiresAt?: string;
}

export default function PrivatePostViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<PrivatePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/private-posts/${id}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.data);
        } else {
          throw new Error(data.error || 'Post not found or has expired.');
        }
      } catch (err: any) {
        setError(err.message);
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
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="p-6 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <FiAlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Error</h1>
        <p className="max-w-md text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (!post) {
    return null; // Should not happen if loading is false and no error
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-gray-500 dark:text-gray-300">
              {post.authorId.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {post.authorId}
                {post.authorRole === 'admin' && (
                  <img src="/Admin.webp" alt="Verified admin" className="w-5 h-5" title="Admin Verified" />
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap my-6">{post.message}</p>
        </div>
        {post.expiresAt && (
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FiClock />
              <span>Expires: {new Date(post.expiresAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
