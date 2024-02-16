import React, {useEffect, useState} from 'react';
import {Card, Title, Text, Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import ApiFactory from '../../ApiFactory/ApiFactory';

const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const AccountDetails = props => {
  const {
    AccountId,
    AccountSubType,
    AccountType,
    Currency,
    Description,
    Nickname,
    Account,
  } = props.account;
  const permissions = props.permissions;
  const [balanceDetails, setBalanceDetails] = useState(null);
  useEffect(() => {
    const fetchBalance = async () => {
      if (permissions.includes('ReadBalances')) {
        try {
          const response = await sandboxApiClient.allCalls(
            `${AccountId}/balances`,
          );
          setBalanceDetails(response);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }, [AccountId]);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={{color: 'black'}}>{AccountType} Account</Text>
        <Text style={styles.title}>{AccountSubType} Account</Text>
        <Text style={styles.text}>{AccountId}</Text>
        {permissions.includes('ReadBalances') ? (
          <Text style={{fontSize: 16, marginVertical: 2, fontWeight: 'bold'}}>
            Available Balance:{' '}
            {balanceDetails?.Balance?.[0]?.Amount?.Amount ??
              props?.balance?.[0]?.Amount?.Amount ??
              0}
            GBP
          </Text>
        ) : (
          <Text></Text>
        )}
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

export default AccountDetails;
