import React, {useEffect, useState} from 'react';
import {Card, Title, Text, Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ApiFactory from '../../ApiFactory/ApiFactory';
import balanceData from '../../DatabaseFactory/MockData/balances.json';
let env="";


const AccountDetails = props => {
  const bankName=props.bankName;
  const switchEnvironment = (newEnv) => {
    global.env = newEnv; // Update the global environment variable
    const apiFactory = new ApiFactory();
    const apiClient = apiFactory.createApiClient(global.env,"accounts",bankName);
    return apiClient;
    // Use the new apiClient as needed
   };
  useEffect(() => {
    const newApiClient = switchEnvironment(global.env);
    env=newApiClient;
    return () => {
    };
  }, []);

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
    if(global.env=='local')
    {
      setBalanceDetails(balanceData.Data);
    }
    else{
    const fetchBalance = async () => {
      if (permissions.includes('ReadBalances')) {
        try {
          const response = await env.allCalls(
            `${AccountId}/balances`,
          );
          setBalanceDetails(response);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    fetchBalance();
  }
  }, [AccountId]);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.accountType}>{AccountType} Account</Text>
        <Text style={styles.title}>{AccountSubType} Account</Text>
        <Text style={styles.text}>{AccountId}</Text>
        {permissions.includes('ReadBalances') ? (
          <Text style={styles.balanceText}>
            Available Balance:
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
