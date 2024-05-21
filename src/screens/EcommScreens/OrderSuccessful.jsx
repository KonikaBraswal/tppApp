
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const OrderSuccessful = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
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
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonLabel}
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '50%',
    marginTop: '3%',
  },
  footer: {
    backgroundColor: '#35324F',
    paddingHorizontal: '5%',
    paddingVertical: '5.5%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: '1%',
    fontSize: 16,
    color: '#87878A',
  },
  footerTitle: {
    textAlign: 'center',
    marginBottom: '1%',
    fontWeight: 'bold',
    fontSize: 22,
    color: '#fff',
  },
  button: {
    borderRadius: 20,
    paddingVertical: '1%',
    paddingHorizontal: '4%',
    backgroundColor: '#3559AA',
    marginTop: '2%',
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

export default OrderSuccessful;
