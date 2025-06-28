"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { API_URL, SOCKET_BASE } from '@/utils/api';
import { useUser } from './UserContext';

// Public Post Interface
interface Post {
  _id: string;
  message: string;
  username: string;
  nickname:string;
  likes: string[];
  comments: any[];
  createdAt: string;
  authorRole: string;
  likerNicknames?: { [key: string]: string };
}

// Private Post Interface
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

interface PostContextType {
  posts: Post[];
  privatePosts: PrivatePost[];
  createPost: (message: string, isPrivate: boolean, expiresIn?: number | null) => Promise<PrivatePost | void>;
  likePost: (postId: string) => void;
  deletePost: (postId: string) => void;
  deletePrivatePost: (uniqueId: string) => void;
  fetchPrivatePosts: () => void;
  fetchLikerNicknames: (likerIds: string[]) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const { user, anonymousId } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [privatePosts, setPrivatePosts] = useState<PrivatePost[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_BASE);
    setSocket(newSocket);

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        if (data.success) {
          setPosts(data.data);
          // Eagerly fetch liker nicknames for all posts
          const allLikerIds = data.data.flatMap((p: Post) => p.likes);
          if (allLikerIds.length > 0) {
            fetchLikerNicknames(Array.from(new Set(allLikerIds)));
          }
        } else {
          throw new Error(data.message || 'Failed to fetch posts');
        }
      } catch (error) {
        let errorMessage = 'Could not fetch posts.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.error('Failed to fetch posts:', error);
        toast.error(errorMessage);
      }
    };

    fetchPosts();

    newSocket.on('new_post', (post: Post) => {
      setPosts((prev) => [post, ...prev]);
    });

    newSocket.on('update_post', (updatedPost: Post) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
      if (updatedPost.likes.length > 0) {
        fetchLikerNicknames(updatedPost.likes);
      }
    });

    newSocket.on('delete_post', (deletedPost: { _id: string }) => {
      setPosts((prev) => prev.filter((p) => p._id !== deletedPost._id));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchLikerNicknames = async (likerIds: string[]) => {
    try {
      const res = await fetch(`${API_URL}/posts/nicknames`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: likerIds }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prevPosts => 
          prevPosts.map(p => ({
            ...p,
            likerNicknames: { ...p.likerNicknames, ...data.nicknames }
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch liker nicknames', error);
    }
  };

  const fetchPrivatePosts = async () => {
    const authorId = user?.username || anonymousId;
    if (!authorId) {
      setPrivatePosts([]); // No user, no posts
      return;
    }

    try {
      const res = await fetch(`${API_URL}/private-posts?authorId=${authorId}`);
      const data = await res.json();
      if (data.success) {
        setPrivatePosts(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch private posts');
      }
    } catch (error) {
      let errorMessage = 'Could not fetch private posts.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Failed to fetch private posts:', error);
      toast.error(errorMessage);
    }
  };

  const createPost = async (message: string, isPrivate: boolean, expiresIn: number | null = null): Promise<PrivatePost | void> => {
    const authorId = user?.username || anonymousId;
    if (!authorId) return;

    if (isPrivate) {
      const payload: { message: string, authorId: string, nickname: string | null, expiresIn?: number } = {
        message,
        authorId,
        nickname: user?.nickname || null
      };

      if (expiresIn) {
        payload.expiresIn = expiresIn;
      }

      const promise = fetch(`${API_URL}/private-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      }).then(data => {
        if (data.success) {
          fetchPrivatePosts(); // Refetch to update the list
          return data.data; // Return the new post data
        } else {
          throw new Error(data.error || 'Failed to create post');
        }
      });

      return toast.promise(promise, {
        loading: 'Creating private post...',
        success: 'Private post created!',
        error: (err) => err.message || 'Failed to create private post.',
      });
    } else {
      if (!socket) return;
      const promise = fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, username: authorId, nickname: user?.nickname }),
      });
      toast.promise(promise, {
        loading: 'Creating post...',
        success: 'Post created!',
        error: 'Failed to create post.',
      });
    }
  };

  const likePost = async (postId: string) => {
    const likerId = user?.username || anonymousId;
    if (!likerId) return;

    const originalPosts = [...posts];
    const postIndex = posts.findIndex((p) => p._id === postId);
    if (postIndex === -1) return;

    const postToUpdate = { ...posts[postIndex] };
    const isLiked = postToUpdate.likes.includes(likerId);

    if (isLiked) {
      postToUpdate.likes = postToUpdate.likes.filter((id) => id !== likerId);
    } else {
      postToUpdate.likes.push(likerId);
    }

    const updatedPosts = [...posts];
    updatedPosts[postIndex] = postToUpdate;
    setPosts(updatedPosts);

    try {
      const res = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likerId }),
      });
      if (!res.ok) throw new Error('Failed to update like status on the server');
      const updatedPost = await res.json();
      if (updatedPost.success) {
        fetchLikerNicknames(updatedPost.data.likes);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
      setPosts(originalPosts);
      toast.error('Could not update like.');
    }
  };

  const deletePost = (postId: string) => {
    if (!user) return;
    const promise = fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username }),
    });
    toast.promise(promise, {
      loading: 'Deleting post...',
      success: 'Post deleted!',
      error: 'Failed to delete post.',
    });
  };

  const deletePrivatePost = async (uniqueId: string) => {
    const userId = user?.username || anonymousId;
    if (!userId) return;

    const promise = fetch(`${API_URL}/private-posts/${uniqueId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userRole: user?.role ?? 'user' }),
    });

    toast.promise(promise, {
        loading: 'Deleting private post...',
        success: () => {
            setPrivatePosts(prev => prev.filter(p => p.uniqueId !== uniqueId));
            return 'Private post deleted!';
        },
        error: 'Failed to delete private post.',
    });
  };

  const value = { posts, privatePosts, createPost, likePost, deletePost, deletePrivatePost, fetchPrivatePosts, fetchLikerNicknames };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
