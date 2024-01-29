import React, {useState, useEffect} from 'react';
import {Card, Title, Text, Divider} from 'react-native-paper';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Surface, Button} from '@react-native-material/core';
import axios from 'axios';
import read from '../jsonfiles/accounts.json';
import {Icon} from 'react-native-paper';

const AccountCard = ({item}) => {
  const navigation = useNavigation();
  const [accounts, setAccounts] = useState([]);
  const handleCardClick = () => {
    navigation.navigate('Details', {accountDetails: accounts});
  };

  useEffect(() => {
    axios
      .get('http://192.168.1.2:3000/Data')
      .then(response => {
        setAccounts(response.data.Account);
      })
      .catch(error => console.error('Error in fetching account data:', error));
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCardClick}>
        <Surface style={styles.card}>
          <View style={styles.text}>
            <Text key={item.AccountId} style={styles.text}>
              {item.Nickname}
            </Text>
            <Text style={styles.smalltext}>
              {`${item.AccountType}`} {`${item.AccountSubType}`}
            </Text>
            <Text>{`${item.AccountId}`}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon source="chevron-double-right" color="black" size={30} />
          </View>
        </Surface>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: '#c8e1cc',
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  smalltext: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  iconContainer: {
    marginLeft: 'auto',
    marginRight: 10, // Add some margin to the right to adjust the position
  },
});

export default AccountCard;
// json-server --watch ./src/assets/data/balances.json --port 3001
