
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userData = { email: user.email, name: user.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({ title: "Success", description: "Logged in successfully" });
      navigate('/');
    } else {
      toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    }
  };

  const signup = (email: string, name: string, password: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.some((u: any) => u.email === email)) {
      toast({ title: "Error", description: "Email already exists", variant: "destructive" });
      return;
    }

    const newUser = { email, name, password };
    localStorage.setItem('users', JSON.stringify([...storedUsers, newUser]));
    
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast({ title: "Success", description: "Account created successfully" });
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({ title: "Success", description: "Logged out successfully" });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
