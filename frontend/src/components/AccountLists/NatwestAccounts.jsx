import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {Surface} from '@react-native-material/core';
import axios from 'axios';
import read from '../../jsonfiles/accounts.json';
import AccountCard from '../AccountCard';
import { useNavigation } from '@react-navigation/native';

const NatwestAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  // useEffect(() => {
  //   setAccounts(read?.Account);
  // }, []);
  useEffect(() => {
    async function fetchData() {
      axios
        .get('http://192.168.1.2:3000/Data')
        .then(response => setAccounts(response.data.Account))
        .catch(error => console.error('Error fetching account data:', error));
    }
    fetchData();
  }, []);
  return (
    <View>
      <Surface elevation={6} category="medium" style={styles.surface}>
        <Image
          source={require('../../assets/icons/natwest.png')}
          style={styles.icon}
        />
      </Surface>
      <FlatList
        data={accounts}
        renderItem={({item}) => <AccountCard item={item} />}
        keyExtractor={item => item.AccountId.toString()}
      />
    </View>
  );
};

export default NatwestAccounts;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a28d',
  },
  surface: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
