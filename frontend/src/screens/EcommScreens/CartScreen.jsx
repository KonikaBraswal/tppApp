import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import CartItem from '../../components/EcommComponents/CartItem';
import AddressCard from '../../components/EcommComponents/AddressCard';
import TotalCost from '../../components/EcommComponents/TotalCost';
import {fetchAllDataforScope, fetchAllDataforScopeCA} from '../../../database/Database';
import {useNavigation} from '@react-navigation/native';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const CART_STORAGE_KEY = '@OneBank:cart';

const CartScreen = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

  useEffect(() => {
    calculateTotalPrice();
  }, [cart]);

  const scope = 'vrp';
  const [consentData, setConsentData] = useState([]);

  useEffect(() => {
    fetchAllDataforScope(scope)
      .then(data => {
        if (data !== null) {
          setConsentData(data);
        } else {
          console.log(`No entry found for scope ${scope}.`);
        }
      })
      .catch(error => {
        console.error('Error fetching Consent data:', error);
      });
  }, [scope]);

  const findDataByConsentId = consentId => {
    return consentData.find(consent => consent.consentid === consentId);
  };

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
  const calculateTotalPrice = () => {
    const total = cart.reduce((accumulator, currentItem) => {
      const itemPrice = currentItem.price;
      return accumulator + itemPrice;
    }, 0);
    setTotalPrice(total);
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

  const getConsentData = async () => {
    try {
      const EcommConsentId = await AsyncStorage.getItem('EcommConsentId');
      if (EcommConsentId !== null) {
        EcommConsentData = findDataByConsentId(EcommConsentId);
        console.log('EcommConsentData', EcommConsentData);
        return EcommConsentData;
      } else {
        console.log('EcommConsentData not found');
      }
    } catch (error) {
      console.error('Error retrieving EcommConsentData:', error);
    }
  };
  const scopeCA='customer_checkout'
  const [caData,setCAData]=useState(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchAllDataforScopeCA(scopeCA)
        .then(data => {
          if (data !== null) {
            // console.log(data);
            setCAData(data[0]);
            // console.log("======",JSON.parse (data[0].vrppayload).DebtorAccount.Identification);
          } else {
            setCAData(null); 
            console.log(`No entry found for scope ${scope}.`);
          }
        })
        .catch(error => {
          console.error('Error fetching Consent data:', error);
        });
    }
  }, [isFocused, scopeCA]);
  // console.log("log",caData);
  const handleCheckout = async (SubTotal, ShippingCost, Tax) => {
    const totalAmount =  SubTotal +
      Number(ShippingCost.substring(1)) +
      Number(Tax.substring(1));
      if(caData!==null){
        // console.log("det2",caData);
        navigation.navigate('Make Payment', {totalAmount:totalAmount,data:caData});
      }
      else{
        navigation.navigate('Add Your Details', {totalAmount});
      }
  };

  return (
    <>
      <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
        <View style={{padding: 10}}>
          {cart.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: RFValue(15),
                color: '#0047AB',
              }}>
              Your cart is empty
            </Text>
          ) : (
            <>
              <Text
                style={{
                  alignSelf: 'flex-end',
                  marginRight: wp('3%'),
                  marginVertical: hp('0.5%'),
                  fontWeight: 'bold',
                  fontSize: RFValue(15),
                  color: '#000',
                }}
                onPress={removeAllItems}>
                Remove All
              </Text>

              {uniqueProducts.map((item, index) => (
                <CartItem key={index} item={item} />
              ))}
              {caData && (
                <AddressCard
                  full_name="mr Ron Savage"
                  line1="Flat 20"
                  line2="24 Acacia Avenue"
                  line3="Beanotown"
                  line4="Beanoshire"
                  postcode="B34 4NO"
                  country="JEY"
                />
              )}
              <TotalCost
                SubTotal={totalPrice}
                ShippingCost="€5.00"
                Tax="€0.00"
              />
            </>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => handleCheckout(totalPrice, "€5.00" , "€0.00" )}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Checkout</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'rgba(176, 130, 255, 0.5)',
    padding: wp('4%'),
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
