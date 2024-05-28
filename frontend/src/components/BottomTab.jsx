import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
// import Landing from '../screens/Landing';
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

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ccc', paddingBottom: 10 }}>
        <TouchableOpacity
          initialRouteName="Home"
          activeColor="#36013f"
          labelStyle={{ fontSize: RFValue(12) }}
          // style={{ backgroundColor: 'tomato' }}
          onPress={() => {
            navigation.navigate('ONEBank');
          }}>
          <MaterialCommunityIcons name="home" color='black' size={35} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Online Store');
          }}>
          <MaterialCommunityIcons name="cart" color='black' size={35} />
        </TouchableOpacity>
      </View>
    </>
  );
};
export default BottomTab;
