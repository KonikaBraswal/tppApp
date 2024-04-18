import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import HomeScreen from '../screens/HomeScreen';
import Dummy from '../screens/Dummy';
import Landing from '../screens/Landing';
import ProductListing from './EcommComponents/ProductListing';

const Tab = createMaterialBottomTabNavigator();
const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#36013f"
      labelStyle={{fontSize: RFValue(12)}}
      style={{backgroundColor: 'tomato'}}>
      <Tab.Screen
        name="Home"
        component={Landing}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProductListing}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default BottomTab;
