import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'JUDGE' | 'ADMIN';
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT payload
const decodeToken = (token: string): Partial<User> | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      role: payload.role,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isAuthenticated = !!token && !!user;

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiResponse<{ token: string }>>('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.data?.token) {
        const { token: authToken } = response.data.data;
        const decodedUser = decodeToken(authToken);

        if (decodedUser) {
          const userData: User = {
            id: decodedUser.id!,
            email,
            role: decodedUser.role!,
          };

          setToken(authToken);
          setUser(userData);
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(userData));

          toast({
            title: "Login successful",
            description: "Welcome back!",
          });

          // Redirect based on role - Updated admin redirect
          switch (userData.role) {
            case 'ADMIN':
              navigate('/admin/dashboard');
              break;
            case 'JUDGE':
              navigate('/judge/dashboard');
              break;
            case 'STUDENT':
            default:
              navigate('/student/dashboard');
              break;
          }
        }
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);

      if (response.data.success && response.data.data?.token) {
        const { token: authToken, user: userInfo } = response.data.data;
        const decodedUser = decodeToken(authToken);

        if (decodedUser) {
          const fullUserData: User = {
            ...userInfo,
            role: decodedUser.role!,
          };

          setToken(authToken);
          setUser(fullUserData);
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(fullUserData));

          toast({
            title: "Registration successful",
            description: "Welcome to EduEvents Hub!",
          });

          // Redirect based on role - Updated admin redirect
          switch (fullUserData.role) {
            case 'ADMIN':
              navigate('/admin/dashboard');
              break;
            case 'JUDGE':
              navigate('/judge/dashboard');
              break;
            case 'STUDENT':
            default:
              navigate('/student/dashboard');
              break;
          }
        }
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
