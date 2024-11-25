import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import BottomTabNavigator from './screens/BottomTabNavigator';
import StallArea from './screens/StallArea';
import LockScreen from './screens/LockScreen';
import Booking from './screens/Booking';
import Payment from './screens/Payment';
import Editprofile from './screens/Editprofile';
import useAuth from './router/Apps';

const Stack = createNativeStackNavigator();

const Apps = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User is authenticated:", user);
    }
  }, [user]);

  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>

          <>
            <Stack.Screen
              name="/"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="StallArea" component={StallArea} />
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

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Apps;
