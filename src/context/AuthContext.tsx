import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.js';
import { api, setAuthToken } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; phone?: string; address?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { full_name: string; phone?: string; address?: string }) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('semurug_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('semurug_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    async function verifyUser() {
      if (token) {
        try {
          const { user: verifiedUser } = await api.getMe();
          setUser(verifiedUser);
          localStorage.setItem('semurug_user', JSON.stringify(verifiedUser));
        } catch (e) {
          console.warn('Session expired or invalid token:', e);
          logout();
        }
      }
      setLoading(false);
    }
    verifyUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setTokenState(res.token);
    localStorage.setItem('semurug_user', JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const register = async (data: { email: string; password: string; full_name: string; phone?: string; address?: string }) => {
    const res = await api.register(data);
    setUser(res.user);
    setTokenState(res.token);
    localStorage.setItem('semurug_user', JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setAuthToken(null);
    localStorage.removeItem('semurug_user');
  };

  const updateProfile = async (data: { full_name: string; phone?: string; address?: string }) => {
    const { user: updated } = await api.updateProfile(data);
    setUser(updated);
    localStorage.setItem('semurug_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
