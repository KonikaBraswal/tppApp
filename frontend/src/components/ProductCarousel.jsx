import React, {useRef} from 'react'
import { Image, View, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Ionicons for star icons

// import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useCart } from './CartContext';
// import { Product } from './Product';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
// Calculate the width for each child (assuming equal width for both children)
const childWidth = (screenWidth) / 2; // Subtracting padding and margins

// const { cartItems } = useCart();

// const ProductCarousel: React.FC<{ products: Product[] }> = () => {



const ProductCarousel = ({cartItems}) => {
   
    // const renderItem = cartItems.map(({item}: { item: Product } ) => (
    // const renderItem = cartItems.map((item ) => (
    //     <View style={styles.item}>
    //       <Text>{item.title}</Text>
    //       {/* Add additional product details */}
    //     </View>
    // ));

    // 1291  npm install @expo/vector-icons
    //  1292  npm start
    //  1293  npm install expo-font
    const StarRating = (rating) => {
      const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          // Check if the current star should be filled or not based on the rating
          const isFilled = i <= rating;
          stars.push(
            <Ionicons
              key={i}
              name={isFilled ? 'star' : 'star-outline'} // Use filled star or outline star icon
              size={20} // Adjust star icon size as needed
              color={isFilled ? 'gold' : 'gray'} // Use gold color for filled stars and gray for outline stars
            />
          );
        }
        return stars;
      };
    }
  const navigation = useNavigation();
  const goToNextScreen = () => {
    navigation.navigate('Cart');
  };
  const scrollViewRef = useRef();

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const currentIndex = Math.round(contentOffset.x / screenWidth);
    console.log('Current Index:', currentIndex);
  };
    
      return (
        // <Carousel
        //   data={cartItems}
        //   renderItem={()=>renderItem}
        //   sliderWidth={Dimensions.get('window').width}
        //   itemWidth={200} // Adjust the width of each item as needed
        // />
    <ScrollView
        ref={scrollViewRef}
        vertical
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={100} // Example interval for snapping
        snapToAlignment="center" // Alignment for snapping
    >
      {cartItems.map((item, index) => (
        <TouchableOpacity key={index} style={[styles.itemContainer, { width: screenWidth }]} onPress={goToNextScreen}>
          <View key={index} style={[styles.child, { width: childWidth }]}>
            {/* <Image source={item.image} style={styles.image} /> */}
            <Image source={item.path ? item.path : require('../assets/images/VRP.png')} style={styles.image} />
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.normal_text}>{item.description}</Text>
            <Text style={styles.normal_text}>{item.price}</Text>
            <Text style={styles.normal_text}>{StarRating(item.rating)}</Text>


          </View>
        </TouchableOpacity>
        // <View key={index} style={[styles.itemContainer, { width: screenWidth }]}>
          
        // </View>
      ))}
    </ScrollView>
      );
}

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


export default ProductCarousel;