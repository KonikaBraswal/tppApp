import React, {useState, useEffect} from 'react';
import {Card, Title, Text, Divider} from 'react-native-paper';
import {StyleSheet, View, TouchableOpacity,Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Surface, Button} from '@react-native-material/core';
import axios from 'axios';
import {IconButton} from 'react-native-paper';

const AccountCard = props => {
  const navigation = useNavigation();
  const handleCardClick = () => {
    navigation.navigate('Details', {
      accountDetails: props.item,
      transactionDetails: props.accountTransactions,
      balanceDetails: props.accountBalance,
    });
  };

  const item = props.item;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCardClick}>
        <Surface style={styles.card}>
        
          <View style={styles.text}>
         
            <Text key={item.AccountId} style={styles.text}>
              {`${item.AccountSubType}`}
            </Text>
            <Text style={styles.smalltext}>{item.Nickname}</Text>
            <Text>{`${item.AccountId}`}</Text>
            <Text>Balance:19129.04 GBP</Text>
          </View>
          <View style={styles.iconContainer}>
          <Image source={require('../assets/images/natwest2.png')}
                      style={styles.iconNatwest}
                    />
            <IconButton
              icon="chevron-right"
              mode="outlined"
              iconColor={'black'}
              size={30}
              style={{marginTop:5}}
            />
          </View>
        </Surface>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: '#c8e1cc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 3,
  },
  smalltext: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 3,
  },
  iconContainer: {
    marginLeft: 15,
    marginRight: 10,
    marginTop:10 // Add some margin to the right to adjust the position
  },
  iconNatwest: {
    width: 55,
    height: 55,
    marginBottom:7,
    resizeMode: 'contain',
  },
});

export default AccountCard;
// json-server --watch ./src/assets/data/balances.json --port 3001
