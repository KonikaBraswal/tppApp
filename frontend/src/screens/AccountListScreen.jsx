import React, { useState, useEffect } from 'react';
import { View,FlatList } from 'react-native';
import axios from 'axios';
import AccountCard from '../components/AccountCard';

const AccountListScreen = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/Data')
      .then(response => setAccounts(response.data.Account))
      .catch(error => console.error('Error fetching account data:', error));
  }, []);

  return (
    <View style={{ padding: 10,marginVertical:8 }}>
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.AccountId}
            renderItem={({ item }) => <AccountCard account={item} />}
          />
    </View>
  );
};

export default AccountListScreen;
// json-server --watch ./src/assets/data/accounts.json

