import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {Searchbar,IconButton,Divider} from 'react-native-paper';
import {Card} from 'react-native-paper';
import {Surface} from '@react-native-material/core';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AccountDetails from '../components/AccountDetails';
import DropdownWithCheckboxes from '../components/DropdownWithCheckboxes';
import TransactionList from '../components/TransactionList';
import SortDropdown from '../components/SortDropdown';
import ApiFactory from '../../ApiFactory_AISP/ApiFactory';
import readbalanceData from '../assets/data/balances.json';
import readaccountData from '../assets/data/accounts.json';
import readtransactionData  from '../assets/data/transactions.json' ;
const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
// const sandboxApiClient = apiFactory.createApiClient(global.env);
export  const TransactionsforLocal = () => {
//   const accountDetails = route.params.accountDetails;
//   const permissions = route.params.permissions;
//   const {AccountId} = route.params.accountDetails;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
        <View style={styles.rowContainer}>
          <Surface elevation={6} category="medium" style={styles.surface}>
            <Image
              source={require('../assets/icons/natwest.png')}
              style={styles.mainicon}
            />
          </Surface>
          <DropdownWithCheckboxes />
        </View>
        <Card style={styles.maincard}>
      <Card.Content >
        <Text style={styles.accountType}>{readaccountData.Data.Account[1].AccountType} Account</Text>
        <Text style={styles.maintitle}>{readaccountData.Data.Account[1].AccountSubType} Account</Text>
        <Text style={styles.maintext}>{readaccountData.Data.Account[1].AccountId}</Text>
          <Text style={styles.balanceText}>
            Available Balance:
            {readbalanceData.Data.Balance[1].Amount.Amount}
            {readbalanceData.Data.Balance[1].Amount.Currency}
          </Text>
      </Card.Content>
    </Card>

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
          {/* <TransactionList accountId={AccountId} permissions={permissions} /> */}
          <View style={styles.transcontainer}>
          {readtransactionData.Data.Transaction.map((transaction,index) => (
 <Card key={index} style={styles.card}>
    <Card.Content>
      <View style={styles.transactionRow}>
        <View style={styles.transactionDetail}>
          {transaction.CreditDebitIndicator === 'Debit' ? (
            <IconButton
              icon="arrow-top-right"
              mode="contained-tonal"
              iconColor="red"
              style={styles.icon}
              size={wp('5%')}
            />
          ) : (
            <IconButton
              icon="arrow-bottom-left"
              mode="contained-tonal"
              iconColor="green"
              style={styles.icon}
              size={wp('5%')}
            />
          )}
          <Text style={styles.indicatorText}>
            {transaction.CreditDebitIndicator}ed
          </Text>
        </View>
        <Text style={styles.amountText}>
          {transaction.Amount.Currency} {transaction.Amount.Amount}
        </Text>
      </View>
    </Card.Content>

    <Divider style={styles.divider} />

    <Card.Content>
      <View>
        <Text style={styles.title}>{transaction.TransactionInformation}</Text>
        <Text style={styles.text}>{transaction.AccountId}</Text>
        <Text style={styles.text}>
          Transaction ID: {transaction.TransactionId}
        </Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.text}>
            {new Date(transaction.BookingDateTime).toLocaleDateString()}
          </Text>
          <Text style={styles.text}>
            {new Date(transaction.BookingDateTime).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </Card.Content>
 </Card>

))}

    </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
    card: {
        margin: wp('1%'),
        padding: wp('1%'),
        borderRadius: wp('1%'),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.3,
      },  transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },  transactionDetail: {
        flexDirection: 'row',
        marginLeft: wp('1%'),
      }, icon: {
        fontWeight: 'bold',
        marginLeft: -wp('1.5%'),
      },  indicatorText: {
        color: '#5a287d',
        fontSize: wp('4.6%'),
        fontWeight: 'bold',
        marginTop: hp('1.2%'),
        marginLeft: wp('1%'),
      },  amountText: {
        fontWeight: 'bold',
        fontSize: wp('4%'),
      },  divider: {
        borderBottomWidth: wp('0.6%'),
        borderBottomColor: '#d3d3d3',
        margin: wp('0.8%'),
      },
      title: {
        fontSize: wp('4.4%'),
        fontWeight: 'bold',
        marginVertical: hp('1%'),
      },
      text: {
        fontSize: wp('3.6%'),
        marginVertical: hp('0.5%'),
      },
      dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1%'),
      },
      transcontainer:{
        padding: 4,
        marginVertical: hp('1%'),
      },
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
      mainicon:{
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
      maincard: {
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
      maintitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        marginVertical: hp('1%'),
      },
      maintext: {
        fontSize: wp('4%'),
        marginVertical: hp('0.5%'),
      },
      balanceText: {
        fontSize: wp('4%'),
        marginVertical: hp('0.5%'),
        fontWeight: 'bold',
      },

});


