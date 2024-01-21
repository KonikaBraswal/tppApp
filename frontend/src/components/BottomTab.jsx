import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountListScreen from '../screens/AccountListScreen';
import TransactionListScreen from '../screens/TransactionListScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createMaterialBottomTabNavigator();
const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#36013f"
      labelStyle={{fontSize: 12}}
      style={{backgroundColor: 'tomato'}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountListScreen}
        options={{
          tabBarLabel: 'Accounts',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-cash"
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionListScreen}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="bank-transfer"
              color={color}
              size={35}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default BottomTab;
