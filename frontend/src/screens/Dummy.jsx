import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';

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
        <Button onPress={() => navigation.navigate('Transaction Successfull')}>
          press
        </Button>
      </Text>
    </View>
  );
};

export default Dummy;
