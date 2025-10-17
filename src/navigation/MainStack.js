import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import Cash_Tickets from "../screens/Cash_Tickets";

import Icon   from 'react-native-vector-icons/FontAwesome';


import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { Text } from 'react-native-paper';
import {View } from "react-native";
const Tab = createBottomTabNavigator();


export default function MainStack() {


    return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
    
            //   if (route.name === 'Home') iconName = 'home-outline';
            //   else if (route.name === 'Profile') iconName = 'person-outline';

            
              return  <Icon name="dashboard" size={size} color="#4F8EF7" />
            },
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Profile" component={Profile} />
       
        </Tab.Navigator>
      );

}