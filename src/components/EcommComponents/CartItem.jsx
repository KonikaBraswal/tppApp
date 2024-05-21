import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import imgArray from '../../assets/data/images';
import { useNavigation } from '@react-navigation/native';

const CART_STORAGE_KEY = '@OneBank:cart';

const CartItem = (props) => {
  const navigation = useNavigation();
  const [productCount, setProductCount] = useState(0);
  const product = props.item;
  const productImage = imgArray.find((object) => object.id === product.id);
  const { width, height } = useWindowDimensions();

  const wp = (percentage) => (percentage * width) / 100;
  const hp = (percentage) => (percentage * height) / 100;

  useEffect(() => {
    const getProductCountById = async () => {
      try {
        const cartItems = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartItems !== null) {
          const products = JSON.parse(cartItems);
          const count = products.reduce((accumulator, currentProduct) => {
            if (currentProduct.id === product.id) {
              return accumulator + 1;
            }
            return accumulator;
          }, 0);
          setProductCount(count);
        }
      } catch (error) {
        console.error('Error retrieving cartItems from AsyncStorage:', error);
      }
    };

    getProductCountById();
  }, [product.id]);

  const incrementProductCount = async () => {
    try {
      const cartItems = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartItems !== null) {
        const products = JSON.parse(cartItems);
        products.push(product);
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(products));
        setProductCount(productCount + 1);
      }
    } catch (error) {
      console.error('Error updating product count:', error);
    }
  };

  const decrementProductCount = async () => {
    try {
      const cartItems = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartItems !== null) {
        let products = JSON.parse(cartItems);
        const index = products.findIndex((item) => item.id === product.id);
        if (index !== -1) {
          products.splice(index, 1);
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(products));
          setProductCount(productCount - 1);
        }
      }
    } catch (error) {
      console.error('Error updating product count:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container(wp, hp)} activeOpacity={1}>
      <View style={styles.productContainer}>
        <Surface style={styles.surface(wp, hp)}>
          <Image source={productImage.images[0]} style={styles.icon(wp, hp)} />
        </Surface>
        <View style={styles.detailsContainer(wp, hp)}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>€ {product.price}</Text>
          </View>
          <View style={styles.infoContainer}>
            {product.category === 'Mobiles' ? (
              <Text style={styles.info}>{product.RAM} RAM</Text>
            ) : product.category === 'Books' ? (
              <Text style={styles.info}>{product.Genre} Genre</Text>
            ) : product.category === 'Clothings' ? (
              <Text style={styles.info}>For {product.For}</Text>
            ) : product.category === 'Beauty' ? (
              <Text style={styles.info}>{product.Type}</Text>
            ) : product.category === 'Furniture' ? (
              <Text style={styles.info}>{product.Type}</Text>
            ) : product.category === 'Laptops' ? (
              <Text style={styles.info}>{product.RAM} RAM</Text>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.info}>No. of products: {productCount} </Text>
            </View>
            <View style={styles.buttons}>
              <IconButton
                icon="plus"
                mode="contained"
                size={15}
                containerColor="#fff"
                iconColor="black"
                onPress={incrementProductCount}
              />
              <IconButton
                icon="minus"
                mode="contained"
                containerColor="#fff"
                iconColor="black"
                size={15}
                onPress={decrementProductCount}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: (wp, hp) => ({
    marginTop: hp(1),
    marginBottom: hp(1),
    borderRadius: 10,
    backgroundColor: '#8263E4',
  }),
  productContainer: {
    flexDirection: 'row',
  },
  surface: (wp, hp) => ({
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: hp(1),
    paddingRight: wp(2),
    paddingLeft: wp(2),
    paddingVertical: hp(1),
  }),
  icon: (wp, hp) => ({
    width: wp(25),
    height: hp(12),
    resizeMode: 'contain',
    borderRadius: 10,
  }),
  detailsContainer: (wp, hp) => ({
    flexDirection: 'column',
    flex: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
  }),
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    color: '#fff',
  },
  price: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: wp(1),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: RFValue(13),
    marginHorizontal: 3,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CartItem;
