import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
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
    <View style={{padding: 4, marginVertical: 8}}>
      {loading ? (
        <>
          <ActivityIndicator size="small" color="green" />
          <Text
            style={{
              textAlign: 'center',
              marginTop: 10,
              fontWeight: 'bold',
            }}>
            Fetching Transactions
          </Text>
        </>
      ) : transactions?.Transaction ? (
        transactions.Transaction.map(transaction => (
          <TransactionCard
            key={transaction.TransactionId}
            transaction={transaction}
          />
        ))
      ) : (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            marginTop: 10,
            fontWeight: 'bold',
            color: 'green',
          }}>
          {transactionText}
        </Text>
      )}
    </View>
  );
};

export default TransactionList;
