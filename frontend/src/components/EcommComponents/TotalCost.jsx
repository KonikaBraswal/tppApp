import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton} from 'react-native-paper';

const TotalCost = props => {
  const {SubTotal, ShippingCost, Tax} = props;
  return (
    <View style={{flexDirection: 'column', marginTop: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 3,
        }}>
        <Text style={styles.total}>Subtotal </Text>
        <Text style={styles.total}>{SubTotal} </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 3,
        }}>
        <Text style={styles.total}>Shipping Cost </Text>
        <Text style={styles.total}>{ShippingCost}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 3,
        }}>
        <Text style={styles.total}>Tax</Text>
        <Text style={styles.total}>{Tax} </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 3,
        }}>
        <Text style={styles.total}>Total </Text>
        <Text style={styles.total}>
          $
          {Number(SubTotal.substring(1)) +
            Number(ShippingCost.substring(1)) +
            Number(Tax.substring(1))}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
export default TotalCost;
