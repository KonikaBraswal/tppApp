import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AccountCard from '../AccountCard';

const NatwestAccounts = props => {
  const accounts = props.accountsList.Account;
  const permissions = props.permissions;

  return (
    <View contentContainerStyle={styles.container}>
      {accounts.map(item => (
        <AccountCard
          key={item.AccountId}
          item={item}
          permissions={permissions}
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
export default NatwestAccounts;
