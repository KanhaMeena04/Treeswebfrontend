import React, { useState, useEffect, createContext, useContext } from 'react';
import { demoAuthAPI, UserProfile } from '@/services/demoData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  checkUsername: (username: string) => Promise<boolean>;
  getUsernameSuggestions: (baseUsername: string) => Promise<string[]>;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false, don't auto-check auth

  const isAuthenticated = !!user;

  // Don't automatically check for existing authentication
  // Users will need to manually log in each time

  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await demoAuthAPI.login({ identifier, password });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await demoAuthAPI.register({ username, email, password, confirmPassword });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    demoAuthAPI.logout();
    setUser(null);
  };

  const checkUsername = async (username: string): Promise<boolean> => {
    try {
      const response = await demoAuthAPI.checkUsername(username);
      return response.available;
    } catch (error) {
      console.error('Username check failed:', error);
      return false;
    }
  };

  const getUsernameSuggestions = async (baseUsername: string): Promise<string[]> => {
    try {
      const response = await demoAuthAPI.getUsernameSuggestions(baseUsername);
      return response.suggestions;
    } catch (error) {
      console.error('Username suggestions failed:', error);
      return [];
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkUsername,
    getUsernameSuggestions,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
