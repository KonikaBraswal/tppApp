import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import TransactionCard from '../components/TransactionCard';
import axios from 'axios';

const TransactionListScreen = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://192.168.1.6:3002/Data');
        setTransactions(response.data.Transaction);
        // console.log(response.data.Transaction);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <View style={{padding: 10, marginVertical: 8}}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.TransactionId}
        renderItem={({item}) => <TransactionCard transaction={item} />}
      />
    </View>
  );
};

export default TransactionListScreen;
// json-server --watch ./src/assets/data/transactions.json --port 3002
