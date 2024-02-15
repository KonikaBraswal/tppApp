import React from 'react'
import {globalRefreshedToken } from '../../database/Database';
import {View, Text} from 'react-native';


export default function Test() {
    
  return (
    <View>
        <Text>
        Result :
            {globalRefreshedToken}
        </Text>
    </View>
  )
}
