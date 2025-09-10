import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedUser && storedAccessToken) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user && accessToken) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
  }, [user, accessToken, refreshToken]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic
      const mockUsers = [
        { 
          id: 1,
          name: 'John Student',
          email: 'student@example.com', 
          password: 'password123', 
          role: 'student',
          registrationNumber: 'REG001'
        },
        { 
          id: 2,
          name: 'Dr. Smith',
          email: 'faculty@example.com', 
          password: 'password123', 
          role: 'faculty',
          department: 'Computer Science'
        },
      ];

      const foundUser = mockUsers.find(u => 
        u.email === email && u.password === password
      );

      if (foundUser) {
        // Generate mock JWT tokens
        const mockAccessToken = `access_${foundUser.id}_${Date.now()}`;
        const mockRefreshToken = `refresh_${foundUser.id}_${Date.now()}`;

        // Remove password from user object
        const { password, ...userWithoutPassword } = foundUser;

        setUser(userWithoutPassword);
        setAccessToken(mockAccessToken);
        setRefreshToken(mockRefreshToken);

        // Return user data for navigation handling in components
        return { success: true, user: userWithoutPassword };
      } else {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!userData.name || !userData.email || !userData.password || !userData.role) {
        throw new Error('All required fields must be filled');
      }

      if (!userData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (userData.role === 'student' && !userData.registrationNumber) {
        throw new Error('Registration number is required for students');
      }

      // Check for duplicate email (simulate API check)
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (existingUsers.some(user => user.email === userData.email)) {
        throw new Error('An account with this email already exists');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock registration logic
      const newUser = {
        id: Date.now(), // Simple ID generation
        name: userData.name,
        email: userData.email,
        role: userData.role,
        ...(userData.role === 'student' && { registrationNumber: userData.registrationNumber }),
        ...(userData.role === 'faculty' && { department: 'Computer Science' }),
      };

      // Store user in localStorage for duplicate checking
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Generate mock JWT tokens
      const mockAccessToken = `access_${newUser.id}_${Date.now()}`;
      const mockRefreshToken = `refresh_${newUser.id}_${Date.now()}`;

      setUser(newUser);
      setAccessToken(mockAccessToken);
      setRefreshToken(mockRefreshToken);

      // Return user data for navigation handling in components
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Navigation will be handled by the component calling logout
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Simulate API call to refresh token
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate new access token
      const newAccessToken = `access_${user.id}_${Date.now()}`;
      setAccessToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!(user && accessToken);
  };

  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    login,
    register,
    logout,
    refreshAccessToken,
    isAuthenticated,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
