import React from 'react';
import {
  Card,
  Title,
  Text,
  Divider,
  IconButton,
  MD3Colors,
} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

const TransactionCard = ({transaction}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', marginLeft: -10}}>
            {transaction.CreditDebitIndicator === 'Debit' ? (
              <IconButton
                icon="arrow-top-right"
                mode="contained-tonal"
                iconColor="red"
                size={20}
              />
            ) : (
              <IconButton
                icon="arrow-bottom-left"
                mode="contained-tonal"
                iconColor="green"
                size={20}
              />
            )}
            <Text
              style={{
                color: '#5a287d',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 9,
                marginLeft: 5,
              }}>
              {transaction.CreditDebitIndicator}ed
            </Text>
          </View>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            {transaction.Amount.Currency} {transaction.Amount.Amount}
          </Text>
        </View>
      </Card.Content>

      <Divider
        bold="true"
        style={{borderBottomWidth: 3, borderBottomColor: '#d3d3d3', margin: 3}}
      />
      <Card.Content>
        <View>
          <Text style={styles.title}>{transaction.TransactionInformation}</Text>
          <Text style={styles.text}>{transaction.AccountId}</Text>
          <Text style={styles.text}>
            Transaction ID: {transaction.TransactionId}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={styles.text}>
              {new Date(transaction.BookingDateTime).toLocaleDateString()}
            </Text>
            <Text style={styles.text}>
              {new Date(transaction.BookingDateTime).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 6,
    padding: 3,
    borderRadius: 8,
    elevation: 3, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: {width: 1, height: 1}, // for iOS
    shadowOpacity: 0.3, // for iOS
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
    marginVertical: 3,
  },
});

export default TransactionCard;
