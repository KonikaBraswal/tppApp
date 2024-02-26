import React from 'react';
import {View, Text} from 'react-native';

interface AccountData {
  Account: {
    Identification: string;
    Nickname: string;
    Currency: string;
    AccountType: string;
  }[];
}

interface AccountInfoProps {
  accountData: AccountData | null;
}

const AccountInfo: React.FC<AccountInfoProps> = ({accountData}) => {
  if (!accountData) {
    return null;
  }

  const account = accountData.Account[0];

  return (
    <View>
      {/* <Text>Identification: {account.Account[0].Identification}</Text> */}
      <Text>Nickname: {account.Nickname}</Text>
      <Text>Currency: {account.Currency}</Text>
      <Text>Account Type: {account.AccountType}</Text>
    </View>
  );
};

export default AccountInfo;
