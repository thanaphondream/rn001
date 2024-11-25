import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../router/Apps';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setMe } = useAuth()

  const handleLogin = async (loginEmail = email, loginPassword = password) => {
    try {
      const response = await axios.post(
        'https://type001-qnan.vercel.app/api/loing',
        {
          email: loginEmail,
          password: loginPassword,
        }
      );
  
      await AsyncStorage.setItem('token', response.data.token);
      setMe(response.data); 
      navigation.replace('/'); 
    } catch (error) {
      if (error.response) {
        console.error('Login error:', error.response.data);
        setError(`Login error: ${error.response.data.detail || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Login error: No response from server');
        setError('Login error: No response from server');
      } else {
        console.error('Login error:', error.message);
        setError(`Login error: ${error.message}`);
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await AsyncStorage.clear();
    setIsRefreshing(false); 
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.Viwe01}>
        <Text style={styles.Text01}>ยินดีต้อบรับ</Text>
        <Text style={styles.Text02}>เข้าสู้ระบบ</Text>
      </View>
      <View style={styles.Viwe02}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="  อีเมล"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="  รหัสผ่าน"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
          <Text style={styles.loginButtonText}>เข้าสู้ระบบ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.View04}>
        <Text>หรือ</Text>
      </View>
      <View style={styles.Viwe03}>
        <Text>ยังไม่มีบัญชีผู้ใช้งาน?</Text>
        <Text onPress={handleRegister} style={{ color: '#003170' }}>ลงทะเบียน</Text>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  Viwe01: {
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 10
  },
  Viwe02: {
    margin: 15
  },
  Viwe03: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30
  },
  View04:{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  Text01: {
    fontSize: 20,
    left: '2%',
  },
  Text02: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 15,
    padding: 10
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#FFB703',
    padding: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;

