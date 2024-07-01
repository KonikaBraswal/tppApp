import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {TextInput} from '@react-native-material/core';
import ApiFactory from '../../../ApiFactory/ApiFactory';
import AndroidClient from '../../../DatabaseFactory/AndroidClientDb';
// import {RFValue} from 'react-native-responsive-fontsize';
// import { ActivityIndicator} from 'react-native-paper';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {RFValue} from 'react-native-responsive-fontsize';
let env = '';
const switchEnvironment = (newEnv, bankName) => {
  global.env = newEnv; // Update the global environment variable
  const apiFactory = new ApiFactory();
  const apiClient = apiFactory.createApiClient(global.env, 'vrp', bankName);
  return apiClient;
  // Use the new apiClient as needed
};
const GrantedForm = ({route}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    const newApiClient = switchEnvironment(global.env, route.params.bankName);
    env = newApiClient;
    console.log(env);
    setEnvApiClient(newApiClient);
    return () => {};
  }, []);
  const {creditorName, accountnumber, sortcode, referencenumber, consentId} =
    route.params;
  const [edit, setEdit] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('');
  const [EnvApiClient, setEnvApiClient] = useState(null);
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  console.log(route.params.bankName);
  let androidClientVrp;
  if (route.params.bankName === 'Natwest') {
    androidClientVrp = new AndroidClient('NWG', 'Sandbox', 'vrp');
  }
  if (route.params.bankName === 'Ulster') {
    androidClientVrp = new AndroidClient('UBN', 'Sandbox', 'vrp');
  }
  if (route.params.bankName === 'RBS') {
    androidClientVrp = new AndroidClient('RBS', 'Sandbox', 'vrp');
  }

  const [vrpData, setVrpData] = useState(null);

  useEffect(() => {
    setFirstName(creditorName);
    setSortCode(sortcode);
    setAccountNumber(accountnumber);
    setReference(referencenumber);
    if (creditorName && accountNumber && sortcode && referencenumber) {
      setEdit(false);
    }
    const fetchData = async () => {
      if (isFocused) {
        try {
          console.log('id in form', consentId);
          const data = await androidClientVrp.fetchDataUsingConsentId(
            consentId,
          );
          console.log('data in granted form', data[0].refreshToken);
          setVrpData(data[0]);
        } catch (error) {
          console.error(
            'Error fetching data in second vrp call screen:',
            error,
          );
        }
      }
    };
    if (global.env == 'sandbox') {
      fetchData();
    }
  }, [creditorName, accountNumber, sortcode, referencenumber, isFocused]);

  const handleSubmit = async () => {
    const formData = {
      firstName,
      sortCode,
      accountNumber,
      reference,
      amount,
    };

    setLoading(true);
    setTimeout(async () => {
      try {
        if (global.env == 'local') {
          await env.refreshTokenForVRP();
          navigation.navigate('VRP Details', {
            data: 'AcceptedSettlementCompleted',
          });
        } else {
          const selectconsentData = {
            consentId: consentId,
            refreshToken: vrpData.refreshToken,
          };
          const response = await env.refreshTokenForVRP(
            selectconsentData,
            formData,
          );

          if (response.Data.Status === 'AcceptedSettlementCompleted') {
            navigation.navigate('VRP Details', {data: response.Data.Status});
          }
        }
      } catch (error) {
        console.error('Error in refreshing token for VRP:', error.message);
      } finally {
        // Set loader to false after the refresh token call is completed
        setLoading(false);
      }
    }, 5000);
  };

  return (
    <>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={50} color="green" />
          <Text style={{fontSize: RFValue(18)}}>Performing Transactions</Text>
        </View>
      )}
      <View style={styles.container}>
        <Text style={{color: 'black', fontSize: RFValue(20)}}>
          Paying {firstName}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 50}}>£</Text>
          <TextInput
            style={{
              height: 50, // Adjusted height
              width: '80%',
              borderColor: 'gray',
              fontSize: RFValue(32), // Adjusted font size
              padding: 10,
              color: 'black',
            }}
            placeholder="Enter amount"
            keyboardType="default"
            value={amount.toString()}
            onChangeText={setAmount}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.footer}
        activeOpacity={1}>
        <Text style={styles.footerText}>Proceed To Pay</Text>
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
  sectionContainer: {
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    backgroundColor: '#114188',
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: RFValue(20),
  },
  input: {
    height: 200,
    width: '80%', // Adjust the width as needed
    borderColor: 'gray',
    fontSize: 78,
    padding: 10,
  },
});

export default GrantedForm;
