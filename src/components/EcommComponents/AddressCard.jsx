import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useWindowDimensions } from 'react-native';

const AddressCard = (props) => {
  const navigation = useNavigation();
  const { full_name, line1, line2, line3, line4, postcode, country } = props;
  const { width, height } = useWindowDimensions();

  const wp = (percentage) => (percentage * width) / 100;
  const hp = (percentage) => (percentage * height) / 100;

  return (
    <TouchableOpacity style={styles.container(wp, hp)} activeOpacity={1}>
      <View style={{ flexDirection: 'column' }}>
        <Text
          style={{
            color: '#000',
            marginVertical: hp(1),
            fontSize: RFValue(15),
          }}
        >
          Shipping Address
        </Text>

        <View style={{ flexDirection: 'row', marginVertical: hp(0.4) }}>
          <Text style={styles.address}>{full_name} , </Text>
          <Text style={styles.address}>{line1}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: hp(0.4) }}>
          <Text style={styles.address}>{line2} , </Text>
          <Text style={styles.address}>{line3}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: hp(0.4) }}>
          <Text style={styles.address}>{line4} , </Text>
          <Text style={styles.address}>{postcode} , </Text>
          <Text style={styles.address}>{country}</Text>
        </View>
      </View>
      <View style={styles.chevron}>
        <IconButton
          icon="chevron-right"
          size={32}
          iconColor="#2A62B9"
          onPress={() => {
            navigation.navigate('Banklist');
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: (wp, hp) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(42, 98, 185, 0.5)',
    opacity: 0.8,
    marginVertical: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  }),
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
