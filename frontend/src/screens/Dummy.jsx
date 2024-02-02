import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';

const Dummy = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 30,
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          margin: 20,
          color: 'black',
        }}>
        Dummy Page
      </Text>
    </View>
  );
};

export default Dummy;
