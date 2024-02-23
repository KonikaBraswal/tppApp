import React from 'react';
import {Card, Title, Text, Button} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
        <Text style={styles.accountType}>{AccountType} Account</Text>
        <Text style={styles.title}>{AccountSubType} Account</Text>
        <Text style={styles.text}>{AccountId}</Text>
        {props?.balance?.[0]?.Amount?.Amount ? (
          <Text style={styles.balanceText}>
            Available Balance:
            {props?.balance?.[0]?.Amount?.Amount ?? 0}
            GBP
          </Text>
        ) : (
          <Text style={styles.balanceText}></Text>
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
export default LocalAccountDetails;
