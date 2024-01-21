import React, {useState, useEffect} from 'react';
import {View, FlatList} from 'react-native';
import axios from 'axios';
import AccountCard from '../components/AccountCard';

const AccountListScreen = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    axios.get('http://localhost:3000/Data')
      .then(response => setAccounts(response.data.Account))
      .catch(error => console.error('Error fetching account data:', error));
=======
    async function fetchData() {
      axios
        .get('http://192.168.1.5:3000/Data')
        .then(response => setAccounts(response.data.Account))
        .catch(error => console.error('Error fetching account data:', error));
    }
    fetchData();
>>>>>>> 2c14aac8eb050e109feff65a74b68e6711c2616a
  }, []);

  return (
    <View style={{padding: 10, marginVertical: 8}}>
      <FlatList
        data={accounts}
        keyExtractor={item => item.AccountId}
        renderItem={({item}) => <AccountCard account={item} />}
      />
    </View>
  );
};

export default AccountListScreen;
// json-server --watch ./src/assets/data/accounts.json
