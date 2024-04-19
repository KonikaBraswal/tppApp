import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Rating} from 'react-native-ratings';
import {IconButton} from 'react-native-paper';

const ReviewList = ({name, rating, content, title}) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };
  return (
    <View style={{marginBottom: 15}}>
      <TouchableOpacity
        onPress={toggleAccordion}
        style={{backgroundColor: '#FFF', borderRadius: 10}}>
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
            }}>
            <IconButton
              icon="check-decagram-outline"
              iconColor="green"
              size={24}
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#000',
              }}>
              {name}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Rating
              type="custom"
              ratingCount={5}
              startingValue={rating}
              imageSize={20}
              readonly
            />
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
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
              {title}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '400',
                marginTop: hp('1%'),
                color: '#000',
              }}>
              {content}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  name: {
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
  rating: {
    fontSize: wp('3.5%'),
    color: 'gray',
  },
  content: {
    fontSize: wp('4%'),
  },
});

export default ReviewList;
