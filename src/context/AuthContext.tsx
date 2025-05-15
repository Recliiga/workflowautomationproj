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

// Session timeout duration in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// How often to check/refresh the session (every minute)
const REFRESH_INTERVAL = 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Load user from localStorage on initial mount
  useEffect(() => {
    // Check for saved user in localStorage with improved error handling
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsedData = JSON.parse(savedUser);
        
        // Check that the parsed user has the expected structure
        if (parsedData && parsedData.user && parsedData.user.id && parsedData.user.email && parsedData.user.role) {
          setUser(parsedData.user);
          
          // Check if the session has expired
          const timestamp = parsedData.timestamp || 0;
          const now = Date.now();
          
          if (now - timestamp < SESSION_TIMEOUT) {
            // Session is still valid
            setLastActivity(timestamp);
          } else {
            // Session has expired
            console.log("Session expired, clearing user data");
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
          }
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

  // Set up activity tracking
  useEffect(() => {
    if (!user) return;

    // Update session timestamp on user activity events
    const updateTimestamp = () => {
      setLastActivity(Date.now());
    };

    // Track user activity
    window.addEventListener('click', updateTimestamp);
    window.addEventListener('keypress', updateTimestamp);
    window.addEventListener('scroll', updateTimestamp);
    window.addEventListener('mousemove', updateTimestamp);

    return () => {
      window.removeEventListener('click', updateTimestamp);
      window.removeEventListener('keypress', updateTimestamp);
      window.removeEventListener('scroll', updateTimestamp);
      window.removeEventListener('mousemove', updateTimestamp);
    };
  }, [user]);

  // Keep session active and persisted based on user activity
  useEffect(() => {
    if (!user) return;

    // Update localStorage with the latest timestamp whenever lastActivity changes
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user,
      timestamp: lastActivity,
    }));

    // Set up a regular check/refresh interval
    const intervalId = setInterval(() => {
      try {
        // Get the current session data
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (!savedUser) {
          // No session data found, user has been logged out elsewhere
          setUser(null);
          return;
        }

        const parsedData = JSON.parse(savedUser);
        const timestamp = parsedData.timestamp || 0;
        const now = Date.now();

        if (now - timestamp < SESSION_TIMEOUT) {
          // Session is still valid, keep it fresh by updating the timestamp
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            user,
            timestamp: lastActivity,
          }));
        } else {
          // Session has expired
          console.log("Session timed out");
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [user, lastActivity]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find mock user by email (for demo)
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (!foundUser) throw new Error('Invalid credentials');
      
      // Add timestamp and store user in state and localStorage
      const now = Date.now();
      setLastActivity(now);
      setUser(foundUser);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user: foundUser,
        timestamp: now
      }));
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
    const now = Date.now();
    setLastActivity(now);
    setUser(newUser);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: newUser,
      timestamp: now
    }));
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
