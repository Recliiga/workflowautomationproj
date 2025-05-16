
import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '@/types';

// Mock user for development (moved from App.tsx)
const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@videoflow.com',
  role: 'admin' as UserRole,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Changed: Initialize with null instead of mockUser
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Added a loading state for authentication checks
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Mock login - always successful");
      // For development purposes, simulate a network request
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentUser(mockUser);
      return Promise.resolve();
    } finally {
      setIsLoading(false);
    }
  };

  // Updated logout function
  const logout = () => {
    console.log("Logging out user");
    setCurrentUser(null);
    // Note: The redirection now happens via the AppSidebar's navigate call
  };

  // Role switcher function
  const switchRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role
      });
      console.log(`Switched to ${role} role`);
    }
  };

  // Auth context value
  const value = {
    user: currentUser,
    isLoading,
    login,
    logout,
    setCurrentUser,
    switchRole,
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
