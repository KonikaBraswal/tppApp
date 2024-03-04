import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Searchbar} from 'react-native-paper';
import {Surface} from '@react-native-material/core';
import LocalAccountDetails from '../components/LocalAccountDetails';
import DropdownWithCheckboxes from '../components/DropdownWithCheckboxes';
import SortDropdown from '../components/SortDropdown';
import LocalTransactionList from '../components/LocalTransactionList';
import {fetchRefreshedToken, RetrieveData} from '../../database/Database';
import ApiFactory from '../../ApiFactory_AISP/ApiFactory';
const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');
const ViewDetailsWithRefreshToken = ({route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const AccountId = route.params.AccountId;
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [balanceDetails, setBalanceDetails] = useState(null);
  const [retrievedData, setRetrievedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterDataByScope = data => {
    return data.filter(obj => obj.scope === 'accounts');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const refresh_token = await fetchRefreshedToken(1001);
        //  console.log(refresh_token);
        const access_token = await sandboxApiClient.refreshToken(refresh_token);

        const databaseResponse = await RetrieveData();
        const filteredData = filterDataByScope(databaseResponse);
        setRetrievedData(filteredData);
        const permissions =
          filteredData && filteredData[0] && filteredData[0].consentpayload
            ? JSON.parse(filteredData[0].consentpayload).Permissions
            : null;
        console.log(permissions);

        const accountResponse =
          await sandboxApiClient.fetchAccountsWithRefreshToken(access_token);
        setAccountDetails(accountResponse);

        if (
          permissions.includes('ReadTransactionsDetail') &&
          (permissions.includes('ReadTransactionsCredits') ||
            permissions.includes('ReadTransactionsDebits'))
        ) {
          const transactionResponse =
            await sandboxApiClient.allCallsWithRefreshToken(
              `${AccountId}/transactions`,
              access_token,
            );
          setTransactionDetails(transactionResponse);
        }

        if (permissions.includes('ReadBalances')) {
          const balanceResponse =
            await sandboxApiClient.allCallsWithRefreshToken(
              `${AccountId}/balances`,
              access_token,
            );
          setBalanceDetails(balanceResponse);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [AccountId]);

  const SelectedAccount = accountDetails?.Account.find(
    account => account.AccountId === AccountId,
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={50} color="green" />
          <Text style={{fontSize: 18}}>We Are Fetching Your Data</Text>
        </View>
      ) : (
        <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
          <View style={styles.rowContainer}>
            <Surface elevation={6} category="medium" style={styles.surface}>
              <Image
                source={require('../assets/images/natwest.png')}
                style={styles.icon}
              />
            </Surface>
            <DropdownWithCheckboxes />
          </View>
          {SelectedAccount && (
            <LocalAccountDetails
              account={SelectedAccount}
              balance={balanceDetails?.Balance}
            />
          )}
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
            {transactionDetails ? (
              <LocalTransactionList transactionDetails={transactionDetails} />
            ) : (
              <Text style={styles.statusText}>
                Need Permissions To Show Transactions
              </Text>
            )}
          </View>
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
    color: 'green',
  },
});
export default ViewDetailsWithRefreshToken;
