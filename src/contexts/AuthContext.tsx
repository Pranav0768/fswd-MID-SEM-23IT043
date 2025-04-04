
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Define the structure of our user object
interface User {
  id: string;
  email: string;
  name: string;
}

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Check for token in localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('qr_auth_token');
    if (storedToken) {
      try {
        // Verify and decode the token
        const decoded = jwtDecode<User & { exp: number }>(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          setToken(storedToken);
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
          });
          
          // Set up axios authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          // Token expired
          localStorage.removeItem('qr_auth_token');
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('qr_auth_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll fake a successful login
      // In a real app, this would be an API call
      // const response = await axios.post('/api/auth/login', { email, password });
      
      // Mock response data
      const mockResponse = {
        token: 'mock_jwt_token_123',
        user: {
          id: '1',
          email,
          name: email.split('@')[0]
        }
      };
      
      const { token: newToken, user: userData } = mockResponse;
      
      // Save token to localStorage
      localStorage.setItem('qr_auth_token', newToken);
      
      // Set up axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll fake a successful registration
      // In a real app, this would be an API call
      // const response = await axios.post('/api/auth/register', { name, email, password });
      
      // Mock response data
      const mockResponse = {
        token: 'mock_jwt_token_123',
        user: {
          id: '1',
          email,
          name
        }
      };
      
      const { token: newToken, user: userData } = mockResponse;
      
      // Save token to localStorage
      localStorage.setItem('qr_auth_token', newToken);
      
      // Set up axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not create account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('qr_auth_token');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setToken(null);
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
