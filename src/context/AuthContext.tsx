
import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '@/types';
import { mockUser } from '../App';

interface AuthContextType {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fix: Define AuthProvider as a proper React functional component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a state to manage the current user with role switching
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  
  // Mock login function
  const login = async (email: string, password: string) => {
    console.log("Mock login - always successful");
    return Promise.resolve();
  };

  // Mock logout function
  const logout = () => {
    console.log("Mock logout - does nothing");
  };

  // Role switcher function
  const switchRole = (role: UserRole) => {
    setCurrentUser({
      ...currentUser,
      role
    });
    console.log(`Switched to ${role} role`);
  };

  // Auth context value
  const value = {
    user: currentUser,
    isLoading: false,
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
