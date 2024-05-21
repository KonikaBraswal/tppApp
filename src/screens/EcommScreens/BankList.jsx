import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Searchbar, TextInput, Dialog, Portal, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import sandboxConfig from '../../../configs_VRP/Sandbox.json';
import { SafeAreaView } from 'react-native-safe-area-context';

const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const BankList = ({ route }) => {
  const totalAmount = route.params.totalAmount;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);
  const [isInputDialogVisible, setInputDialogVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [consentData, setConsentData] = useState([]);

  const [allbanks, setAllBanks] = useState([
    { id: 101, name: 'Allied Irish Bank(NI)', icon: require('../../assets/images/ecomm-images/allied-irish-bank.jpeg') },
    { id: 102, name: 'Lloyds', icon: require('../../assets/images/lloyds.png') },
    { id: 103, name: 'Bank Of Scotland', icon: require('../../assets/images/ecomm-images/bank-of-scotland.png') },
    { id: 104, name: 'Natwest', icon: require('../../assets/images/natwest.png') },
    { id: 105, name: 'Coutts', icon: require('../../assets/images/ecomm-images/coutts.png') },
    { id: 106, name: 'First Direct', icon: require('../../assets/images/ecomm-images/first-direct-bank.png') },
    { id: 107, name: 'Danske Bank', icon: require('../../assets/images/ecomm-images/danske-bank.png') },
    { id: 108, name: 'Barclays', icon: require('../../assets/images/barclays.png') },
  ]);

  const jsondata = {
    Data: {
      ReadRefundAccount: 'No',
      ControlParameters: {
        InitialPayment: {
          Amount: String(totalAmount),
          Currency: 'GBP',
        },
        VRPType: ['UK.OBIE.VRPType.Other'],
        VRPSubType: ['UK.NWG.VRPSubType.Ongoing'],
        PSUAuthenticationMethods: ['UK.OBIE.SCANotRequired'],
      },
      Initiation: {
        CreditorAccount: {
          SchemeName: 'SortCodeAccountNumber',
          Identification: '50499910000996',
          Name: 'Natwest Cart',
          SecondaryIdentification: 'secondary-identif',
        },
        RemittanceInformation: {
          Unstructured: 'Tools',
          Reference: 'Tools',
        },
      },
    },
    Risk: {},
  };

  const handleConfirmButtonClick = async () => {
    try {
      setLoading(true);
      setError(null);
      const permissions = jsondata;
      const accessTokenParams = {
        scope: 'payments',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: permissions,
        consentUrl: sandboxConfig.paymentRequestEndPoint,
      };
      const consentdata = await sandboxApiClient.retrieveAccessToken({ accessTokenParams });
      setConsentData(consentdata);
      await AsyncStorage.setItem('EcommConsentId', JSON.stringify(consentdata.Data.ConsentId));

      if (way === 'web') {
        const Vrpscope = 'openid payments';
        const consentUrl = await sandboxApiClient.manualUserConsent(Vrpscope);
        setInputDialogVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to retrieve access token.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const customerDetails = await sandboxApiClient.exchangeAccessToken(inputValue, consentData);
      navigation.navigate('Customer Details', { customerDetails, totalAmount });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to retrieve access token.');
    } finally {
      setLoading(false);
    }
    setInputValue('');
    setInputDialogVisible(false);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={handleConfirmButtonClick}>
        <View style={styles.bankItemContainer}>
          <Image key={index} source={item.icon} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', padding: 10 }}>
        <Searchbar
          placeholder="Search any banks"
          value={searchQuery}
          icon={() => <Icon name="magnify" color="black" size={20} />}
          style={{ borderRadius: 5, backgroundColor: '#f4ebfe' }}
        />
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          data={allbanks}
          renderItem={renderItem}
          keyExtractor={bank => bank.id.toString()}
          contentContainerStyle={styles.container}
        />
      </View>
      <Portal>
        <Dialog visible={isInputDialogVisible} onDismiss={() => setInputDialogVisible(false)}>
          <Dialog.Title>Redirect Input</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Paste URL from the browser"
              value={inputValue}
              onChangeText={text => setInputValue(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInputDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSubmit}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bankItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  name: {
    alignItems: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexGrow: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#114188',
    borderRadius: '10%',
    width: '90%',
    height: '6%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2%',
  },
  buttonText: {
    fontSize: '4.4%',
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#A7ACB4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '85%',
    fontWeight: '500',
  },
});

export default BankList;
