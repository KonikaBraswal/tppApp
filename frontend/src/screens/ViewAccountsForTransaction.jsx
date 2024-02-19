import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  IconButton,
  Icon,
} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import readNatwestAccount from '../assets/data/accounts.json';
import readNatwestBalance from '../assets/data/balances.json';
import readBarclaysAccount from '../assets/data/barclaysAccounts.json';
import readBarclaysBalance from '../assets/data/barclaysBalances.json';
const {width} = Dimensions.get('window');
const cardWidth = width * 0.93;
const ViewAccountsForTransaction = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const NatwestAccountData = readNatwestAccount?.Data?.Account;
  const NatwestBalanceData = readNatwestBalance?.Data?.Balance;
  const BarclaysAccountData = readBarclaysAccount?.Data?.Account;
  const BarclaysBalanceData = readBarclaysBalance?.Data?.Balance;
  const mergedAccounts = [...NatwestAccountData, ...BarclaysAccountData];
  const mergedBalances = [...NatwestBalanceData, ...BarclaysBalanceData];

  const filteredAccounts = mergedAccounts.filter(account =>
    account.AccountId.includes(searchQuery),
  );
  const findAccountBalances = accountId => {
    const foundBalances = mergedBalances.filter(
      balance => balance.AccountId === accountId,
    );

    if (foundBalances.length > 0) {
      return foundBalances;
    } else {
      return null;
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View
        style={{
          backgroundColor: '#5a287d',
          padding: 10,
        }}>
        {/* //changed searchBar */}
        <Searchbar
          placeholder="Search account by ID"
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon={() => <Icon source="magnify" color="black" size={20} />}
          style={{
            borderRadius: 5,
            backgroundColor: '#f4ebfe',
          }}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.rowContainer}>
            <View style={styles.searchBarContainer}></View>
          </View>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            {filteredAccounts.map(account => (
              <Card key={account.AccountId} style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Title style={[styles.title, {marginTop: -10}]}>
                      {account.AccountSubType} Account
                    </Title>

                    {BarclaysAccountData.find(
                      barclaysAccount =>
                        barclaysAccount.AccountId === account.AccountId,
                    ) ? (
                      <Image
                        source={require('../assets/images/barclays2.png')}
                        style={styles.iconBarclays}
                      />
                    ) : (
                      <Image
                        source={require('../assets/images/natwest2.png')}
                        style={styles.iconNatwest}
                      />
                    )}
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                      <Paragraph>{account.AccountId}</Paragraph>
                      <Paragraph>{account.Account[0].Name}</Paragraph>
                      <Paragraph>
                        Balance:{' '}
                        {findAccountBalances(account.AccountId)?.[0]?.Amount
                          ?.Amount ?? 0}{' '}
                        GBP
                      </Paragraph>
                    </View>
                    <Card.Actions>
                      <IconButton
                        icon="chevron-right"
                        size={22}
                        color="#5a287d"
                        onPress={() => {
                          navigation.navigate('View Details', {
                            AccountId: account.AccountId,
                          });
                        }}
                        style={styles.iconButton}
                      />
                    </Card.Actions>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Select Your Bank');
          }}
          style={styles.footer}
          activeOpacity={1}>
          <Text style={styles.footerText}>Add New Bank Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  searchBar: {
    height: hp('8%'),
    borderRadius: 0,
    width: wp('90%'),
  },
  searchBarContainer: {
    margin: wp('1%'),
  },
  scrollContainer: {
    flex: 1,
    padding: wp('1%'),
  },
  card: {
    marginBottom: hp('2%'),
    backgroundColor: '#c8e1cc',
    borderRadius: wp('2%'),
    elevation: 3,
    width: cardWidth,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
  },
  iconBarclays: {
    width: wp('14.5%'),
    height: wp('14.5%'),
    resizeMode: 'contain',
    marginRight: -wp('4.5%'),
    marginLeft: wp('2%'),
  },
  iconNatwest: {
    width: wp('14.5%'),
    height: wp('14.5%'),
    resizeMode: 'contain',
    marginRight: -wp('4.5%'),
    marginLeft: wp('2%'),
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: wp('3%'),
  },
  textContainer: {
    flex: 1,
  },
  iconButton: {
    marginRight: -wp('4.5%'),
    marginLeft: wp('2%'),
  },
  footer: {
    backgroundColor: '#5a287d',
    padding: wp('4.2%'),
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
});

export default ViewAccountsForTransaction;
