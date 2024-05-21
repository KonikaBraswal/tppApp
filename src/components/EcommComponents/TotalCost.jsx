import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const TotalCost = (props) => {
  const { SubTotal, ShippingCost, Tax } = props;

  const calculateTotal = () => {
    const shipping = Number(ShippingCost.substring(1));
    const tax = Number(Tax.substring(1));
    return SubTotal + shipping + tax;
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>€{SubTotal}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Shipping Cost</Text>
        <Text style={styles.value}>{ShippingCost}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Tax</Text>
        <Text style={styles.value}>{Tax}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>€{calculateTotal()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  item: {
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
