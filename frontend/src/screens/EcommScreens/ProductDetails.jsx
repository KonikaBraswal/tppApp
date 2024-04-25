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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import ImageCarousel from '../../components/EcommComponents/ImageCarousel';
import imgArray from '../../assets/data/images';
import ReviewList from '../../components/EcommComponents/ReviewList';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@OneBank:cart';

const ProductDetails = ({route}) => {
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

  console.log(route.params.product);
  const product = route.params.product;
  const productImages = imgArray.find(object => object.id === product.id);
  return (
    <View>
      <ScrollView style={{backgroundColor: '#fff'}}>
        <View style={{padding: hp('1%'), marginTop: hp('1.5%')}}>
          <ImageCarousel data={productImages} />

          <View style={{padding: 6, marginVertical: hp('1.5%')}}>
            <Text
              style={{
                fontSize: RFValue(17),
                marginBottom: 5,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {product.title}
            </Text>
            <View
              style={{alignItems: 'flex-start', marginVertical: hp('1.5%')}}>
              <Rating
                type="custom"
                ratingCount={5}
                startingValue={product.rating}
                imageSize={25}
                readonly
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-between',
                marginTop: hp('1.5%'),
              }}>
              <Text
                style={{
                  fontSize: RFValue(18),
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Price: € {product.price.toFixed(2)}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(15),
                  padding: 5,
                  color: '#000',
                  fontWeight: 'bold',
                  backgroundColor: '#FFF',
                  borderColor: '#000',
                  borderWidth: 1,
                  borderRadius: 5,
                }}>
                In Stock: {product.inStock}
              </Text>
            </View>
            <Text
              style={{
                fontSize: RFValue(17),
                marginVertical: hp('1.5%'),
                color: 'black',
                fontWeight: 'bold',
              }}>
              Specifications:
            </Text>
            <View>
              <Text
                style={{
                  color: 'black',
                  flexWrap: 'wrap',
                  marginBottom: hp('0.7%'),
                  fontSize: RFValue(14),
                  fontWeight: '400',
                }}>
                {product.specs}
              </Text>
            </View>
            {product.reviews.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: RFValue(17),
                    marginVertical: 10,
                    color: 'black',
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
            <IconButton icon="gesture-tap" iconColor="#fff" size={24} />
            <Text style={styles.buttonText}>Go To Bag</Text>
          </View>
        </TouchableOpacity>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(192, 192, 192, 0.9)',
    paddingVertical: hp('2.2%'),
    paddingHorizontal: wp('3%'),
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#0047AB',
    marginHorizontal: wp('1%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: RFValue(15),
    fontWeight: '600',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: hp('4%'),
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: RFValue(16),
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
