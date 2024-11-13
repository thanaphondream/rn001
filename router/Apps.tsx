import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuth = () => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('https://type001-qnan.vercel.app/api/me', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          console.log(1111111,me)
          setMe(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  return { me, loading };
};

export default useAuth;
