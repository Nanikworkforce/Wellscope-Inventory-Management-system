import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL, AUTH_BASE_URL } from '../../config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  getToken: () => string | null;
  user: any;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  getToken: () => null,
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if token is valid
  const isTokenValid = (token: string) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp && decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  // Set up axios interceptor for authentication
  useEffect(() => {
    // Configure axios defaults
    axios.defaults.baseURL = API_BASE_URL;
    
    // Add a request interceptor to include the token in all requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              console.log('Attempting to refresh token');
              
              // Use the correct refresh token endpoint
              const response = await axios.post(`${AUTH_BASE_URL}/token/refresh/`, 
                { refresh: refreshToken },
                {
                  baseURL: AUTH_BASE_URL, // Override the baseURL for this request
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  }
                }
              );
              
              const newAccessToken = response.data.access;
              
              // Store the new token
              localStorage.setItem('accessToken', newAccessToken);
              
              // Update the authorization header
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              
              console.log('Token refreshed successfully');
              
              // Retry the original request
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // If refresh fails, log the user out
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Check if user is authenticated on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        if (isTokenValid(token)) {
          console.log('Valid token found, setting authenticated state');
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Try to fetch user data
          try {
            const userData = jwtDecode(token);
            setUser(userData);
          } catch (error) {
            console.error('Failed to decode user data from token:', error);
          }
        } else {
          console.log('Token expired, attempting to refresh');
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              // Use the correct refresh token endpoint
              const response = await axios.post(`${AUTH_BASE_URL}/token/refresh/`, 
                { refresh: refreshToken },
                {
                  baseURL: AUTH_BASE_URL, // Override the baseURL for this request
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  }
                }
              );
              
              const newAccessToken = response.data.access;
              
              localStorage.setItem('accessToken', newAccessToken);
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              setIsAuthenticated(true);
              
              // Try to fetch user data
              try {
                const userData = jwtDecode(newAccessToken);
                setUser(userData);
              } catch (error) {
                console.error('Failed to decode user data from refreshed token:', error);
              }
            } catch (error) {
              console.error('Failed to refresh token:', error);
              logout();
            }
          } else {
            console.log('No refresh token found, logging out');
            logout();
          }
        }
      } else {
        console.log('No token found, not authenticated');
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
      }
      
      setIsInitialized(true);
    };
    
    checkAuth();

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    
    // Try to fetch user data
    try {
      const userData = jwtDecode(token);
      setUser(userData);
    } catch (error) {
      console.error('Failed to decode user data from token:', error);
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    
    // Force redirect to login page
    console.log('Redirecting to login page after logout');
    window.location.href = '/login';
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}; 