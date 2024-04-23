import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CartItem from '../../components/EcommComponents/CartItem';
import AddressCard from '../../components/EcommComponents/AddressCard';
import TotalCost from '../../components/EcommComponents/TotalCost';
import {useNavigation} from '@react-navigation/native';

const CART_STORAGE_KEY = '@OneBank:cart';

const CartScreen = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const loadedCart = await loadCartFromStore();
        setCart(loadedCart);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadCart();
  }, [cart]);

  const loadCartFromStore = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData !== null) {
        return JSON.parse(cartData);
      }
      return [];
    } catch (error) {
      throw new Error('Error loading cart:', error);
    }
  };

  const removeAllItems = async () => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      setCart([]);
    } catch (error) {
      console.error('Error removing all items:', error);
    }
  };
  const uniqueProductsMap = new Map();
  cart.forEach(item => uniqueProductsMap.set(item.id, item));
  const uniqueProducts = Array.from(uniqueProductsMap.values());

  return (
    <>
      <ScrollView style={{backgroundColor: '#9c27b0', flex: 1}}>
        <View style={{padding: 10}}>
          {cart.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 16,
                color: '#FFF',
              }}>
              Your cart is empty
            </Text>
          ) : (
            <>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 10,
                  marginVertical: 10,
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#FFF',
                }}
                onPress={removeAllItems}>
                Remove All
              </Text>

              {uniqueProducts.map((item, index) => (
                <CartItem key={index} item={item} />
              ))}
              <AddressCard
                full_name="mr Ron Savage"
                line1="Flat 20"
                line2="24 Acacia Avenue"
                line3="Beanotown"
                line4="Beanoshire"
                postcode="B34 4NO"
                country="JEY"
              />
              <TotalCost SubTotal="$90.00" ShippingCost="$5.00" Tax="$0.00" />
            </>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Select Your Bank');
        }}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Buy Now</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'rgba(176, 130, 255, 0.5)',
    padding: wp('4.2%'),
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
});
export default CartScreen;
