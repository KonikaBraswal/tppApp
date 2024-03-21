import React from 'react'
import {View, StyleSheet, Text, Image, TouchableOpacity, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductsScreen from './ProductsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Ecommerce_home_page_image from '../assets/images/NatwestMart.png';
// import bank from '/Users/navdeepsingh/Downloads/tppApp-Ecommerce/frontend/src/assets/images/NatwestMart.png';



export const NatwestMart = () => {
  const navigation = useNavigation();
  const goToNextScreen = () => {
    navigation.navigate('Product');
  };
  return (
    <>
      <Image source={Ecommerce_home_page_image} style={NatwestMartStyle.image} />
      <Text style={NatwestMartStyle.heading}>Natwest Mart</Text>
      <Text style={NatwestMartStyle.normal_text}>
        <Text>Welcome to Natwest Mart, your ultimate</Text>
        <Text>shopping destination! Browse a wide range of</Text>
        <Text>product from electronics to fashion, and enjoy</Text>
        <Text>seamless transactions with secure checkout.</Text>
        <Text>With exclusive deals and a user-friendly</Text>
        <Text>interface, shopping has never been easier.</Text>
      </Text>
      {/* <Button title="Let's Go" onPress={goToNextScreen}></Button> */}
      {/* <TouchableOpacity onPress={goToNextScreen} style={{ backgroundColor: '#5a287d',flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{fontSize: 36, marginRight: 32, color:"white"}}>Let's Go</Text>
        <Icon name="arrow-right" size={36}  style={{ color:"white" }} />
      </TouchableOpacity> */}

    <TouchableOpacity onPress={goToNextScreen} style={NatwestMartStyle.button}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={NatwestMartStyle.buttonText}>Let's Go</Text>
        <Icon name="arrow-right" size={32} color="white" />
      </View>
    </TouchableOpacity>
    </>
    
  )
}
const NatwestMartStyle = StyleSheet.create({
    row: {
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
  
      alignItems: 'flex-start',
  
      flexWrap: 'wrap',
    },
    heading: {
        textAlign: 'center',
        color: 'purple',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    normal_text: {
        textAlign: 'center',
        // color: '',
        fontSize: 18,
        // fontStyle:
        // fontWeight: 'bold',
        marginBottom: 10,
    },
  
    surface: {
      backgroundColor: 'white',
      width: 80,
  
      height:80,
  
      justifyContent: 'center',
  
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: 'white',
      margin: 10,
    },
  
    image: {
      width: 440,
  
      height: 440,
  
      resizeMode: 'cover',
  
      // flexWrap:"wrap"
    },
    button: {
      backgroundColor: '#5a287d',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      alignSelf: 'center', // Aligns the button to the center of its container
      flexDirection: 'row', // Allows the text and icon to be aligned horizontally
      alignItems: 'center', // Aligns items (text and icon) vertically within the button
      minWidth: 200, // Specifies the minimum width of the button
    },
    buttonText: {
      color: 'white',
      fontSize: 24,
      marginRight: 82, // Adds space between the text and the icon
    },
  });
export default NatwestMart