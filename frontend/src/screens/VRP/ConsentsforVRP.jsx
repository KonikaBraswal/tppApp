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
  Dimensions,
} from 'react-native';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {Searchbar, Icon, Button, IconButton} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
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
const {width} = Dimensions.get('window');
const cardWidth = width * 0.95;
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
            console.log("======",JSON.parse (data[0].vrppayload).DebtorAccount.Identification);
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
  const handleConsent = async (index, destination) => {
    const id = consentData[index].consentid;
    console.log('id', index);
    try {
      const result = await fetchTransactionsForUserConsent(id);
      tra = result;
      setTransactionDetails(result);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    switch (destination) {
      case 'VrpTransactions':
        navigation.navigate('Vrp Transactions', {
          transactiondetails: tra,
        });
        break;
      case 'ConsentInfo':
        navigation.navigate('Consent Info', {
          consentpayload: consentData[index].consentpayload,
          debitorDetails: JSON.parse(consentData[index].vrppayload),
        });
        break;
      default:
        console.error(`Invalid destination: ${destination}`);
        break;
    }
  };

  const handleSubmit = async index => {
    if (mode == 'sandbox') {
      try {
        const read = consentData[index].consentpayload;
        const jsonObject = JSON.parse(read);
        const acc =
          jsonObject.Initiation.CreditorAccount.Identification.substring(0, 8);
        const sort =
          jsonObject.Initiation.CreditorAccount.Identification.substring(8);
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
            }}>
            <Searchbar
              placeholder="Search account by ID"
              onChangeText={setSearchQuery}
              value={searchQuery}
              icon={() => <Icon source="magnify" color="black" size={20} />}
              style={{
                borderRadius: 5,
                backgroundColor: '#f4ebfe',
              }}
            />
          </View>
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
                      marginBottom: hp('2%'),
                      backgroundColor: '#c8e1cc',
                      borderRadius: 12,
                      elevation: 3,
                      paddingTop: hp('2.5%'),
                      paddingHorizontal: hp('2%'),
                      width: cardWidth,
                    }}
                    elevation={2}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'left',
                        justifyContent: 'left',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={require('../../assets/images/natwest2.png')}
                          style={styles.iconNatwest}
                        />

                        <Text
                          style={{
                            fontSize: RFValue(18),
                            color: 'black',
                            fontWeight: 'bold',
                            marginTop: hp('2.5%'),
                          }}>
                          {
                            JSON.parse(item.consentpayload).Initiation
                              .CreditorAccount.Name
                          }
                        </Text>
                      </View>
                      {item.vrppayload &&
                        JSON.parse(item.vrppayload).DebtorAccount && (
                          <Text
                            style={{
                              fontSize: RFValue(15),
                              color: 'black',
                              fontWeight: 'bold',
                              marginTop: hp('2.5%'),
                            }}>
                            Account Number:{' '}
                            {JSON.parse(
                              item.vrppayload,
                            ).DebtorAccount.Identification.replace(
                              /\d(?=\d{4})/g,
                              '*',
                            )}
                          </Text>
                        )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: hp('1%'),
                        }}>
                        <Button
                          mode="contained"
                          style={{
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: wp('1.5%'),
                            marginBottom: hp('2%'),
                          }}
                          labelStyle={{color: 'black'}}
                          onPress={() => handleSubmit(index)}>
                          Pay
                        </Button>
                        <Button
                          mode="contained"
                          style={{
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: hp('2%'),
                            marginLeft: wp('1.5%'),
                          }}
                          labelStyle={{color: 'black'}}
                          // title={`Go to ${VrpTransactions}`}
                          onPress={() =>
                            handleConsent(index, 'VrpTransactions')
                          }>
                          Transactions
                        </Button>
                      </View>
                      <IconButton
                        icon="information"
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: hp('1.2%'),
                        }}
                        labelStyle={{color: 'black'}}
                        // title={`Go to ${ConsentInfo}`}
                        onPress={() => handleConsent(index, 'ConsentInfo')}>
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
    padding: wp('2%'),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp('2%'),
  },

  searchBar: {
    height: hp('8%'),
    borderRadius: 0,
    width: wp('90%'),
  },
  searchBarContainer: {margin: wp('1%')},
  scrollContainer: {
    flex: 1,
    padding: 2,
  },
  iconNatwest: {
    width: wp('14.5%'),
    height: wp('14.5%'),
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    top: 2,
  },

  footer: {
    backgroundColor: '#5a287d',
    padding: wp('4.2%'),
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: RFValue(20),
  },
});
export default ConsentsforVRP;
