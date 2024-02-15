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
  const AccountId = props.accountId;
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTransaction = async () => {
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
      ) : transactions ? (
        transactions.Transaction.map(transaction => (
          <TransactionCard
            key={transaction.TransactionId}
            transaction={transaction}
          />
        ))
      ) : (
        <Text style={{textAlign: 'center', fontSize: 18}}>
          No Transactions Found
        </Text>
      )}
    </View>
  );
};

export default TransactionList;
