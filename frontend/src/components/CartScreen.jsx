// CartScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useCart } from './CartContext';

const CartScreen = () => {
  const { cartItems, checkout, addToCart  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
    } else {
      checkout();
      alert('Checkout successful!');
    }
  };
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <View>
      <Text>Cart Screen</Text>
      {cartItems.map((item, index) => (
        // <Text key={index}>{item.name} - ${item.price} - {item.quantity}</Text>
        <Text key={index}>{item.firstName} - ${item.lastName}- {item.sortCode} - {item.accountNumber} - {item.accountNumber} - {item.accountNumber} - {item.reference} - {item.amount} - {item.quantity}</Text>
      ))}
      {/* <Button title="Checkout" onPress={handleCheckout} /> */}

      <Button title="Add to Cart" onPress={() => handleAddToCart({ id: 1, firstName: 'Rafal', lastName: 'Nadal', sortCode: 12345678, accountNumber: 'BE56456394728288',reference: 'Tools', amount: 100.00, quantity: 1})} />
      <Button title="Checkout for payment" onPress={handleCheckout} />
    </View>
  );
};

export default CartScreen;