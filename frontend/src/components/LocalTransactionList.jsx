import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import TransactionCard from './TransactionCard';

const LocalTransactionList = props => {
  const transactions = props.transactionDetails;
  return (
    <View style={{padding: 4, marginVertical: 8}}>
      {transactions ? (
        transactions.map(transaction => (
          <TransactionCard
            key={transaction.TransactionId}
            transaction={transaction}
          />
        ))
      ) : (
        <Text style={{textAlign: 'center', fontSize: 18}}>
          No Transactions Found
        </Text>
      )}
    </View>
  );
};

export default LocalTransactionList;
