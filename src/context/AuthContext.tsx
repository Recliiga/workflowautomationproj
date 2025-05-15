import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@videoflow.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Client User',
    email: 'client@company.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Freelancer User',
    email: 'freelancer@creator.com',
    role: 'freelancer',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// A more stable storage key
const STORAGE_KEY = 'videoflow_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage with improved error handling
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Verify that the parsed user has the expected structure
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error loading saved user:', error);
      // Clear potentially corrupted data
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up a session check/refresh interval
  useEffect(() => {
    // Ping the session every minute to keep it active
    const interval = setInterval(() => {
      if (user) {
        // Update the timestamp to keep the session fresh
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...user,
          _lastActive: new Date().toISOString()
        }));
      }
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find mock user by email (for demo)
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (!foundUser) throw new Error('Invalid credentials');
      
      // Add timestamp and store user in state and localStorage
      const userWithTimestamp = {
        ...foundUser,
        _lastActive: new Date().toISOString()
      };
      
      setUser(userWithTimestamp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithTimestamp));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const setCurrentUser = (newUser: User) => {
    const userWithTimestamp = {
      ...newUser,
      _lastActive: new Date().toISOString()
    };
    setUser(userWithTimestamp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithTimestamp));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setCurrentUser }}>
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
