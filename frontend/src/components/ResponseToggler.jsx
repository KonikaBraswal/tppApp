import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';

import {IconButton} from 'react-native-paper';

const ResponseToggler = ({keyText, valueText}) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={{marginBottom: hp('2%')}}>
      <TouchableOpacity
        style={{
          backgroundColor: '#FFF',
          borderRadius: 10,
          elevation: 4,
          marginHorizontal: hp('1.5%'),
          marginBottom: hp('2%'),
        }}
        onPress={toggleAccordion}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <IconButton icon="connection" iconColor="green" size={25} />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: RFValue(14),
                color: '#000',
              }}>
              {keyText}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: hp('0.5%'),
            }}>
            <IconButton
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              onPress={toggleAccordion}
            />
          </View>
        </View>

        {expanded && (
          <View
            style={{paddingHorizontal: wp('5%'), paddingVertical: hp('2%')}}>
            <Text
              style={{
                fontSize: RFValue(15),
                color: '#000',
              }}>
              {JSON.stringify(valueText, null, 2)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
});

export default ResponseToggler;
