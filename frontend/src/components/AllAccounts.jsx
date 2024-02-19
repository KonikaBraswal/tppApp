import React, {useEffect, useState} from 'react';
import {Checkbox, Icon, Searchbar} from 'react-native-paper';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import BarclaysComponent from './AccountLists/BarclaysAccounts';
import NatwestAccounts from './AccountLists/NatwestAccounts';
import BarclaysAccounts from './AccountLists/BarclaysAccounts';
import LloydsAccounts from './AccountLists/LloydsAccounts';
import MonzoAccounts from './AccountLists/MonzoAccounts';
import SantanderAccounts from './AccountLists/SantanderAccounts';
import StarlingAccounts from './AccountLists/StarlingAccounts';
import RevolutAccounts from './AccountLists/RevolutAccounts';
import {useNavigation} from '@react-navigation/native';

const AllAccounts = ({route}) => {
  const navigation = useNavigation();
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

  const selectedBank = route.params.selectedBank;
  const selectedIcon = route.params.selectedIcon;
  const accounts = route.params.accounts;
  const permissions = route.params.permissions;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View style={styles.headerContainer}>
          <Searchbar
            placeholder="Search account by ID"
            onChangeText={setSearchQuery}
            value={searchQuery}
            icon={() => <Icon source="magnify" color="black" size={wp('5%')} />}
            style={styles.searchBar}
          />
        </View>
        <View style={styles.container}>
          <ScrollView style={styles.scrollContainer}>
            <NatwestAccounts
              accountsList={accounts}
              permissions={permissions}
            />
          </ScrollView>
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
  headerContainer: {
    backgroundColor: '#5a287d',
    padding: wp('2%'),
  },
  container: {
    flex: 1,

    paddingTop: hp('1%'),
  },
  footer: {
    backgroundColor: '#5a287d',
    padding: wp('4.2%'),
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
  searchBar: {
    borderRadius: wp('2%'),
    backgroundColor: '#f4ebfe',
  },
  scrollContainer: {
    flex: 1,
    padding: wp('1%'),
  },
});

export default AllAccounts;
