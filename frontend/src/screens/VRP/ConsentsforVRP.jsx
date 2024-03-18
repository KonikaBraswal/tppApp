//todo
// add search logic based on vrpid
import React, {useEffect, useState} from 'react';
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
import {Searchbar, Icon, Button} from 'react-native-paper';
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

  const filteredAccounts = mergedAccounts.filter(account =>
    account.AccountId.includes(searchQuery),
  );
  const findAccountBalances = accountId => {
    const foundBalances = mergedBalances.filter(
      balance => balance.AccountId === accountId,
    );

    if (foundBalances.length > 0) {
      return foundBalances;
    } else {
      return null;
    }
  };
  const scope = 'vrp';
  const [consentData, setConsentData] = useState([]);
  const [TransactionData, setTransactionData] = useState([]);

  const grantedFormdata = {
    firstName: 'minal',
    reference: 'Tools',
    amount: 45,
  };
  const isFocused = useIsFocused();

  useEffect(() => {

    if (isFocused) {
      fetchAllDataforScope(scope)
        .then(data => {
          if (data !== null) {
            setConsentData(data);
            console.log('details-->', data[0]);
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
  const showTransactions=async index=>{
    navigation.navigate('VrpTransactions',{
      consentid:consentData[index].consentid
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
        const name = jsonObject.Initiation.CreditorAccount.Name;
        console.log('payload details' + read);
        navigation.navigate('GrantedForm', {
          creditorName: jsonObject.Initiation.CreditorAccount.Name,
          creditorIdentification:
            jsonObject.Initiation.CreditorAccount.Identification,
          sortcode: '12-05-03',
          referencenumber:
            jsonObject.Initiation.RemittanceInformation.Reference,
          selectconsentData: consentData[index],
        });
        // const response=await sandboxApiClient.refreshToken(consentData[index],grantedFormdata);//pass index based on the card clicked
        // console.log("response",response);
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
                      height: 230,
                      width: '100%',
                      padding: wp('5%'),
                      // alignItems: 'center',
                      // justifyContent: 'center',
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
                        <Text style={{fontSize: 20}}>To</Text>

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
                          marginTop: hp('0.5%'),
                        }}>
                        {
                          JSON.parse(item.consentpayload).Initiation
                            .CreditorAccount.Name
                        }
                      </Text>
                      {/* <Text style={styles.text}>
                        Max amount per Period:
                        {
                          JSON.parse(item.consentpayload)?.ControlParameters
                            ?.PeriodicLimits[0]?.Amount
                        }
                      </Text> */}
                      {JSON.parse(item.consentpayload)?.ControlParameters
                        ?.PeriodicLimits[0]?.Amount ? (
                        <Text style={styles.text}>
                          Max amount per Period:
                          {
                            JSON.parse(item.consentpayload).ControlParameters
                              .PeriodicLimits[0].Amount
                          }
                        </Text>
                      ) : (
                        <Text style={styles.text}>
                          Max amount per Period: 300
                        </Text>
                      )}

                      {/* <Text style={styles.text}>
                        Max amount per Payment:
                        {
                          JSON.parse(item.consentpayload)?.ControlParameters
                            ?.MaximumIndividualAmount.Amount
                        }
                      </Text> */}
                      {JSON.parse(item.consentpayload)?.ControlParameters
                        ?.MaximumIndividualAmount.Amount ? (
                        <Text style={styles.text}>
                          Max amount per Payment:
                          {
                            JSON.parse(item.consentpayload).ControlParameters
                              .MaximumIndividualAmount.Amount
                          }
                        </Text>
                      ) : (
                        <Text style={styles.text}>
                          Max amount per Payment: 200
                        </Text>
                      )}

                      {JSON.parse(item.consentpayload)?.ControlParameters
                        ?.PeriodicLimits[0]?.PeriodType ? (
                        <Text style={styles.text}>Occurs every {JSON.parse(item.consentpayload)?.ControlParameters
                          ?.PeriodicLimits[0]?.PeriodType}</Text>
                      ) : (
                        <Text style={styles.text}> Occurs every Month</Text>
                      )}

                      {/* <Text>{item.consentid}</Text> */}
                    </View>
                    <Button
                      mode="contained"
                      style={{
                        width: '30%',
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: hp('2%'),
                      }}
                      labelStyle={{color: 'green'}}
                      onPress={() => handleSubmit(index)}>
                      Pay Now
                    </Button>
                    <Button
                      mode="contained"
                      style={{
                        width: '30%',
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: hp('2%'),
                      }}
                      labelStyle={{color: 'red'}}
                      onPress={() => showTransactions(index)}>
                      Transactions
                    </Button>
                  </Surface>
                ))}
              </ScrollView>
            </View>
            {/* <Button mode="contained" style={{ width: '50%', backgroundColor: '#5a287d', margin: 15, height: 50 }}
      labelStyle={{ color: 'white', fontSize: 18, flex: 1, alignItems: 'center' }} onPress={() => { navigation.navigate('CreditorDetails') }}>
      Start a new VRP
    </Button> */}
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
