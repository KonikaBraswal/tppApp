import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';

const AddressCard = props => {
  const {full_name, line1, line2, line3, line4, postcode, country} = props;
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <View style={{flexDirection: 'column'}}>
        <Text
          style={{
            color: '#000',
            marginVertical: hp('1%'),
            fontSize: RFValue(15),
          }}>
          Shipping Address
        </Text>

        <View style={{flexDirection: 'row', marginVertical: hp('0.4%')}}>
          <Text style={styles.address}>{full_name} , </Text>
          <Text style={styles.address}>{line1}</Text>
        </View>
        <View style={{flexDirection: 'row', marginVertical: hp('0.4%')}}>
          <Text style={styles.address}>{line2} , </Text>
          <Text style={styles.address}>{line3}</Text>
        </View>
        <View style={{flexDirection: 'row', marginVertical: hp('0.4%')}}>
          <Text style={styles.address}>{line4} , </Text>
          <Text style={styles.address}>{postcode} , </Text>
          <Text style={styles.address}>{country}</Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <IconButton icon="chevron-right" size={32} iconColor="#2A62B9" />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(42, 98, 185, 0.5)',
    opacity: 0.8,
    marginVertical: hp('1%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  address: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#000',
  },
  chevron: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AddressCard;
