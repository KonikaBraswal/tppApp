import React, { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text, ActivityIndicator } from 'react-native-paper';
import DropdownWithCheckboxes from '../../components/DropdownWithCheckboxes';
import SortDropdown from '../../components/SortDropdown';
import { Searchbar } from 'react-native-paper';
import { Surface } from '@react-native-material/core';
import VrpDebitor from '../../components/VrpDebitor';
import { fetchTransactionsForUserConsent } from '../../../database/Database';
import VrpTransactionList from '../../components/VrpTransactionList';
var transactions;
const VrpTransactions = ({ route }) => {
  const {
    transactiondetails
  } = route.params
  
  const [searchQuery, setSearchQuery] = useState('');

  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionText, setTransactionText] = useState('');
  useEffect(()=>{
    if(transactiondetails==null){
      setTransactionText('No Transaction found');
    }
    else{
      console.log("tr",transactiondetails);
      setTransactionDetails(transactiondetails);
      transactiondetails?.map(element => {
        transactions = JSON.parse(element.vrppayload);
      });
      setLoading(false);
    }
    
  },[transactiondetails]);
  console.log("details::", transactions);
  
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={50} color="green" />
          <Text style={{ fontSize: 18 }}>We Are Fetching Your Data</Text>
        </View>
      ) : (
        <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
          <View style={styles.rowContainer}>
            <Surface elevation={6} category="medium" style={styles.surface}>
              <Image
                source={require('../../assets/images/natwest.png')}
                style={styles.icon}
              />
            </Surface>
            <DropdownWithCheckboxes />
          </View>
          {transactiondetails ? (
            <>
            <VrpDebitor
              account={transactions}
            />
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
            {transactiondetails ? (
              <VrpTransactionList transactionDetails={transactiondetails} />
            ) : (
              <Text style={styles.statusText}>
                {transactionText}
              </Text>
            )}
          </View>
          </>
          ) : (
            <Text style={styles.statusText}>
              {transactionText}
            </Text>
          )}
          
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    padding: wp('2%'),
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: hp('2%'),
    fontWeight: 'bold',
    color: 'red',
  },
});
export default VrpTransactions;
