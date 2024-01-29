import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Surface} from '@react-native-material/core';
import AccountCard from '../AccountCard';

const NatwestAccounts = props => {
  const accounts = props.accountsList.Account;

  return (
    <View>
      <Surface elevation={6} category="medium" style={styles.surface}>
        <Image
          source={require('../../assets/icons/natwest.png')}
          style={styles.icon}
        />
      </Surface>
      {accounts.map(item => (
        <AccountCard key={item.AccountId} item={item} />
      ))}
    </View>
  );
};

export default NatwestAccounts;

const styles = StyleSheet.create({
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
});
