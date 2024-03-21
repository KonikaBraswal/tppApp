// ProductsScreen.js
import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet, FlatList} from 'react-native';
// import Carousel from 'react-native-snap-carousel';
import { useCart } from './CartContext';
import { useNavigation } from '@react-navigation/native';
import ProductCarousel from './ProductCarousel';

const { width: screenWidth } = Dimensions.get('window');


const ProductsScreen = () => {

  // const { addToCart, cartItems } = useCart();
  const { cartItems } = useCart();

  // const navigation = useNavigation();
  // const goToNextScreen = () => {
  //   navigation.navigate('Cart');
  // };

  // const handleAddToCart = (product) => {
  //   addToCart(product);
  // };
{/* <View>
      <Text>Products Screen</Text> */}
      // const renderItem = ()=>{cartItems.map((item, index) => (
        // <Text key={index}>{item.name} - ${item.description}- {item.sortCode} - {item.accountNumber} - {item.accountNumber} - {item.accountNumber} - {item.reference} - {item.amount} - {item.quantity}</Text>

      // <View style={styles.itemContainer}>
      //   <Image source={item.image } style={styles.image} />
      //   <Text style={styles.title}>{item.title}</Text>
      //   <Text style={styles.price}>${item.price}</Text>
      // </View>
      // ))};

      
      {/* <Button title="Add to Cart" onPress={() => handleAddToCart({ id: 1, name: 'Product 1', price: 10, quantity: 1 })} /> */}
      
    // </View>
  return (
    // <Carousel
    //   data={cartItems}
    //   renderItem={renderItem}
    //   sliderWidth={screenWidth}
    //   itemWidth={screenWidth * 0.8} // Adjust this value to control the width of each carousel item
    //   layout="default"
    //   loop
    //   autoplay
    // />
    // cartItems.map((item, index) => (
      // <Text key={index}>{item.name} - ${item.description}- {item.sortCode} - {item.accountNumber} - {item.accountNumber} - {item.accountNumber} - {item.reference} - {item.amount} - {item.quantity}</Text>

  //   <View style={styles.itemContainer}>
  //     <Image source={{ uri: item.image }} style={styles.image} />
  //     <Text style={styles.title}>{item.title}</Text>
  //     <Text style={styles.price}>${item.price}</Text>
  //   </View>
  //   ))
    <View>
      <ProductCarousel cartItems={cartItems} />
    </View>
  );
};


// const styles = StyleSheet.create({
//   itemContainer: {
//     width: screenWidth * 0.8, // Adjust this value to control the width of each carousel item
//     backgroundColor: 'white',
//     borderRadius: 8,
//     overflow: 'hidden',
//     marginHorizontal: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   price: {
//     fontSize: 14,
//     color: 'gray',
//     marginTop: 5,
//   },
// });
export default ProductsScreen;