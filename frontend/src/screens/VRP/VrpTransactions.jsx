import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {fetchTransactionsForUserConsent} from '../../../database/Database';
import TransactionCard from '../../components/TransactionCard';
import VrpTransactionCard from '../../components/VrpTransactionCard';
const VrpTransactions = ({route}) => {
    const{
        consentid
    }=route.params
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionText, setTransactionText] = useState(
    'No Transactions Found',
  );

  useEffect(() => {
    console.log("consent",consentid);
    // Fetch transactions for the userConsentId
    fetchTransactionsForUserConsent(consentid)
      .then((result) => {
        console.log("transactions",result[0].vrppayload);

        setTransactionDetails(result);
        // setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, [consentid]); 

  const transactions = (transactionDetails);
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="green" />
          <Text style={styles.loadingText}>Fetching Transactions</Text>
        </View>
      ) : transactions.length>0? (
        transactions.map(transaction => (
          <VrpTransactionCard
            key={transaction.vrpid}
            transaction={JSON.parse(transaction.vrppayload)}
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
export default VrpTransactions;
