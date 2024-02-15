import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {Surface} from '@react-native-material/core';
import LocalAccountDetails from '../components/LocalAccountDetails';
import DropdownWithCheckboxes from '../components/DropdownWithCheckboxes';
import SortDropdown from '../components/SortDropdown';
import readNatwestAccount from '../assets/data/accounts.json';
import readNatwestBalance from '../assets/data/balances.json';
import readBarclaysAccount from '../assets/data/barclaysAccounts.json';
import readBarclaysBalance from '../assets/data/barclaysBalances.json';
import readNatwestTransaction from '../assets/data/transactions.json';
import readBarclaysTransaction from '../assets/data/barclaysTransactions.json';
import LocalTransactionList from '../components/LocalTransactionList';

const NatwestAccountData = readNatwestAccount?.Data?.Account;
const NatwestBalanceData = readNatwestBalance?.Data?.Balance;
const NatwestTransactionData = readNatwestTransaction?.Data?.Transaction;
const BarclaysAccountData = readBarclaysAccount?.Data?.Account;
const BarclaysBalanceData = readBarclaysBalance?.Data?.Balance;
const BarclaysTransactionData = readBarclaysTransaction?.Data?.Transaction;
const mergedAccounts = [...NatwestAccountData, ...BarclaysAccountData];
const mergedBalances = [...NatwestBalanceData, ...BarclaysBalanceData];
const mergedTransactions = [
  ...NatwestTransactionData,
  ...BarclaysTransactionData,
];

const findAccountBalances = accountId => {
  const foundBalances = mergedBalances.filter(
    balance => balance.AccountId === accountId,
  );

  if (foundBalances.length > 0) {
    return foundBalances;
  } else {
    return null;
  }
};
findAccountTransactions = accountId => {
  const foundTransactions = mergedTransactions.filter(
    transaction => transaction.AccountId === accountId,
  );
  if (foundTransactions.length > 0) {
    return foundTransactions;
  } else {
    return null;
  }
};

const ViewAllLocalDetails = ({route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const accountId = route.params.AccountId;
  const accountDetails = mergedAccounts.find(
    account => account.AccountId == accountId,
  );
  const transactionDetails = findAccountTransactions(accountId);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        nestedScrollEnabled={true}
        style={{padding: 5, marginVertical: 8, flex: 1}}>
        <View style={styles.rowContainer}>
          <Surface elevation={6} category="medium" style={styles.surface}>
            {BarclaysAccountData.find(
              barclaysAccount => barclaysAccount.AccountId === accountId,
            ) ? (
              <Image
                source={require('../assets/images/barclays.png')}
                style={styles.icon}
              />
            ) : (
              <Image
                source={require('../assets/images/natwest.png')}
                style={styles.icon}
              />
            )}
          </Surface>
          <DropdownWithCheckboxes />
        </View>
        <LocalAccountDetails
          account={accountDetails}
          balance={findAccountBalances(accountId)}
        />

        <View
          style={{
            flexDirection: 'column',
            backgroundColor: '#c8e1cc',
            borderRadius: 10,
            padding: 3,
            margin: 10,
            shadowOpacity: 0.3,
            elevation: 3,
            shadowColor: '#000',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 15,
              }}>
              Transactions
            </Text>
            <SortDropdown />
          </View>
          <Searchbar
            placeholder="Search Transaction"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{
              borderRadius: 10,
              width: '95%',
              marginTop: 12,
              alignSelf: 'center',
            }}
          />
          <LocalTransactionList transactionDetails={transactionDetails} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surface: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default ViewAllLocalDetails;
