import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Allroter = ({ navigation }) => {

  const handleLogin = async (email, password) => {
    console.log('Login with:', email, password);
    navigation.navigate('Login');
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userPassword = await AsyncStorage.getItem('userPassword');

        if (userEmail && userPassword) {
          handleLogin(userEmail, userPassword);
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Failed to fetch login status:', error);
        navigation.navigate('Login');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View>
      <Text>Checking login status...</Text>
    </View>
  );
};

export default Allroter;

