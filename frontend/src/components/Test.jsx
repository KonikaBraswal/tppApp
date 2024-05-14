import React, {useEffect, useState} from 'react';
import {globalRefreshedToken} from '../../database/Database';
import {View, Text} from 'react-native';
import ApiFactory from '../../ApiFactory/ApiFactory';
const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

export default function Test() {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const AccountId = '124b77ad-a58a-4d0c-9cf4-354f56eaec01';
  const permissions = [
    'ReadAccountsDetail',
    'ReadBalances',
    'ReadTransactionsCredits',
    'ReadTransactionsDebits',
    'ReadTransactionsDetail',
  ];
  useEffect(() => {
    const fetchTransaction = async () => {
      if (
        permissions.includes('ReadTransactionsDetail') &&
        (permissions.includes('ReadTransactionsCredits') ||
          permissions.includes('ReadTransactionsDebits'))
      ) {
        try {
          const response = await sandboxApiClient.allCallsWithRefreshToken(
            `${AccountId}/transactions`,
          );
          setTransactionDetails(response);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      } else {
        setTransactionDetails(null);
      }
    };
    const fetchAccounts = async () => {
      try {
        if (
          permissions.includes('ReadBalances') &&
          permissions.includes('ReadAccountsDetail')
        ) {
          const response =
            await sandboxApiClient.fetchAccountsWithRefreshToken();
          setAccountDetails(response);
        }
      } catch (error) {
        console.error('Error fetching accounts :', error);
      }
    };
    fetchTransaction();
    fetchAccounts();
  }, [AccountId]);
  const transactions = transactionDetails;
  const accounts = accountDetails;
  return (
    <View>
      <Text>Result :{globalRefreshedToken}</Text>
      {transactions?.Transaction ? (
        <Text>{transactions.Transaction[4].TransactionInformation}</Text>
      ) : (
        <Text>0</Text>
      )}
      {accounts?.Account ? (
        <Text>{accounts.Account[1].AccountId}</Text>
      ) : (
        <Text>0</Text>
      )}
    </View>
  );
}
