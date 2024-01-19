// AccountInfo.js
import React from 'react';
import { View, Text } from 'react-native';

const AccountInfo = ({ accountData }) => {
  if (!accountData) {
    return null;
  }

  const account = accountData.Account[0];

  return (
    <View>
      <Text>Identification: {account.Account[0].Identification}</Text>
      <Text>Nickname: {account.Nickname}</Text>
      <Text>Currency: {account.Currency}</Text>
      <Text>Account Type: {account.AccountType}</Text>
    </View>
  );
};

export default AccountInfo;
