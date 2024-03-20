// ProductsScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';

const ProductsScreen = () => {
  const { addToCart, cartItems } = useCart();

  const navigation = useNavigation();
  const goToNextScreen = () => {
    navigation.navigate('Cart');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <View>
      <Text>Products Screen</Text>
      {cartItems.map((item, index) => (
        <Text key={index}>{item.firstName} - ${item.lastName}- {item.sortCode} - {item.accountNumber} - {item.accountNumber} - {item.accountNumber} - {item.reference} - {item.amount} - {item.quantity}</Text>
      ))}
      {/* <Button title="Add to Cart" onPress={() => handleAddToCart({ id: 1, name: 'Product 1', price: 10, quantity: 1 })} /> */}
      <Button title="Add to Cart" onPress={() => handleAddToCart({ id: 1, firstName: 'Rafal', lastName: 'Nadal', sortCode: 12345678, accountNumber: 'BE56456394728288',reference: 'Tools', amount: 100.00, quantity: 1})} />
      <Button title="Checkout for payment" onPress={goToNextScreen} />
    </View>
  );
};

export default ProductsScreen;