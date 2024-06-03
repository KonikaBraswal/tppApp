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
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {Searchbar, Icon, Button, IconButton} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {Surface, Stack} from '@react-native-material/core';
import readNatwestAccount from '../../../DatabaseFactory/MockData/accounts.json';
import readNatwestBalance from '../../../DatabaseFactory/MockData/balances.json';
import readBarclaysAccount from '../../../DatabaseFactory/MockData/barclaysAccounts.json';
import readBarclaysBalance from '../../../DatabaseFactory/MockData/barclaysBalances.json';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { fetchVRPData } from '../../../database/LocalDatabase';
import AndroidClient from '../../../DatabaseFactory/AndroidClientDb';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const {width} = Dimensions.get('window');
const cardWidth = width * 0.95;
const Drawer = createDrawerNavigator();

const ConsentsforVRP = () => {
  // const formData = route.params?.formData;
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const [localdata, setLocalData] = useState([]);

  
  const scope = 'vrp';
  const [consentData, setConsentData] = useState([]);

  const isFocused = useIsFocused();
  let androidClientVrp=new AndroidClient("NWG", "Sandbox", "vrp");
  let androidClientVrpTransact=new AndroidClient("NWG", "Sandbox", "vrp_transactions");
  useEffect( () => {
    const fetchData = async () => {
    if(global.env==='local')
    {
      fetchVRPData().then(results => {
        setLocalData(results);
      });
    }
    else{
    if (isFocused) {
      try {
        const data = await androidClientVrp.fetchDataUsingScope(scope);
        setConsentData(data);
      } catch (error) {
        console.error('Error fetching data for consents:', error);
      }
    }}
  };
  fetchData();
  }, [isFocused, scope]);
  const mode = 'sandbox';
  
  var tra;
  const handleConsent = async (index, destination) => {
    const id = consentData[index].consentId;
    console.log('id', index);
    try {
      const result = await androidClientVrpTransact.fetchDataUsingConsentId(id);
      tra = result;
      
      
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
        // console.log(JSON.parse (consentData[index].consentPayload).Data);
        navigation.navigate('Consent Info', {
          consentpayload:JSON.parse (consentData[index].consentPayload).Data,
          debitorDetails: JSON.parse(consentData[index].accountDetails),
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
        console.log("id in conset",consentData[index].consentId);
        const read = consentData[index].consentPayload;
        const jsonObject = JSON.parse(read).Data;
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
          consentId:consentData[index].consentId
        });
      } catch (error) {
        console.log('error in fetching refresh', error);
      }
    }
  };

  return (
      <>
      <KeyboardAwareScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View
            style={{
              // backgroundColor: '#fff',
              padding: 10,
            }}>
            <Searchbar
              placeholder="Search account by ID"
              onChangeText={setSearchQuery}
              value={searchQuery}
              icon={() => <Icon source="magnify" color="black" size={20} />}
              style={{
                borderRadius: 5,
                backgroundColor: '#E0FCFD',
              }}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.mainContent}>
              <View style={styles.rowContainer}>
                <View style={styles.searchBarContainer}></View>
              </View>
      {localdata && localdata.length > 0 ? (
        <ScrollView>
                      {localdata.map((item, index) => (
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
                                {item.creditorname}

                              </Text>
                            </View>
                            {item.debtoraccnum && (
                                <Text
                                  style={{
                                    fontSize: RFValue(15),
                                    color: 'black',
                                    fontWeight: 'bold',
                                    marginTop: hp('2.5%'),
                                  }}>
                                  Account Number:{' '}
                                  {/* {JSON.parse(
                                    item.vrppayload,
                                  ).DebtorAccount.Identification.replace(
                                    /\d(?=\d{4})/g,
                                    '*',
                                  )} */}
                                  {item.debtoraccnum}
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
                                onPress={() => navigation.navigate('GrantedForm',{
                                  creditorName: item.creditorname,
                                    accountnumber: item.debtoraccnum,
                                    sortcode: "111111",
                                    referencenumber:
                                      "jsonObject.Initiation.RemittanceInformation.Reference",
                                    selectconsentData:" consentData[index]",
                                })}>
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
                                 navigation.navigate('Local Transactions')
                                }>
                                Transactions
                              </Button>
                            </View>
                            {/* <IconButton
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
                            </IconButton> */}
                          </View>
                        </Surface>
                      ))}
                    </ScrollView>
      ) : (
        consentData && consentData.length > 0 ? (
          <ScrollView>
                      {consentData.map((item, index) => (
                        <Surface
                          key={index}
                          style={{
                            marginBottom: hp('2%'),
                            backgroundColor: '#6FC6F7',
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
                                {JSON.parse(item.consentPayload).Data.Initiation.CreditorAccount.Name}
                              </Text>
                            </View>
                            {item.vrppayload &&
                              JSON.parse(item.vrpPayload).DebtorAccount && (
                                <Text
                                  style={{
                                    fontSize: RFValue(15),
                                    color: 'black',
                                    fontWeight: 'bold',
                                    marginTop: hp('2.5%'),
                                  }}>
                                  Account Number:{' '}
                                  {JSON.parse(
                                    item.vrpPayload,
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
                    </ScrollView> // Render something specific to consentData
        ) : (
          <Text>No Data Available</Text> // Default message if both localdata and consentData are empty
        )
      )}
               </View>
         </View>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
       <TouchableOpacity
        onPress={() => {
          navigation.navigate('Payee Details');
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
    backgroundColor: '#3559AA',
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
