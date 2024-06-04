import React from 'react';
import { View, Text,Image,StyleSheet } from 'react-native';
import { Surface } from '@react-native-material/core';
import AccountCard from '../AccountCard';
const AddingAccounts =props => {
  const accounts = props.accountsList.Account;
  const permissions = props.permissions;
  const bankName=props.bankName;
  return (
    <View contentContainerStyle={styles.container}>
      {accounts.map(item => (
        <AccountCard
          key={item.AccountId}
          item={item}
          permissions={permissions}
          bankName={bankName}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
export default AddingAccounts;
