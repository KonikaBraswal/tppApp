import React, {useState, useEffect} from 'react';
import {Card, Title, Text, Divider} from 'react-native-paper';
import {StyleSheet, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Surface, Button} from '@react-native-material/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {IconButton} from 'react-native-paper';
import ApiFactory from '../../ApiFactory_AISP/ApiFactory';

const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const AccountCard = props => {
  const navigation = useNavigation();
  const accountId = props.item.AccountId;
  const permissions = props.permissions;

  const [accountBalance, setAccountBalance] = useState(null);
  useEffect(() => {
    const fetchBalance = async () => {
      if (permissions.includes('ReadBalances')) {
        try {
          const response = await sandboxApiClient.allCalls(
            `${accountId}/balances`,
          );
          setAccountBalance(response);
        } catch (error) {
          console.error('Error fetching balance:', error);
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
    padding: wp('4%'),
    borderRadius: wp('2%'),
    elevation: 6,
    backgroundColor: '#c8e1cc',
    width: wp('94%'),
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
    marginLeft: wp('3%'),
    marginRight: wp('2%'),
    marginTop: hp('1%'),
  },
  iconNatwest: {
    width: wp('16%'),
    height: wp('16%'),
    marginBottom: hp('1%'),
    resizeMode: 'contain',
  },
});

export default AccountCard;
