'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  authProvider: string;
  loginMethod?: string;
  profilePicture?: string;
  roles: string[];
  isAdmin: boolean;
  isUserPaid: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions for cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user data on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Try to get from cookies first (for middleware)
        const cookieToken = getCookie('authToken');

        // Fallback to localStorage
        const storedToken = cookieToken || localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);

          if (!parsedUser.roles) {
            parsedUser.roles = [];
          }
          if (parsedUser.isAdmin === undefined) {
            parsedUser.isAdmin = parsedUser.roles.includes('Admin');
          }
          if (parsedUser.isUserPaid === undefined) {
            parsedUser.isUserPaid = false;
          }

          setUser(parsedUser);

          // Ensure cookie is set if it's not
          if (!cookieToken) {
            setCookie('authToken', storedToken);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear corrupted data
        deleteCookie('authToken');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Login function
  const login = useCallback((authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);

    // Store in both cookie and localStorage
    setCookie('authToken', authToken, 7); // 7 days
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);

    // Clear both cookie and localStorage
    deleteCookie('authToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    router.push('/signin');
  }, [router]);

  // Update user data
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, token, isLoading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
