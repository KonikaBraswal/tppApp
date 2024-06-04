import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';

const HsbcDummy = () => {
  const route = useRoute();
  const { data } = route.params || {};

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
        HSBC Dummy Page
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          margin: 10,
          color: 'black',
        }}>
        {JSON.stringify(data, null, 2)}
      </Text>
    </View>
  );
};

export default HsbcDummy;
