// CartScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useCart } from './CartContext';

const CartScreen = () => {
  const { cartItems, checkout  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
    } else {
      checkout();
      alert('Checkout successful!');
    }
  };

  return (
    <View>
      <Text>Cart Screen</Text>
      {cartItems.map((item, index) => (
        // <Text key={index}>{item.name} - ${item.price} - {item.quantity}</Text>
        <Text key={index}>{item.firstName} - ${item.lastName}- {item.sortCode} - {item.accountNumber} - {item.accountNumber} - {item.accountNumber} - {item.reference} - {item.amount} - {item.quantity}</Text>
      ))}
      <Button title="Checkout" onPress={handleCheckout} />
    </View>
  );
};

export default CartScreen;