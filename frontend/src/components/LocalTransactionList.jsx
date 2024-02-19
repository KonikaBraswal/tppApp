import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import TransactionCard from './TransactionCard';

const LocalTransactionList = props => {
  const transactions = props.transactionDetails;
  return (
    <View style={styles.container}>
      {transactions ? (
        transactions.map(transaction => (
          <TransactionCard
            key={transaction.TransactionId}
            transaction={transaction}
          />
        ))
      ) : (
        <Text style={styles.noTransactionsText}>No Transactions Found</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginVertical: hp('1%'),
  },
  noTransactionsText: {
    textAlign: 'center',
    fontSize: hp('2%'),
    color: 'green',
  },
});

export default LocalTransactionList;
