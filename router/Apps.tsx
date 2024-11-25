import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuth = () => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);

      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          const response = await axios.get('https://type001-qnan.vercel.app/api/me', {
            headers: { Authorization: `Token ${token}` },
          });
          setMe(response.data);
        } else {
          setMe(null);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error.message || error);
        setMe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    if (me) {
      console.log('User data updated:', me);
    }
  }, [me]);

  const logout = async (navigation) => {
    try {
      await AsyncStorage.removeItem('token');
      setMe(null);
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Failed to log out:', error.message || error);
    }
  };

  return { user: me, loading, logout, setMe };
};

export default useAuth;
