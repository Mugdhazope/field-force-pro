import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Company, UserRole } from '@/types';
import { mockUsers, demoCompany } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  company: Company;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isMR: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pharma_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    const foundUser = mockUsers.find(
      u => u.username === username && u.role === role && u.isActive
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('pharma_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pharma_user');
  }, []);

  const value: AuthContextType = {
    user,
    company: demoCompany,
    isAuthenticated: !!user,
    login,
    logout,
    isAdmin: user?.role === 'admin' || user?.role === 'manager',
    isMR: user?.role === 'mr',
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
