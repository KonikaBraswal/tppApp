import React from 'react';
import {Card, Title, Text, Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const LocalAccountDetails = props => {
  const {
    AccountId,
    AccountSubType,
    AccountType,
    Currency,
    Description,
    Nickname,
    Account,
  } = props.account;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={{color: 'black'}}>{AccountType} Account</Text>
        <Text style={styles.title}>{AccountSubType} Account</Text>
        <Text style={styles.text}>{AccountId}</Text>
        <Text style={{fontSize: 16, marginVertical: 2, fontWeight: 'bold'}}>
          Available Balance: {props?.balance?.[0]?.Amount?.Amount ?? 0} GBP
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 5,
    borderRadius: 8,
    elevation: 3, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {width: 1, height: 1}, // for iOS
    shadowOpacity: 0.3, // for iOS
    backgroundColor: '#c8e1cc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default LocalAccountDetails;
