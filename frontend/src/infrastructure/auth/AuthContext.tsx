import React, { createContext, useContext, useState, ReactNode } from 'react';

// مدل کاربر
interface User {
  username: string;
  token: string;
  roles: string[];
}

// نوع داده کانتکست
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, token: string) => {
    // فعلاً ساده ست می‌کنیم (بعداً لاجیک واقعی)
    setUser({ username, token, roles: ['Admin'] });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// هوک اختصاصی برای دسترسی راحت به Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
