import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import axios from 'axios';

const AccountCard = ({ account }) => {
const [balances, setBalances] = useState([]);

useEffect(() => {
      axios.get('http://192.168.1.5:3001/Data')
      .then((response) =>{ 
        setBalances(response.data) ;
       // console.log(balances);
    })
      .catch(error => console.error('Error in fetching balance data:', error));
  }, []);
  

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{account.Nickname}</Title>
        <Text style={styles.text}>Account ID: {account.AccountId}</Text>
        <Text style={styles.text}>Account Type: {account.AccountType}</Text>
        <Text style={styles.text}>Sub Type: {account.AccountSubType}</Text>
       
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
    card: {
      margin: 6,
      padding: 10,
      borderRadius: 8,
      elevation: 3, // for Android
      shadowColor: '#000', // for iOS
      shadowOffset: { width: 1, height: 1 }, // for iOS
      shadowOpacity: 0.3, // for iOS
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    text: {
      fontSize: 14,
      marginVertical: 2,
    },
  });
  
export default AccountCard;
// json-server --watch ./src/assets/data/balances.json --port 3001