"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { API_URL } from '@/utils/api';

interface User {
  username: string;
  nickname: string;
  role: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  anonymousId: string | null;
  showLogin: boolean;
  setShowLogin: Dispatch<SetStateAction<boolean>>;
  login: (userData: User) => void;
  logout: () => void;
  updateNickname: (newNickname: string) => Promise<void>;
  deleteUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const generateId = () => {
  if (typeof window.crypto !== 'undefined' && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        let anonId = localStorage.getItem('anonymousId');
        if (!anonId) {
          anonId = `anonymous_${generateId()}`;
          localStorage.setItem('anonymousId', anonId);
        }
        setAnonymousId(anonId);
      }
    } catch (error) {
      console.error("Failed to access localStorage or parse user data:", error);
      localStorage.removeItem('user');
      localStorage.removeItem('anonymousId');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    localStorage.removeItem('anonymousId');
    setAnonymousId(null);
    setShowLogin(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    const newAnonymousId = `anonymous_${generateId()}`;
    localStorage.setItem('anonymousId', newAnonymousId);
    setAnonymousId(newAnonymousId);
  };

  const updateNickname = async (newNickname: string) => {
    if (!user || !user.token) {
      throw new Error('You must be logged in to update your nickname.');
    }
    const response = await fetch(`${API_URL}/users/me/nickname`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ newNickname }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update nickname');
    }
    const updatedUser = { ...user, nickname: newNickname };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const deleteUser = async () => {
    if (!user || !user.token) {
      throw new Error("You must be logged in to delete your account.");
    }
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user account.');
    }
    logout();
  };

  const value = {
    user,
    anonymousId,
    showLogin,
    setShowLogin,
    login,
    logout,
    updateNickname,
    deleteUser,
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
