import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import TransactionCard from './TransactionCard';
import axios from 'axios';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://192.168.1.4:3002/Data');
        setTransactions(response.data.Transaction);
        // console.log(response.data.Transaction);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <View style={{padding: 4, marginVertical: 8}}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.TransactionId}
        renderItem={({item}) => <TransactionCard transaction={item} />}
      />
    </View>
  );
};

export default TransactionList;
// json-server --watch ./src/assets/data/transactions.json --port 3002
