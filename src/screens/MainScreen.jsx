import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {Surface} from '@react-native-material/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AccountDetails from '../components/AccountDetails';
import DropdownWithCheckboxes from '../components/DropdownWithCheckboxes';
import TransactionList from '../components/TransactionList';
import SortDropdown from '../components/SortDropdown';
import ApiFactory from '../../ApiFactory/ApiFactory';

const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const MainScreen = ({route}) => {
  const accountDetails = route.params.accountDetails;
  const permissions = route.params.permissions;
  const {AccountId} = route.params.accountDetails;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
        <View style={styles.rowContainer}>
          {/* <Surface elevation={6} category="medium" style={styles.surface}>
            <Image
              source={require('../assets/icons/natwest.png')}
              style={styles.icon}
            />
          </Surface> */}
          {/* <DropdownWithCheckboxes /> */}
        </View>
        <AccountDetails account={accountDetails} permissions={permissions} />

        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsHeaderText}>Transactions</Text>
            <SortDropdown />
          </View>
          <Searchbar
            placeholder="Search Transaction"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <TransactionList accountId={AccountId} permissions={permissions} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    padding: wp('1%'),
    marginVertical: hp('1%'),
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surface: {
    width: wp('17%'),
    height: wp('17%'),
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp('3%'),
  },
  icon: {
    width: wp('16%'),
    height: wp('16%'),
    resizeMode: 'contain',
    marginVertical: wp('1.2%'),
  },
  transactionsContainer: {
    flexDirection: 'column',
    backgroundColor: '#c8e1cc',
    borderRadius: wp('2%'),
    padding: wp('1%'),
    margin: wp('2%'),
    shadowOpacity: 0.3,
    elevation: 3,
    shadowColor: '#000',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginLeft: wp('3%'),
    marginRight: wp('3%'),
  },
  transactionsHeaderText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'black',
  },
  searchbar: {
    borderRadius: wp('2%'),
    width: '95%',
    marginTop: hp('1%'),
    alignSelf: 'center',
  },
});

export default MainScreen;
