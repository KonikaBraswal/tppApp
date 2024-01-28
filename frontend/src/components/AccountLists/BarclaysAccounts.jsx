import React from 'react';
import { View, Text,Image,StyleSheet } from 'react-native';
import { Surface } from '@react-native-material/core';

const BarclaysAccounts = () => {
  return (
    <View>
      <Surface elevation={6} category="medium" style={styles.surface}>
          <Image source={require('../../assets/icons/barclays.png')} style={styles.icon} />
        </Surface>
        <Text style={styles.text}>No Data</Text>
       
    </View>
  );
};

export default BarclaysAccounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a28d',
  },
  surface: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  text:{
    fontSize: 14,
    fontWeight:'bold',
    color:'black',
    paddingLeft:150

  }
});
