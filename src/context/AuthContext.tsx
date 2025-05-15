
import React, { createContext, useContext } from 'react';
import { User } from '@/types';
import { mockUser } from '../App';

interface AuthContextType {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always return the mock user - no authentication logic
  const login = async () => {
    console.log("Mock login - always successful");
    return Promise.resolve();
  };

  const logout = () => {
    console.log("Mock logout - does nothing");
  };

  const setCurrentUser = (user: User) => {
    console.log("Mock user update:", user.name);
  };

  // Always authenticated with mock user
  const value = {
    user: mockUser,
    isLoading: false,
    login,
    logout,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
