//todo
// add search logic based on vrpid
import React, {useEffect, useState} from 'react';
// import IconButton from 'react-native-vector-icons/FontAwesome'; 
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Card,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
  FlatList,
  Image,
} from 'react-native';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {Searchbar, Icon, Button, IconButton} from 'react-native-paper';
import VRPConsent from '../VRP/VRPConsent';
import {Surface, Stack} from '@react-native-material/core';
import readNatwestAccount from '../../assets/data/accounts.json';
import readNatwestBalance from '../../assets/data/balances.json';
import readBarclaysAccount from '../../assets/data/barclaysAccounts.json';
import readBarclaysBalance from '../../assets/data/barclaysBalances.json';
import {fetchAllDataforScope} from '../../../database/Database';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ConsentInfo from './ConsentInfo';
import {fetchTransactionsForUserConsent} from '../../../database/Database';
//reading data from json file for now
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');
const Drawer = createDrawerNavigator();

const ConsentsforVRP = () => {
  // const formData = route.params?.formData;
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const NatwestAccountData = readNatwestAccount?.Data?.Account;
  const NatwestBalanceData = readNatwestBalance?.Data?.Balance;
  const BarclaysAccountData = readBarclaysAccount?.Data?.Account;
  const BarclaysBalanceData = readBarclaysBalance?.Data?.Balance;
  const mergedAccounts = [...NatwestAccountData, ...BarclaysAccountData];
  const mergedBalances = [...NatwestBalanceData, ...BarclaysBalanceData];

  const scope = 'vrp';
  const [consentData, setConsentData] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAllDataforScope(scope)
        .then(data => {
          if (data !== null) {
            setConsentData(data);
            console.log('details-->', data);
          } else {
            console.log(`No entry found for scope ${scope}.`);
          }
        })
        .catch(error => {
          console.error('Error fetching Consent data:', error);
        });
    }
  }, [isFocused, scope]);
  const mode = 'sandbox';
  const [transactionDetails, setTransactionDetails] = useState(null);
  var tra;
  const handleConsent=async (index,destination)=>{
    const id=consentData[index].consentid;
    console.log("id",index);
    try {
      const result = await fetchTransactionsForUserConsent(id);
      // console.log("vrp-->", (result));
      tra=result;
      setTransactionDetails(result);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    console.log("tra",transactionDetails);
    console.log("trac",tra);
    switch (destination) {
      case 'VrpTransactions':
        navigation.navigate('Vrp Transactions', {
          transactiondetails: tra
        });
        break;
      case 'ConsentInfo':
        navigation.navigate('Consent Info', {
          consentpayload: consentData[index].consentpayload,
          transactionDetails: transactionDetails
        });
        break;
      default:
        console.error(`Invalid destination: ${destination}`);
        break;
    }
  }
  // var transactions;
  // // console.log("det", transactionDetails);
  // transactionDetails?.map(element => {
  //   transactions = JSON.parse(element.vrppayload);
  // });
  // console.log("details::", transactions);
  
  const showTransactions = async index => {
    navigation.navigate('VrpTransactions', {
      consentid: consentData[index].consentid,
      consentpayload: consentData[index].consentpayload,
    });
  };
  const showInfo=async index=>{
    navigation.navigate('ConsentInfo',{
      consentpayload:consentData[index].consentpayload
    });
  }
  const handleSubmit = async index => {
    if (mode == 'sandbox') {
      try {
        console.log('clicked on card' + `${index}`);
        console.log('refreshing...', consentData[index].refreshtoken);
        console.log('Passing data:' + consentData[index]);
        console.log('ID:' + consentData[index].consentid);
        const read = consentData[index].consentpayload;
        console.log('This is the type:' + typeof read);
        const jsonObject = JSON.parse(read);
        const acc =
          jsonObject.Initiation.CreditorAccount.Identification.substring(0, 8);
        const sort =
          jsonObject.Initiation.CreditorAccount.Identification.substring(8);
        console.log('payload details' + read);
        navigation.navigate('GrantedForm', {
          creditorName: jsonObject.Initiation.CreditorAccount.Name,
          accountnumber: acc,
          sortcode: sort,
          referencenumber:
            jsonObject.Initiation.RemittanceInformation.Reference,
          selectconsentData: consentData[index],
        });
      } catch (error) {
        console.log('error in fetching refresh', error);
      }
    }
  };

  return (
    <>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View
            style={{
              backgroundColor: '#5a287d',
              padding: 10,
            }}></View>
          <View style={styles.container}>
            <View style={styles.mainContent}>
              <View style={styles.rowContainer}>
                <View style={styles.searchBarContainer}></View>
              </View>
              <ScrollView>
                {consentData.map((item, index) => (
                  <Surface
                    key={index}
                    style={{
                      backgroundColor: '#c8e1cc',
                      height: 150,
                      width: '100%',
                      padding: wp('5%'),
                      // alignItems: 'center',
                      justifyContent: 'center',
                      margin: 5,
                    }}
                    elevation={2}
                    category="medium">
                    <View
                      style={{
                        alignItems: 'left',
                        justifyContent: 'left',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        
                        <Image
                          source={require('../../assets/images/natwest2.png')}
                          style={styles.iconNatwest}
                        />
                      </View>

                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                          marginTop: hp('2.5%'),
                        }}>
                        {
                          JSON.parse(item.consentpayload).Initiation
                            .CreditorAccount.Name
                        }
                      </Text>
                      
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                          marginTop: hp('2.5%'),
                        }}>
                        Account Number:{
                          JSON.parse(item.consentpayload).Initiation
                          .CreditorAccount.Identification
                        }
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop:'5%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // marginBottom:hp('2%')
                      }}>
                      <Button
                        mode="contained"
                        style={{
                          width: '33%',
                          backgroundColor: 'white',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: hp('2%'),
                        }}
                        labelStyle={{color: 'black'}}
                        onPress={() => handleSubmit(index)}>
                        Pay
                      </Button>
                      <Button
                        mode="contained"
                        style={{
                          width: '33%',
                          backgroundColor: 'white',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: hp('2%'),
                        }}
                        labelStyle={{color: 'black'}}
                        // title={`Go to ${VrpTransactions}`}
                        onPress={() => handleConsent(index,'VrpTransactions')}>
                        Transact
                      </Button>
                      <IconButton
                        icon="information"
                        style={{
                          width: '20%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom:hp('1%'),
                          marginRight:-wp('6%'),
                        }}
                        labelStyle={{color: 'black'}}
                        // title={`Go to ${ConsentInfo}`}
                        onPress={() => handleConsent(index,'ConsentInfo')}>
                        Info
                      </IconButton>
                    </View>
                  </Surface>
                ))}
              </ScrollView>
            </View>
            
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreditorDetails');
        }}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Start a new VRP</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  searchBar: {
    height: 62,
    borderRadius: 0,
    width: 373,
  },
  searchBarContainer: {margin: 2},
  scrollContainer: {
    flex: 1,
    padding: 2,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#c8e1cc',
  },
  surface: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  iconNatwest: {
    width: wp('14.5%'),
    height: wp('14.5%'),
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    top: 2,
  },
  iconBarclays: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  footer: {
    backgroundColor: '#5a287d',
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardContainer: {
    marginBottom: 16,
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
});

export default ConsentsforVRP;
