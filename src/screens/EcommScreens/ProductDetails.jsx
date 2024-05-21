import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { IconButton, Button, Modal, Portal } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import ImageCarousel from '../../components/EcommComponents/ImageCarousel';
import imgArray from '../../assets/data/images';
import ReviewList from '../../components/EcommComponents/ReviewList';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@OneBank:cart';

const ProductDetails = ({ route }) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  
  const addItemToCart = async (productToAdd) => {
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

  const handleButton1Press = (product) => {
    showModal();
    addItemToCart(product);
    console.log(product, 'Added To Cart');
  };

  const handleButton2Press = () => {
    console.log('Cart Screen');
    navigation.navigate('Cart');
  };

  const product = route.params.product;
  const productImages = imgArray.find((object) => object.id === product.id);
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <ImageCarousel data={productImages} />

          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <View style={styles.ratingContainer}>
              <Rating
                type="custom"
                ratingCount={5}
                startingValue={product.rating}
                imageSize={25}
                readonly
              />
            </View>
            <View style={styles.priceStockContainer}>
              <Text style={styles.priceText}>Price: € {product.price.toFixed(2)}</Text>
              <Text style={styles.stockText}>In Stock: {product.inStock}</Text>
            </View>
            <Text style={styles.specsTitle}>Specifications:</Text>
            <Text style={styles.specsText}>{product.specs}</Text>
            {product.reviews.length > 0 && (
              <View>
                <Text style={styles.reviewsTitle}>Reviews:</Text>
                <View style={styles.reviewsContainer}>
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
          activeOpacity={1}
        >
          <View style={styles.buttonContent}>
            <IconButton icon="cart" iconColor="#fff" size={24} />
            <Text style={styles.buttonText}>Add To Cart</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleButton2Press}>
          <View style={styles.buttonContent}>
            <IconButton icon="gesture-tap" iconColor="#fff" size={24} />
            <Text style={styles.buttonText}>Go To Bag</Text>
          </View>
        </TouchableOpacity>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <IconButton icon="check-circle" size={45} iconColor="green" />
              <Text style={styles.modalText}>{product.title}</Text>
              <Text style={styles.modalText}> Added to Cart !</Text>
              <IconButton
                icon="close"
                iconColor="black"
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    marginTop: 16,
  },
  productInfo: {
    padding: 6,
    marginVertical: 16,
  },
  productTitle: {
    fontSize: 17,
    marginBottom: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  ratingContainer: {
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  priceStockContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  priceText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  stockText: {
    fontSize: 15,
    padding: 5,
    color: '#000',
    fontWeight: 'bold',
    backgroundColor: '#FFF',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  specsTitle: {
    fontSize: 17,
    marginVertical: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  specsText: {
    color: 'black',
    flexWrap: 'wrap',
    marginBottom: 7,
    fontSize: 14,
    fontWeight: '400',
  },
  reviewsTitle: {
    fontSize: 17,
    marginVertical: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  reviewsContainer: {
    marginBottom: 55,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(192, 192, 192, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#3559AA',
    marginHorizontal: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#0047AB',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default ProductDetails;
