import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Company, UserRole } from '@/types';
import { mockUsers, demoCompany } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  company: Company;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isMR: boolean;
  validateSession: () => boolean;
  updateUserStatus: (userId: string, isActive: boolean, reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database (in production, this would be server-side)
let userDatabase: User[] = [...mockUsers];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pharma_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Validate session on mount and periodically
  const validateSession = useCallback((): boolean => {
    if (!user) return false;
    
    // Check if user is still active in the database
    const currentUser = userDatabase.find(u => u.id === user.id);
    
    if (!currentUser || !currentUser.isActive) {
      // Force logout if user is deactivated
      setUser(null);
      localStorage.removeItem('pharma_user');
      localStorage.removeItem('pharma_session_token');
      return false;
    }
    
    return true;
  }, [user]);

  // Check session validity periodically
  useEffect(() => {
    if (!user) return;

    // Validate immediately
    validateSession();

    // Validate every 30 seconds
    const interval = setInterval(() => {
      validateSession();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, validateSession]);

  // Update last active time
  useEffect(() => {
    if (!user) return;

    const updateLastActive = () => {
      const userIndex = userDatabase.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        userDatabase[userIndex] = {
          ...userDatabase[userIndex],
          lastActiveAt: new Date().toISOString(),
        };
      }
    };

    updateLastActive();
    const interval = setInterval(updateLastActive, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (username: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    // Find user in database
    const foundUser = userDatabase.find(
      u => u.username === username && u.role === role
    );

    if (!foundUser) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check if user is active
    if (!foundUser.isActive) {
      const reason = foundUser.deactivationReason || 'Your account has been deactivated.';
      return { 
        success: false, 
        error: `Access Revoked: ${reason}. Contact your administrator.` 
      };
    }

    // Update last active time
    const userIndex = userDatabase.findIndex(u => u.id === foundUser.id);
    if (userIndex !== -1) {
      userDatabase[userIndex] = {
        ...userDatabase[userIndex],
        lastActiveAt: new Date().toISOString(),
      };
    }

    // Create session
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('pharma_session_token', sessionToken);
    localStorage.setItem('pharma_user', JSON.stringify(foundUser));
    
    setUser(foundUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pharma_user');
    localStorage.removeItem('pharma_session_token');
  }, []);

  // Admin function to update user status
  const updateUserStatus = useCallback((userId: string, isActive: boolean, reason?: string) => {
    const userIndex = userDatabase.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      userDatabase[userIndex] = {
        ...userDatabase[userIndex],
        isActive,
        deactivatedAt: isActive ? undefined : new Date().toISOString(),
        deactivatedBy: isActive ? undefined : user?.id,
        deactivationReason: isActive ? undefined : reason,
      };

      // If deactivating, force logout that user if they're currently logged in
      if (!isActive) {
        // In a real app, this would invalidate the server session
        // For demo, we check in validateSession
      }
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    company: demoCompany,
    isAuthenticated: !!user,
    login,
    logout,
    isAdmin: user?.role === 'admin' || user?.role === 'manager',
    isMR: user?.role === 'mr',
    validateSession,
    updateUserStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export for admin pages to access user list
export const getUserDatabase = () => [...userDatabase];
export const updateUserDatabase = (users: User[]) => {
  userDatabase = users;
};
