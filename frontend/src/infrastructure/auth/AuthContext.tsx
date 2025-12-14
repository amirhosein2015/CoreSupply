import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

  // [New] بازگردانی وضعیت کاربر هنگام رفرش صفحه
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ username, token, roles: ['User'] });
    }
  }, []);

  const login = (username: string, token: string) => {
    // 1. ذخیره در حافظه مرورگر
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    
    // 2. آپدیت وضعیت React
    setUser({ username, token, roles: ['User'] });
  };

  const logout = () => {
    // 1. پاکسازی حافظه
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // 2. آپدیت وضعیت
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// هوک اختصاصی
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
