import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {IconButton, Button, Modal, Portal} from 'react-native-paper';
import {Rating} from 'react-native-ratings';
import ImageCarousel from '../../components/EcommComponents/ImageCarousel';
import imagesArray from '../../assets/data/ecomm-images';
import ReviewList from '../../components/EcommComponents/ReviewList';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@OneBank:cart';

const ProductDetails = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const addItemToCart = async productToAdd => {
    try {
      const existingCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      let updatedCart = [];

      if (existingCart !== null) {
        updatedCart = JSON.parse(existingCart);
      }

      updatedCart.push(productToAdd);

      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleButton1Press = product => {
    showModal();
    addItemToCart(product);
    console.log(product, 'Added To Cart');
  };

  const handleButton2Press = () => {
    console.log('Cart Screen');
    navigation.navigate('Cart');
  };

  // const product=props.product;
  const product = {
    Brand: 'Samsung',
    RAM: '6 GB',
    title: 'Samsung Galaxy M31 (Ocean Blue, 6GB RAM, 128GB Storage)',
    category: 'Mobiles',
    price: 14999,
    specs: [
      'Quad Camera Setup - 64MP (F1.8) Main Camera +8MP (F2.2) Ultra Wide Camera +5MP(F2.2) Depth Camera +5MP(F2.4) Macro Camera and 32MP (F2.0) front facing Camera',
      '6.4-inch(16.21 centimeters) Super Amoled - Infinity U Cut Display , FHD+ Resolution (2340 x 1080) , 404 ppi pixel density and 16M color support',
      'Android v10.0 operating system with 2.3GHz + 1.7GHz Exynos 9611 Octa core processor , 6GB RAM, 128GB internal memory expandable up to 512GB and dual SIM',
      '6000 mAh Battery',
    ],
    inStock: 50,
    eta: 20,
    id: 'm2',
    rating: 4,
    reviews: [
      {
        name: 'Rohit',
        title: 'Best mobile in buget',
        content: 'I higely recoomend this mobile',
        rating: 5,
      },
      {
        name: 'Doraemon',
        title: 'Value for money',
        content:
          "Really a good budget phone with big battery. Camera performance also awesome, but in pro mode there no control for shutter speed and while changing the iso i don't feel any differences. I need more update on camera modes. Phone performance and charging speed is good. Except camera modes i love this phone.",
        rating: 4,
      },
      {
        name: 'Nobita',
        title: 'Best in the market with this price range',
        content:
          'A Descent phone Definitely not for pro pubg player but can work fine Super amoled gives it best performance Descent camera Improved Selfie camera compared to M30 Long battery life Nice Security No ads unlike MI Works smoothly',
        rating: 5,
      },
    ],
  };
  const productImages = imagesArray.find(object => object.id === product.id);
  return (
    <View>
      <ScrollView style={{backgroundColor: '#9c27b0'}}>
        <View style={{padding: 10, marginTop: 15}}>
          <ImageCarousel data={productImages} />

          <View style={{padding: 6, marginTop: 10}}>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 5,
                color: 'white',
                fontWeight: 'bold',
              }}>
              {product.title}
            </Text>
            <View style={{alignItems: 'flex-start', marginVertical: 5}}>
              <Rating
                type="custom"
                ratingCount={5}
                startingValue={product.rating}
                imageSize={25}
                tintColor="#9c27b0"
                readonly
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-between',
                marginVertical: 5,
              }}>
              <Text
                style={{
                  fontSize: 19,
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Price: $ {product.price.toFixed(2)}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  padding: 5,
                  color: '#000',
                  fontWeight: 'bold',
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                }}>
                In Stock: ${product.inStock}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 5,
                color: 'white',
                fontWeight: 'bold',
              }}>
              Specifications:
            </Text>
            <View>
              <Text
                style={{
                  color: 'white',
                  flexWrap: 'wrap',
                  marginBottom: 5,
                  fontSize: 15,
                  fontWeight: '400',
                }}>
                {product.specs}
              </Text>
            </View>
            {product.reviews.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    marginTop: 5,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  Reviews:
                </Text>
                <View style={{marginBottom: 55}}>
                  {product.reviews.map((review, id) => (
                    <ReviewList
                      key={id}
                      title={review.title}
                      content={review.content}
                      name={review.name}
                      rating={review.rating}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButton1Press(product)}
          activeOpacity={1}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconButton icon="cart" iconColor="#fff" size={24} />
            <Text style={styles.buttonText}>Add To Cart</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleButton2Press}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconButton
              icon="chevron-right-circle-outline"
              iconColor="#fff"
              size={24}
            />
            <Text style={styles.buttonText}>Go To Bag</Text>
          </View>
        </TouchableOpacity>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}>
            <View style={styles.modalContent}>
              <IconButton
                icon="check-circle"
                size={50}
                iconColor="green"
                style={styles.icon}
              />
              <Text style={styles.modalText}>{product.title}</Text>
              <Text style={styles.modalText}> Added to Cart!</Text>
              <IconButton
                icon="close"
                iconColor="purple"
                onPress={hideModal}
                style={styles.closeButton}
              />
            </View>
          </Modal>
        </Portal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(192, 192, 192, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'green',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
export default ProductDetails;
