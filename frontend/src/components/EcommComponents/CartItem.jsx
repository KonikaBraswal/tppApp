import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton, Surface} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CART_STORAGE_KEY = '@OneBank:cart';

const CartItem = props => {
  const [productCount, setProductCount] = useState(0);
  const product = props.item;
  useEffect(() => {
    const getProductCountById = async () => {
      try {
        const cartItems = await AsyncStorage.getItem(CART_STORAGE_KEY);
        console.log(cartItems);
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
        const index = products.findIndex(item => item.id === product.id);
        if (index !== -1) {
          products.splice(index, 1);
          await AsyncStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(products),
          );
          setProductCount(productCount - 1);
        }
      }
    } catch (error) {
      console.error('Error updating product count:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <View style={styles.productContainer}>
        <Surface
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            marginRight: 12,
          }}>
          <Image
            source={require('../../assets/ecomm-images/appleLaptop1.jpg')}
            style={styles.icon}
          />
        </Surface>
        <View style={styles.detailsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{product.price} $</Text>
          </View>
          <View style={styles.infoContainer}>
            {product.category === 'Mobiles' ? (
              <Text style={styles.info}>{product.RAM} RAM</Text>
            ) : (
              <>
                <Text style={styles.info}>Size-7</Text>
                <Text style={styles.info}>Color-blue</Text>
              </>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.info}>No. of products: {productCount} </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <IconButton
                icon="plus"
                mode="contained"
                size={15}
                containerColor="#E6C6E4"
                iconColor="black"
                onPress={incrementProductCount}
              />
              <IconButton
                icon="minus"
                mode="contained"
                containerColor="#E6C6E4"
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
  container: {
    marginTop: 7,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(60, 40, 80, 0.5)',
  },
  productContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 7,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 14,
    marginHorizontal: 3,
    color: '#fff',
    fontWeight: '600',
  },
});
export default CartItem;
