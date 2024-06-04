import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const TotalCost = (props) => {
  const { SubTotal, ShippingCost, Tax } = props;

  const calculateTotal = () => {
    const subtotal = parseFloat(SubTotal);
    const shippingCost = parseFloat(ShippingCost.substring(1));
    const tax = parseFloat(Tax.substring(1));

    return (subtotal + shippingCost + tax).toFixed(2);
  };

  return (
    <View style={{ flexDirection: 'column', marginTop: 10 }}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>£{SubTotal}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shipping Cost</Text>
        <Text style={styles.value}>{ShippingCost}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tax</Text>
        <Text style={styles.value}>{Tax}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>£{calculateTotal()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: RFValue(17),
    fontWeight: 'bold',
    color: '#000',
  },
  value: {
    fontSize: RFValue(17),
    color: '#000',
  },
});

export default TotalCost;

