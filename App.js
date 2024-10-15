import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Allroter from './router/allroter';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import BottomTabNavigator from './screens/BottomTabNavigator';
import StallArea from './screens/StallArea';
import LockScreen from './screens/LockScreen';
import Booking from './screens/Booking';
import Payment from './screens/Payment';
import Editprofile from './screens/Editprofile';

const Stack = createNativeStackNavigator();

const Apps = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="bootom" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Allroter" component={Allroter} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Area" component={StallArea} />
        <Stack.Screen 
          name="Lock" 
          component={LockScreen}  
          options={({ route }) => ({
            title: route.params?.market_name || 'Lock',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 16,
              color: '#000000',
            },
          })}
        />
        <Stack.Screen name="Booking" component={Booking} options={({ route }) => ({
            title: 'สรุปข้อมูลการจอง',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 16,
              color: '#000000',
            },
          })}/>
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Editprofile" component={Editprofile}  options={({ route }) => ({
            title: 'แก้ไขโปรไฟล์',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 16,
              color: '#000000',
            },
          })}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Apps;
