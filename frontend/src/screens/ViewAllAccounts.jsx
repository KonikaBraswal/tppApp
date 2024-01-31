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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  IconButton,
} from 'react-native-paper';
import readAccount from '../assets/data/accounts.json';
import readBalance from '../assets/data/balances.json';

const ViewAllAccounts = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState([]);

  const accountData = readAccount?.Data?.Account;
  const balanceData = readBalance?.Data?.Balance;
  useEffect(() => {
    setAccounts(accountData);
    setBalances(balanceData);
  }, []);

  const filteredAccounts = accounts.filter(account =>
    account.AccountId.includes(searchQuery),
  );
  const findAccountBalance = accountId => {
    const foundBalance = balances.find(
      balance => balance.AccountId === accountId,
    );

    if (foundBalance && foundBalance.Amount) {
      return foundBalance.Amount.Amount;
    } else {
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.rowContainer}>
            <View style={styles.searchBarContainer}>
              <Searchbar
                placeholder="Search Bank Account"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
              />
            </View>
          </View>
          <ScrollView style={styles.scrollContainer}>
            {filteredAccounts.map(account => (
              <Card key={account.AccountId} style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Title
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        marginTop: -10,
                      }}>
                      {account.AccountSubType} Account
                    </Title>
                    <Image
                      source={require('../assets/images/natwest2.png')}
                      style={styles.icon}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{marginTop: -10}}>
                      <Paragraph>{account.AccountId}</Paragraph>
                      <Paragraph>{account.Account[0].Name}</Paragraph>
                      <Paragraph>
                        Balance:{findAccountBalance(account.AccountId)} GBP
                      </Paragraph>
                    </View>
                    <Card.Actions>
                      <IconButton
                        icon="chevron-right"
                        size={24}
                        color="#5a287d"
                        onPress={() => {
                          // Handle chevron icon press
                        }}
                        style={{marginRigh: -15}}
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
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  searchBar: {
    height: 62,
    borderRadius: 0,
    width: 373,
  },
  searchBarContainer: {margin: 2},
  scrollContainer: {
    flex: 1,
    padding: 2,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#c8e1cc',
  },
  surface: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  footer: {
    backgroundColor: '#5a287d',
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default ViewAllAccounts;
