import React, {useEffect, useState} from 'react';
import {Card, Title, Text, Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
        <Text style={styles.accountType}>{AccountType} Account</Text>
        <Text style={styles.title}>{AccountSubType} Account</Text>
        <Text style={styles.text}>{AccountId}</Text>
        {permissions.includes('ReadBalances') ? (
          <Text style={styles.balanceText}>
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
    marginHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    padding: wp('2%'),
    borderRadius: wp('2%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    backgroundColor: '#c8e1cc',
  },
  accountType: {
    fontSize: wp('4%'),
    color: 'black',
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginVertical: hp('1%'),
  },
  text: {
    fontSize: wp('4%'),
    marginVertical: hp('0.5%'),
  },
  balanceText: {
    fontSize: wp('4%'),
    marginVertical: hp('0.5%'),
    fontWeight: 'bold',
  },
});

export default AccountDetails;
