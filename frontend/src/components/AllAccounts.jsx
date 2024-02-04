import React, {useEffect, useState} from 'react';
import {Checkbox, Icon,Searchbar} from 'react-native-paper';
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,Text
} from 'react-native';
import {ListItem, Button, Surface} from '@react-native-material/core';
import BarclaysComponent from './AccountLists/BarclaysAccounts';
import NatwestAccounts from './AccountLists/NatwestAccounts';
import BarclaysAccounts from './AccountLists/BarclaysAccounts';
import LloydsAccounts from './AccountLists/LloydsAccounts';
import MonzoAccounts from './AccountLists/MonzoAccounts';
import SantanderAccounts from './AccountLists/SantanderAccounts';
import StarlingAccounts from './AccountLists/StarlingAccounts';
import RevolutAccounts from './AccountLists/RevolutAccounts';
import { useNavigation } from '@react-navigation/native';

const AllAccounts = ({route}) => {
  const navigation=useNavigation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkedBanks, setCheckedBanks] = useState({
    natwest: false,
    barclays: false,
    lloyds: false,
    santander: false,
    starling: false,
    revolut: false,
    monzo: false,
  });

  const banks = [
    'Natwest',
    'Barclays',
    'Lloyds',
    'Santander',
    'Starling',
    'Revolut',
    'Monzo',
  ];
  console.log(route.params);
  const selectedBank = route.params.selectedBank;
  const selectedIcon = route.params.selectedIcon;
  const accounts = route.params.accounts;
  const transactions = route.params.transactions;
  const balances = route.params.balances;
  // useEffect(() => {
  //   setCheckedBanks(prevState => ({
  //     ...prevState,
  //     [selectedBank.toLowerCase()]: true,
  //   }));
  // }, [selectedBank]);

  // const toggleDropdown = () => {
  //   setShowDropdown(!showDropdown);
  // };

  // const handleCheck = bank => {
  //   setCheckedBanks(prevState => ({
  //     ...prevState,
  //     [bank]: !prevState[bank],
  //   }));
  // };
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
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
            <View style={styles.searchBarContainer}>
            </View>
          </View>
          <ScrollView style={styles.scrollContainer}>
          <NatwestAccounts
                  accountsList={accounts}
                  transactionsList={transactions}
                  balancesList={balances}
                />
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a28d',
  },
  surface: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  icon: {
    width: 50,
    height: 50,
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
  mainContent: {
    flex: 1,
    width: '100%',
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
    width: 385,
    margin:10,
   
  },
  searchBarContainer: {marginLeft: 2, backgroundColor:'#5a287d'},
  scrollContainer: {
    flex: 1,
    padding: 2,
  },
  // card: {
  //   marginBottom: 16,
  //   backgroundColor: '#c8e1cc',
  // },
  // surface: {
  //   width: 60,
  //   height: 60,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   margin: 10,
  // },
  iconNatwest: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  // iconBarclays: {
  //   width: 60,
  //   height: 60,
  //   resizeMode: 'contain',
  // },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

});


export default AllAccounts;
