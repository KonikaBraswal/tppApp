import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import TransactionCard from './TransactionCard';
import axios from 'axios';

const TransactionList = props => {
  // const [transactions, setTransactions] = useState([]);

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const response = await axios.get('http://192.168.1.7:3002/Data');
  //       setTransactions(response.data.Transaction);
  //     } catch (error) {
  //       console.error('Error fetching transactions:', error.message);
  //     }
  //   };

  //   fetchTransactions();
  // }, []);
  const transactions = props.transactionDetails;
  return (
    <View style={{padding: 4, marginVertical: 8}}>
      {transactions.map(transaction => (
        <TransactionCard
          key={transaction.TransactionId}
          transaction={transaction}
        />
      ))}
    </View>
  );
};

export default TransactionList;
