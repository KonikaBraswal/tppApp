import React from 'react'
import {View, StyleSheet, Text, Image, KeyboardAvoidingView, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductsScreen from './ProductsScreen';


import bank from '../assets/icons/bank.png';



export const NatwestMart = () => {
  const navigation = useNavigation();
  const goToNextScreen = () => {
    navigation.navigate('Product');
  };
  return (
    <>
      <Image source={bank} style={NatwestMartStyle.image} />
      <Text style={NatwestMartStyle.heading}>Natwest Mart</Text>
      <Text>Welcome to Natwest Mart, your ultimate shopping destination! Browse a wide range of product from electronics to fashion, and enjoy seamless transactions with secure checkout. With exclusive deals and a user-friendly interface, shopping has never been easier.</Text>
      <Button title='Go to product list page' onPress={goToNextScreen}></Button>
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
  });
export default NatwestMart