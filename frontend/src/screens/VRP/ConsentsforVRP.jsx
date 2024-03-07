//todo
// add search logic based on vrpid
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import ApiFactory from '../../../ApiFactory/ApiFactory';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {
  Searchbar,
  Icon,
  Button,
} from 'react-native-paper';
import VRPConsent from '../VRP/VRPConsent';
import { Surface, Stack } from '@react-native-material/core';
import readNatwestAccount from '../../assets/data/accounts.json';
import readNatwestBalance from '../../assets/data/balances.json';
import readBarclaysAccount from '../../assets/data/barclaysAccounts.json';
import readBarclaysBalance from '../../assets/data/barclaysBalances.json';
import readdata from '../../assets/data/VRP.json';
import { fetchAllDataforScope } from '../../../Database/Database';
import {createDrawerNavigator} from '@react-navigation/drawer';
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
  const scope = 'payments';
  const [consentData, setConsentData] = useState([]);
  const grantedFormdata={
    firstName:'minal',
    reference:'Tools',
    amount:45
  }
  const isFocused = useIsFocused();
  // useEffect(() => {
  //   // Call fetchAllDataforScope when the component mounts
  //   fetchAllDataforScope(scope)
  //     .then(data => {
  //       if (data !== null) {
  //         setConsentData(data);
  //         console.log("details-->",data[1]);
  //         setForceRender(prev => !prev);
  //       } else {
  //         console.log(`No entry found for scope ${scope}.`);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching Consent data:', error);
  //     });
  // }, [scope,forceRender]);
  useEffect(() => {
    if (isFocused) {
      // Call fetchAllDataforScope when the component is focused (remounted)
      fetchAllDataforScope(scope)
        .then(data => {
          if (data !== null) {
            setConsentData(data);
            console.log("details-->", data[1]);
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

  const handleSubmit = async (index) => {
    if (mode == 'sandbox') {
    try{
      console.log('clicked on card'+`${index}`);
      console.log("refreshing...",consentData[index].refreshtoken);
      console.log("Passing data:"+consentData[index])
      console.log('ID:'+consentData[index].consentid);
      const read=consentData[index].consentpayload;
      console.log("This is the type:"+typeof(read));
      const jsonObject = JSON.parse(read);
       const name = jsonObject.Initiation.CreditorAccount.Name;
      console.log('payload details'+read)
      navigation.navigate('GrantedForm',{
        creditorName:jsonObject.Initiation.CreditorAccount.Name, 
        creditorIdentification:jsonObject.Initiation.CreditorAccount.Identification, 
        sortcode:'12-05-03', 
        referencenumber:jsonObject.Initiation.RemittanceInformation.Reference,
        selectconsentData:consentData[index]
      })
      // const response=await sandboxApiClient.refreshToken(consentData[index],grantedFormdata);//pass index based on the card clicked
      // console.log("response",response);
      

    }catch(error){
      console.log("error in fetching refresh",error);
    }}
  };


  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: '#5a287d',
            padding: 10,
          }}>

        </View>
        <View style={styles.container}>
          <View style={styles.mainContent}>
            <View style={styles.rowContainer}>
              <View style={styles.searchBarContainer}></View>
            </View>
            <ScrollView>
              {consentData.map((item,index)=>(

                <View key={item.id} style={styles.item}>
                <Text>{item.consentid}</Text>
                <Text>{JSON.parse(item.consentpayload).Initiation.CreditorAccount.Name}</Text>
                <Button mode="contained"  style={{ width: '50%', backgroundColor: '#c8e1cc' }} labelStyle={{ color: 'green' }} onPress={()=>handleSubmit(index)}>
                  Pay Now
                </Button>
              </View>
              ))}
              
              </ScrollView>
          </View>
          <Button mode="contained" style={{ width: '50%', backgroundColor: '#5a287d', margin: 15, height: 50 }}
            labelStyle={{ color: 'white', fontSize: 18, flex: 1, alignItems: 'center' }} onPress={() => { navigation.navigate('CreditorDetails') }}>
            Start a new VRP
          </Button>
          
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Select Your Bank');
            }}
            style={styles.footer}
            activeOpacity={1}>
            <Text style={styles.footerText}>Add New Bank Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
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
  searchBarContainer: { margin: 2 },
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
    width: 55,
    height: 55,
    resizeMode: 'contain',
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
});

export default ConsentsforVRP;
