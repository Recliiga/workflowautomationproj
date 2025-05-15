
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

// How often to check/refresh the session (every 5 minutes)
const REFRESH_INTERVAL = 5 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      console.log("Loading user from storage");
      setIsLoading(true);
      
      try {
        const savedUserData = localStorage.getItem(STORAGE_KEY);
        
        if (!savedUserData) {
          console.log("No saved user data found");
          setIsLoading(false);
          return;
        }
        
        const parsedData = JSON.parse(savedUserData);
        
        if (!parsedData || !parsedData.user || !parsedData.user.id) {
          console.log("Invalid user data format");
          localStorage.removeItem(STORAGE_KEY);
          setIsLoading(false);
          return;
        }
        
        const { user, timestamp } = parsedData;
        const now = Date.now();
        
        // Always set the user first - this prevents race conditions
        setUser(user);
        setLastActivity(timestamp || now);
        
        // Then check expiration separately - don't remove valid user during initial load
        if (now - timestamp > SESSION_TIMEOUT) {
          console.log("Session loaded but expired, will be cleared on next check");
        } else {
          console.log("Valid user session loaded, expiry in:", Math.round((SESSION_TIMEOUT - (now - timestamp)) / 60000), "minutes");
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load user immediately
    loadUserFromStorage();
  }, []);

  // Set up activity tracking - but only AFTER user is confirmed loaded
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up activity tracking for user:", user.name);
    
    // Update localStorage immediately when user is set
    const updateStorageWithCurrentTimestamp = () => {
      const now = Date.now();
      setLastActivity(now);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user,
        timestamp: now,
      }));
      
      console.log("Updated session timestamp:", new Date(now).toLocaleTimeString());
    };
    
    // Initial storage update when component mounts
    updateStorageWithCurrentTimestamp();

    // Track user activity events
    const activityEvents = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];
    
    // Throttled event handler (only update timestamp max once per 30 seconds)
    let lastUpdateTime = Date.now();
    const THROTTLE_DELAY = 30000; // 30 seconds
    
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastUpdateTime > THROTTLE_DELAY) {
        updateStorageWithCurrentTimestamp();
        lastUpdateTime = now;
      }
    };

    // Add all event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Clear on unmount
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user]);

  // Separate effect for session refresh interval - don't mix with activity tracking
  useEffect(() => {
    if (!user) return;
    
    // Set up a refresh interval that's independent of user activity
    // This ensures the session stays valid even if the user is just reading
    const intervalId = setInterval(() => {
      const savedUserData = localStorage.getItem(STORAGE_KEY);
      
      if (!savedUserData) {
        // Storage was cleared externally
        console.log("Session data missing during interval check");
        setUser(null);
        return;
      }
      
      try {
        const parsedData = JSON.parse(savedUserData);
        const timestamp = parsedData?.timestamp || 0;
        const now = Date.now();
        
        if (now - timestamp < SESSION_TIMEOUT) {
          // Still valid, refresh the timestamp
          console.log("Session refresh, extending expiry");
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            user,
            timestamp: now,
          }));
          setLastActivity(now);
        } else {
          // Session expired due to inactivity
          console.log("Session expired during interval check");
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        }
      } catch (error) {
        console.error('Error during session refresh:', error);
      }
    }, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find mock user by email (for demo)
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (!foundUser) throw new Error('Invalid credentials');
      
      const now = Date.now();
      
      // Save user data to storage with current timestamp
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user: foundUser,
        timestamp: now
      }));
      
      // Update state AFTER storage is set
      setLastActivity(now);
      setUser(foundUser);
      
      console.log("User logged in successfully:", foundUser.name);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("User logged out");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const setCurrentUser = (newUser: User) => {
    const now = Date.now();
    
    // Update storage first
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: newUser,
      timestamp: now
    }));
    
    // Then update state
    setLastActivity(now);
    setUser(newUser);
    
    console.log("User profile updated:", newUser.name);
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
