import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

const AddressCard = (props) => {
  const navigation = useNavigation();
  const { full_name, line1, line2, line3, line4, postcode, country } = props;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('Banklist');
      }}>
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.title}>Shipping Address</Text>
        <Text style={styles.address}>{full_name}, {line1}</Text>
        <Text style={styles.address}>{line2}, {line3}</Text>
        <Text style={styles.address}>{line4}, {postcode}, {country}</Text>
      </View>
      <View style={styles.chevron}>
        <IconButton icon="chevron-right" size={24} color="#2A62B9" />
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
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  title: {
    color: '#000',
    marginBottom: 5,
    fontSize: RFValue(15),
  },
  address: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  chevron: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddressCard;
