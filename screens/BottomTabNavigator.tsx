import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import ProfileScreen from './profile';
import StallArea from './StallArea';

const Tab = createBottomTabNavigator();

const AppTabs = ({ route }) => {
  const user = route.params;
  console.log("AppTabs userId:", user);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
        },
      }}
    >   
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={user}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),title: '',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16, 
            color: '#000000',
          },
        }}
      />
       <Tab.Screen
        name="StallArea"
        component={StallArea}
        initialParams={user}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'storefront' : 'storefront-outline'} size={size} color={color} />
          ),
          title: 'บริการ',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16, 
            color: '#000000',
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={user}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
          title: '',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16, 
            color: '#000000',
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;
