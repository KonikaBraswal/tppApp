import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import Landing from '../screens/Landing';
import ProductListing from '../screens/EcommScreens/ProductListing';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();
const BottomTab = () => {
  const navigation = useNavigation();
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#36013f"
        labelStyle={{ fontSize: RFValue(12) }}
        style={{ backgroundColor: 'tomato' }}> 
         <Tab.Screen
          name="Home"
          component={Landing}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={28} />
            ),
          }}
        /> 
        <Tab.Screen
        name='Natwest Cart'
        component={ProductListing}
        options={{
          tabBarLabel: 'Cart',
          headerShown:false,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="cart" color={color} size={28} />
          ),
        }}/> 

 </Tab.Navigator>
        {/* <TouchableOpacity
        initialRouteName="Home"
        activeColor="#36013f"
        labelStyle={{ fontSize: RFValue(12) }}
        style={{ backgroundColor: 'tomato' }}
          onPress={() => {
            navigation.navigate('Landing');
          }}>
          <MaterialCommunityIcons name="home" color='black' size={50} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Natwest Cart');
          }}>
          <MaterialCommunityIcons name="cart" color='black' size={50} />
        </TouchableOpacity> */}

    </>
  );
};
export default BottomTab;
