
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

// Mock user for development (moved from App.tsx)
const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@videoflow.com',
  role: 'admin' as UserRole,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

// Mock user mapping for demo accounts
const mockUsers = {
  "admin@videoflow.com": {
    ...mockUser,
  },
  "client@company.com": {
    id: '2',
    name: 'Client User',
    email: 'client@company.com',
    role: 'client' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  "freelancer@creator.com": {
    id: '3',
    name: 'Freelancer User',
    email: 'freelancer@creator.com',
    role: 'freelancer' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
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

// Storage key for persisting user data
const USER_STORAGE_KEY = 'videoflow_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);
  
  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Mock login - always successful");
      // For development purposes, simulate a network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the correct user based on email
      const userToLogin = mockUsers[email as keyof typeof mockUsers] || mockUser;
      setCurrentUser(userToLogin);
      return Promise.resolve();
    } finally {
      setIsLoading(false);
    }
  };

  // Updated logout function
  const logout = () => {
    console.log("Logging out user");
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  // Role switcher function
  const switchRole = (role: UserRole) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        role
      };
      setCurrentUser(updatedUser);
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
