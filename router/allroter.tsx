import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create a Context for authentication
const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext); // Returns current context value (user, loading, logout)
};

// Provider component for AuthContext
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To store errors

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null); // Reset error state on new fetch attempt

      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('https://type001-qnan.vercel.app/api/me', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          if (response.data) {
            setUser(response.data);
          } else {
            setUser(null); // Handle case where no user data is returned
          }
        } else {
          setUser(null); // No token found, user is not logged in
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error.message);
        setError('Failed to load user data. Please try again later.'); // Display error to the user
        setUser(null); // Reset user data
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null); // Clear user data on logout
    } catch (error) {
      console.error('Failed to log out:', error.message);
      setError('Logout failed. Please try again.');
    }
  };

  const value = useMemo(() => ({ user, loading, error, logout }), [user, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
