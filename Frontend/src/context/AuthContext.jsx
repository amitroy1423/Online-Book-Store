import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../api/auth.api';
import { AuthContext } from './auth-context';

function normalizeUser(userData) {
  if (!userData) return null;
  const id = userData.id || userData._id;
  return {
    ...userData,
    id,
    _id: id,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Restore session on mount via HTTP-only cookie
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await getCurrentUser();
        setUser(normalizeUser(res.data?.data));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);
    const normalized = normalizeUser(res.data?.data);
    setUser(normalized);
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    // 1. Create account on backend
    const regRes = await registerUser(data);
    // 2. Automatically log in so backend issues the HTTP-only auth token cookie
    const loginRes = await loginUser({ email: data.email, password: data.password });
    const normalized = normalizeUser(loginRes.data?.data || regRes.data?.data);
    setUser(normalized);
    return loginRes.data || regRes.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore if session already expired
    } finally {
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      setUser(normalizeUser(res.data?.data));
    } catch {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
