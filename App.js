import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import BottomTabNavigator from './screens/BottomTabNavigator';
import StallArea from './screens/StallArea';
import LockScreen from './screens/LockScreen';
import Booking from './screens/Booking';
import Payment from './screens/Payment';
import Editprofile from './screens/Editprofile';
import useAuth from './router/Apps';

const Stack = createNativeStackNavigator();

const rou = (
  <>
    <Stack.Screen
      name="Bottom" 
      component={BottomTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Area" component={StallArea} />
    <Stack.Screen
      name="Lock"
      component={LockScreen}
      options={({ route }) => ({
        title: route.params?.market_name || 'Lock',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 16, color: '#000000' },
      })}
    />
    <Stack.Screen
      name="Booking"
      component={Booking}
      options={{
        title: 'สรุปข้อมูลการจอง',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 16, color: '#000000' },
      }}
    />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen
      name="Editprofile"
      component={Editprofile}
      options={{
        title: 'แก้ไขโปรไฟล์',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 16, color: '#000000' },
      }}
    />
  </>
);

const login = (
  <Stack.Screen
    name="Login"
    component={LoginScreen}
    options={{ headerShown: false }}
  />
);

const Apps = () => {
  const { me, loading } = useAuth();
  if (loading) {
    return <></>;  
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={me ? 'Bottom' : 'Login'}>
        {me ? rou : login}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Apps;
