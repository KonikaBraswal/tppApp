import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
import BarclaysLocalTransactionList from '../components/BarclaysLocalTransactionList';

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
      style={styles.container}>
      <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
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

        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsHeaderText}>Transactions</Text>
            <SortDropdown />
          </View>
          <Searchbar
            placeholder="Search Transaction"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <BarclaysLocalTransactionList
            transactionDetails={transactionDetails}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    padding: wp('1%'),
    marginVertical: hp('1%'),
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  surface: {
    width: wp('17%'),
    height: wp('17%'),
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp('3%'),
  },
  icon: {
    width: wp('16%'),
    height: wp('16%'),
    resizeMode: 'contain',
    marginVertical: wp('1.2%'),
  },
  transactionsContainer: {
    flexDirection: 'column',
    backgroundColor: '#c8e1cc',
    borderRadius: wp('2%'),
    padding: wp('1%'),
    margin: wp('2%'),
    shadowOpacity: 0.3,
    elevation: 3,
    shadowColor: '#000',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginLeft: wp('3%'),
    marginRight: wp('3%'),
  },
  transactionsHeaderText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'black',
  },
  searchbar: {
    borderRadius: wp('2%'),
    width: '95%',
    marginTop: hp('1%'),
    alignSelf: 'center',
  },
});

export default ViewAllLocalDetails;
