import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {Text, ActivityIndicator} from 'react-native-paper';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {fetchTransactionsForUserConsent} from '../../../database/Database';
import TransactionCard from '../../components/TransactionCard';
import VrpTransactionCard from '../../components/VrpTransactionCard';
import VrpTransactionList from '../../components/VrpTransactionList';
// import LocalTransactionList from '../../components/LocalTransactionList';
const VrpTransactions = ({route}) => {
    const{
        consentid,
        consentpayload
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
        console.log("vrp-->",result);

        setTransactionDetails(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, [consentid]); 

  // const transactions = (transactionDetails[0].vrppayload);
  
//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}>
//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size={50} color="green" />
//           <Text style={{fontSize: 18}}>We Are Fetching Your Data</Text>
//         </View>
//       ) : (
//         <ScrollView nestedScrollEnabled={true} style={styles.scrollView}>
//           <View style={styles.rowContainer}>
//             <Surface elevation={6} category="medium" style={styles.surface}>
//               <Image
//                 source={require('../../assets/images/natwest.png')}
//                 style={styles.icon}
//               />
//             </Surface>
//             <DropdownWithCheckboxes />
//           </View>
//           {transactionDetails && (
//             <VrpDebitor
//               account={transactions}
              
//             />
//           )}
//           <View style={styles.transactionsContainer}>
//             <View style={styles.transactionsHeader}>
//               <Text style={styles.transactionsHeaderText}>Transactions</Text>
//               <SortDropdown />
//             </View>
//             <Searchbar
//               placeholder="Search Transaction"
//               onChangeText={setSearchQuery}
//               value={searchQuery}
//               style={styles.searchbar}
//             />
//             {transactionDetails ? (
//               <VrpTransactionList transactionDetails={transactionDetails} />
//             ) : (
//               <Text style={styles.statusText}>
//                 Need Permissions To Show Transactions
//               </Text>
//             )}
//           </View>
//         </ScrollView>
//       )}
//     </KeyboardAvoidingView>
//   );
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
    color: 'green',
  },
});
export default VrpTransactions;
