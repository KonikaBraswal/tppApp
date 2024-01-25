import React from 'react';
import {Card, Title, Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const TransactionCard = ({transaction}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>
          Transaction Information: {transaction.TransactionInformation}
        </Title>
        <Text style={styles.text}>
          Transaction Date:{' '}
          {new Date(transaction.BookingDateTime).toLocaleString()}
        </Text>
        <Text style={styles.text}>
          {transaction.CreditDebitIndicator}ed from {transaction.AccountId}
        </Text>
        <Text style={styles.text}>
          Transaction ID: {transaction.TransactionId}
        </Text>
        <Text style={styles.text}>
          Amount: {transaction.Amount.Amount} {transaction.Amount.Currency}
        </Text>
        <Text style={styles.text}>
          Balance: {transaction.Balance.Amount.Amount}{' '}
          {transaction.Amount.Currency}
        </Text>
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
    shadowOffset: {width: 1, height: 1}, // for iOS
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

export default TransactionCard;
