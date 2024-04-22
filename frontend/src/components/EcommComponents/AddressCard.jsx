import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton} from 'react-native-paper';

const AddressCard = props => {
  const {full_name, line1, line2, line3, line4, postcode, country} = props;
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <View style={{flexDirection: 'column'}}>
        <Text style={{color: '#FFF', marginVertical: 5, fontSize: 16}}>
          Shipping Address
        </Text>

        <View style={{flexDirection: 'row', marginVertical: 2}}>
          <Text style={styles.address}>{full_name} , </Text>
          <Text style={styles.address}>{line1}</Text>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 2}}>
          <Text style={styles.address}>{line2} , </Text>
          <Text style={styles.address}>{line3}</Text>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 2}}>
          <Text style={styles.address}>{line4} , </Text>
          <Text style={styles.address}>{postcode} , </Text>
          <Text style={styles.address}>{country}</Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <IconButton icon="chevron-right" size={32} iconColor="#fff" />
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
    backgroundColor: 'rgba(60, 40, 80, 0.5)',
    marginVertical: 5,
  },
  address: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  chevron: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AddressCard;
