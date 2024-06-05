import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import TransactionCard from './TransactionCard';
import transactionData from '../../DatabaseFactory/MockData/transactions.json';
import ApiFactory from '../../ApiFactory/ApiFactory';
const mode = 'sandbox';
const way = 'web';
let env="";
const TransactionList = props => {
  const bankName=props.bankName;
  const switchEnvironment = (newEnv) => {
    global.env = newEnv; // Update the global environment variable
    const apiFactory = new ApiFactory();
    const apiClient = apiFactory.createApiClient(global.env,"accounts",bankName);
    return apiClient;
    // Use the new apiClient as needed
   };
  useEffect(() => {
    const newApiClient = switchEnvironment(global.env);
    env=newApiClient;  
    return () => {
    };
  }, []);
  const permissions = props.permissions;
  const AccountId = props.accountId;
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionText, setTransactionText] = useState(
    'No Transactions Found',
  );
  useEffect(() => {
    if(global.env==='local'){
      console.log("inside local transactionList",transactionData.Data);
      setTransactionDetails(transactionData.Data);
      setLoading(false);

    }
    else{
    const fetchTransaction = async () => {
      if (
        permissions.includes('ReadTransactionsDetail') &&
        (permissions.includes('ReadTransactionsCredits') ||
          permissions.includes('ReadTransactionsDebits'))
      ) {
        try {
          const response = await env.allCalls(
            `${AccountId}/transactions`,
          );
          console.log("inside TransactionList.jsx",response);
          setTransactionDetails(response);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setTransactionText('Need permissions to show transactions');
      }
    };

    fetchTransaction();
    console.log("inside transactionList.jsx",transactionDetails);
  }
  }, [AccountId]);
  const transactions = transactionDetails;
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="green" />
          <Text style={styles.loadingText}>Fetching Transactions</Text>
        </View>
      ) : transactions?.Transaction ? (
        transactions.Transaction.map(transaction => (
          <TransactionCard
            key={transaction.TransactionId}
            transaction={transaction}
          />
        ))
      ) : (
        <Text style={styles.statusText}>{transactionText}</Text>
      )}
    </View>
  );
};

styles = StyleSheet.create({
  container: {
    padding: 4,
    marginVertical: hp('1%'),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  loadingText: {
    textAlign: 'center',
    marginTop: hp('2%'),
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    fontSize: RFValue(18),
    marginTop: hp('2%'),
    fontWeight: 'bold',
    color: 'green',
  },
});
export default TransactionList;
