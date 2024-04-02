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
import readBarclaysAccount from '../assets/data/barclaysAccounts.json';
import readBarclaysBalance from '../assets/data/barclaysBalances.json';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.93;
const ViewBarclaysAccounts = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const BarclaysAccountData = readBarclaysAccount?.Data?.Account;
  const BarclaysBalanceData = readBarclaysBalance?.Data?.Balance;

  const filteredAccounts = BarclaysAccountData.filter(account =>
    account.AccountId.includes(searchQuery),
  );
  const findAccountBalances = accountId => {
    const foundBalances = BarclaysBalanceData.filter(
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
          <View style={styles.rowContainer}></View>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            {filteredAccounts.map(account => (
              <Card key={account.AccountId} style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Title style={styles.title}>
                      {account.AccountSubType} Account
                    </Title>
                    <Image
                      source={require('../assets/images/barclays2.png')}
                      style={styles.icon}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                      <Paragraph>{account.AccountId}</Paragraph>
                      <Paragraph>{account.Account[0].Name}</Paragraph>
                      <Paragraph>
                        Balance:
                        {findAccountBalances(account.AccountId)?.[0]?.Amount
                          ?.Amount ?? 0}
                        <Text> GBP</Text>
                      </Paragraph>
                    </View>
                    <Card.Actions>
                      <IconButton
                        icon="chevron-right"
                        size={24}
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
    width: '100%',
    padding: wp('2%'),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  scrollContainer: {
    flex: 1,
    padding: wp('1%'),
  },
  card: {
    marginBottom: hp('2%'),
    backgroundColor: '#c8e1cc',
    width: cardWidth,
  },
  icon: {
    width: wp('14.5%'),
    height: wp('14.5%'),
    resizeMode: 'contain',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginRight: -wp('1%'),
    marginLeft: wp('1%'),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('1%'),
  },
  textContainer: {
    flex: 1,
    marginTop: -hp('1%'),
  },
  footer: {
    backgroundColor: '#5a287d',
    padding: wp('4.2%'),
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
});

export default ViewBarclaysAccounts;
