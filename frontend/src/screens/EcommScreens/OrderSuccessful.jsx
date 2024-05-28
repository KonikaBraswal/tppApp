import React from 'react';
import { useEffect } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton, Button} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';

const OrderSuccessful = props => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          color='white'
          style={{color: '#fff'}} // Set color to white through style
          onPress={() => navigation.navigate('Online Store')}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          style={styles.image}
          source={require('../../assets/images/ecomm-images/order-confirm.jpg')}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Order Placed Successfully</Text>
        <Text style={styles.footerText}>
          You will receive an email confirmation
        </Text>
        <Button
          mode="contained-tonal"
          style={{
            ...styles.button,
            backgroundColor: '#3559AA',
          }}
          labelStyle={{
            fontWeight: 'bold',
            fontSize: RFValue(16),
            color: 'white',
          }}
          onPress={() => {}}>
          See Order Details
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: wp('100%'),
    height: hp('50%'),
    marginTop: hp('3%'),
  },
  footer: {
    backgroundColor: '#35324F',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('5.5%'),
    borderTopLeftRadius: hp('3%'),
    borderTopRightRadius: hp('3%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  footerText: {
    textAlign: 'center',
    marginBottom: hp('1%'),
    fontSize: RFValue(16),
    color: '#87878A',
  },
  footerTitle: {
    textAlign: 'center',
    marginBottom: hp('1%'),
    fontWeight: 'bold',
    fontSize: RFValue(22),
    color: '#fff',
  },

  button: {
    borderRadius: 20,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderColor: 'black',
    marginTop: hp('2%'),
  },
});
export default OrderSuccessful;