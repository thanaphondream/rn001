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
import useAuth from './router/Apps';

const Stack = createNativeStackNavigator();
const Apps = () => {
  const { me, loading } = useAuth();

  // if (loading) {
  //   // You might want to show a loading screen while fetching the user data
  //   return <LoadingScreen />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={me ? "bootom" : "Login"}>
        {/* Routes for authenticated users */}
        {me ? (
          <>
            <Stack.Screen name="bootom" component={BottomTabNavigator} options={{ headerShown: false }} />
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
            <Stack.Screen name="Booking" component={Booking} 
              options={{
                title: 'สรุปข้อมูลการจอง',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16, color: '#000000' },
              }} 
            />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="Editprofile" component={Editprofile}  
              options={{
                title: 'แก้ไขโปรไฟล์',
                headerTitleAlign: 'center',
                headerTitleStyle: { fontSize: 16, color: '#000000' },
              }} 
            />
            {/* Admin-specific routes */}
            {me.role === 'ADMIN' && (
              <>
                <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                <Stack.Screen name="AdminOrders" component={AdminOrders} />
              </>
            )}
            {/* User-specific routes */}
            {me.role === 'USER' && (
              <>
                <Stack.Screen name="UserOrders" component={UserOrders} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
              </>
            )}
          </>
        ) : (
          // Routes for unauthenticated users
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Apps;