import React, {useState, useEffect} from 'react';
import {Card, Title, Text, Divider} from 'react-native-paper';
import {StyleSheet, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import balanceData from '../../DatabaseFactory/MockData/localbalance.json';

import {Surface, Button} from '@react-native-material/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {IconButton} from 'react-native-paper';
import ApiFactory from '../../ApiFactory/ApiFactory';
let env="";
const switchEnvironment = (newEnv) => {
  global.env = newEnv; // Update the global environment variable
  const apiFactory = new ApiFactory();
  const apiClient = apiFactory.createApiClient(global.env,"accounts");
  return apiClient;
  // Use the new apiClient as needed
 };

const AccountCard = props => {
  useEffect(() => {
    const newApiClient = switchEnvironment(global.env);
    env=newApiClient;    
    return () => {
    };
  }, []);
  const navigation = useNavigation();
  const accountId = props.item.AccountId;
  const permissions = props.permissions;

  const [accountBalance, setAccountBalance] = useState(null);


  useEffect(() => {
    const fetchBalance = async () => {
      if (permissions.includes('ReadBalances')) {
        if(global.env=='local'){
          console.log("%%%%%%%%%%%%%%%%555")
          setAccountBalance(balanceData);
          console.log(balanceData);
        }
        else{
        try {
          console.log("sandbox all calls");
          console.log(env);
          const response = await env.allCalls(
            `${accountId}/balances`,
          );
          console.log(response);
          setAccountBalance(response);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    }
    };
    fetchBalance();
  }, [accountId]);
 
  const handleCardClick = async accountId => {
    navigation.navigate('Details', {
      accountDetails: props.item,
      permissions: permissions,
    });
  };

  const item = props.item;
  return (
    <View style={styles.container}>
      <Surface style={styles.card}>
        <View style={styles.text}>
          <Text key={item.AccountId} style={styles.text}>
            {`${item.AccountSubType}`}
          </Text>
          <Text style={styles.smalltext}>{item.Nickname}</Text>
          <Text style={{marginTop: hp('1%')}}>{`${item.AccountId}`}</Text>
          {permissions.includes('ReadBalances') ? (
            <Text style={{marginTop: hp('1%')}}>
              Balance:
              {accountBalance?.Balance?.[0]?.Amount?.Amount ?? 0}
              <Text> GBP</Text>
            </Text>
          ) : (
            <Text></Text>
          )}
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/images/natwest2.png')}
            style={styles.iconNatwest}
          />
          <IconButton
            icon="chevron-right"
            mode="outlined"
            iconColor={'black'}
            size={wp('7%')}
            style={{marginTop: hp('1.5%'), marginLeft: wp('3.5%')}}
            onPress={() => handleCardClick(item.AccountId)}
          />
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp('2%'),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: wp('4%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2%'),
    elevation: 6,
    backgroundColor: '#c8e1cc',
    width: wp('96%'),
  },
  text: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginVertical: hp('1%'),
  },
  smalltext: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginVertical: hp('0.75%'),
  },
  iconContainer: {
    marginLeft: -wp('9%'),
    // marginRight: wp('2%'),
    marginTop: hp('2%'),
  },
  iconNatwest: {
    width: wp('16%'),
    height: wp('16%'),
    marginBottom: hp('1%'),
    resizeMode: 'contain',
  },
});

export default AccountCard;
