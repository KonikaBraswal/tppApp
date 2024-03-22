// CartScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useCart } from './CartContext';

const { width: screenWidth } = Dimensions.get('window');
// Calculate the width for each child (assuming equal width for both children)
const childWidth = (screenWidth) / 2; // Subtracting padding and margins

const CartScreen = ({route}) => {
  // console.log();
  const title = route.params.item.title;
  // const permissions = route.params.permissions;
  // const {AccountId} = route.params.accountDetails;


  const { checkout, addToCart  } = useCart();
  // const { cartItems, checkout, addToCart  } = useCart();

  const handleCheckout = () => {
    if (route.params.item.length === 0) {
      alert('Your cart is empty!');
    } else {
      checkout();
      alert('Checkout successful!');
    }
  };
  const handleAddToCart = () => {
    addToCart(route.params.item);
  };

  return (
    <View>
      {/* <Text>Cart Screen</Text> */}
      {/* {cartItems.map((item, index) => (
        // <Text key={index}>{item.name} - ${item.price} - {item.quantity}</Text>
        <Text key={index}>{item.firstName} - ${item.lastName}- {item.sortCode} - {item.accountNumber} - {item.accountNumber} - {item.accountNumber} - {item.reference} - {item.amount} - {item.quantity}</Text>
      ))} */}
      {/* <Button title="Checkout" onPress={handleCheckout} /> */}
      <Text style={styles.text}>{title}</Text>
      {console.log(<Text style={styles.text}>{route.params.item.title}</Text>)}
      {/* <TouchableOpacity style={[styles.itemContainer, { width: screenWidth }]}> */}
          {/* <View key={route.params.index} style={[styles.child, { width: childWidth }]}> */}
            {/* <Image source={item.image} style={styles.image} /> */}
            {/* <Image source={route.params.item.path ? route.params.item.path : require('../assets/images/VRP.png')} style={styles.image} /> */}
            {/* <Text style={styles.text}>{route.params.item.title}</Text>
            <Text style={styles.normal_text}>{route.params.item.description}</Text>
            <Text style={styles.normal_text}>{route.params.item.price}</Text> */}
            {/* <Text style={styles.normal_text}>{StarRating(route.params.item.rating)}</Text> */}


          {/* </View>
        </TouchableOpacity> */}
      <Button title="Add to Cart" onPress={()=>handleAddToCart()} />
      <Button title="Checkout for payment" onPress={handleCheckout} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5a287d',
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'center',
    // borderRadius: 10
  },
  text: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  normal_text: {
    flex: 1,
    fontSize: 16
  },
  child: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: 'white', // Example background color
    marginBottom: 10, // Adjust spacing between children
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flex: 1
  },
  image: {
    flex: 1,
    // width: 200,

    // height: 200,

    resizeMode: 'contain',

    // flexWrap:"wrap"
  },
});

export default CartScreen;