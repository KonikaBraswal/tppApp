import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import TransactionCard from './TransactionCard';
import ApiFactory from '../../ApiFactory/ApiFactory';
const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');
const TransactionList = props => {
  const permissions = props.permissions;
  const AccountId = props.accountId;
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionText, setTransactionText] = useState(
    'No Transactions Found',
  );
  useEffect(() => {
    const fetchTransaction = async () => {
      if (
        permissions.includes('ReadTransactionsDetail') &&
        (permissions.includes('ReadTransactionsCredits') ||
          permissions.includes('ReadTransactionsDebits'))
      ) {
        try {
          const response = await sandboxApiClient.allCalls(
            `${AccountId}/transactions`,
          );
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
    fontSize: 18,
    marginTop: hp('2%'),
    fontWeight: 'bold',
    color: 'green',
  },
});
export default TransactionList;
