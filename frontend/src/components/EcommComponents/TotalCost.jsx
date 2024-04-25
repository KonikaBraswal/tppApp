import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';

const TotalCost = props => {
  const {SubTotal, ShippingCost, Tax} = props;
  return (
    <View style={{flexDirection: 'column', marginTop: hp('1%')}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: hp('0.8%'),
        }}>
        <Text style={styles.total}>Subtotal </Text>
        <Text style={styles.total}>€{SubTotal} </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: hp('0.8%'),
        }}>
        <Text style={styles.total}>Shipping Cost </Text>
        <Text style={styles.total}>{ShippingCost}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: hp('0.8%'),
        }}>
        <Text style={styles.total}>Tax</Text>
        <Text style={styles.total}>{Tax} </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: hp('0.8%'),
        }}>
        <Text style={styles.total}>Total </Text>
        <Text style={styles.total}>
          €
          {SubTotal +
            Number(ShippingCost.substring(1)) +
            Number(Tax.substring(1))}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  total: {
    fontSize: RFValue(17),
    fontWeight: 'bold',
    color: '#000',
  },
});
export default TotalCost;
