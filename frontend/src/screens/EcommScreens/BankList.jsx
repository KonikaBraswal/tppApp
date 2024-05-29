import IconDialog from '../../components/IconDialog';
import ApiFactory from '../../../ApiFactory/ApiFactory';
import React, { useState, useEffect } from 'react';
import * as products from '../../assets/data/product_catalogue.json';
// import {Button, Searchbar, Icon} from 'react-native-paper';
// import {Modal, Portal, Checkbox, Switch} from 'react-native-paper';
import { Surface, Stack, Divider, ListItem } from '@react-native-material/core';
import {
  Keyboard,
  Pressable,
  TouchableOpacity,
  VirtualizedList,
} from 'react-native';
import {
  Title,
  TextInput,
  List,
  Checkbox,
  Searchbar,
  Icon,
  Button,
  Modal,
  Dialog,
  Portal,
  DataTable,
} from 'react-native-paper';

import { RFValue } from 'react-native-responsive-fontsize';
import imgarray from '../../assets/data/images';
import { GridLayout } from 'react-native-layout-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ScrollView,
  Text,
  Image,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderSuccessful from './OrderSuccessful';
import { addDetailsCA } from '../../../database/Database';

const mode = 'sandbox';
const way = 'web';
const switchEnvironment = (newEnv) => {
  global.env = newEnv; // Update the global environment variable
  const apiFactory = new ApiFactory();
  const apiClient = apiFactory.createApiClient(global.env,"vrp");
  return apiClient;
  // Use the new apiClient as needed
 };
const BankList = ({ route }) => {
  useEffect(() => {
    const newApiClient = switchEnvironment(global.env);
    setEnvApiClient(newApiClient);
    return () => {
    };
 }, []);

  const totalAmount = route.params.totalAmount;

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [allPayments, setAllPayments] = useState('');
  const [error, setError] = useState(null);
  const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);
  const showErrorDialog = () => setErrorDialogVisible(true);
  const hideErrorDialog = () => setErrorDialogVisible(false);
  const [isInputDialogVisible, setInputDialogVisible] = useState(false);
  const showInputDialog = () => setInputDialogVisible(true);
  const hideInputDialog = () => setInputDialogVisible(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [EnvApiClient, setEnvApiClient] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [consentData, setConsentData] = useState([]);
  const [allbanks, setAllBanks] = useState([
    {
      id: 101,
      name: 'Allied Irish Bank(NI)',
      icon: require('../../assets/images/ecomm-images/allied-irish-bank.jpeg'),
    },
    { id: 102, name: 'Lloyds', icon: require('../../assets/images/lloyds.png') },
    {
      id: 103,
      name: 'Bank Of Scotland',
      icon: require('../../assets/images/ecomm-images/bank-of-scotland.png'),
    },
    {
      id: 104,
      name: 'Natwest',
      icon: require('../../assets/images/natwest.png'),
    },
    {
      id: 105,
      name: 'Coutts',
      icon: require('../../assets/images/ecomm-images/coutts.png'),
    },
    {
      id: 106,
      name: 'First Direct',
      icon: require('../../assets/images/ecomm-images/first-direct-bank.png'),
    },
    {
      id: 107,
      name: 'Danske Bank',
      icon: require('../../assets/images/ecomm-images/danske-bank.png'),
    },
    {
      id: 108,
      name: 'Barclays',
      icon: require('../../assets/images/barclays.png'),
    },
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

      "Initiation": {
        "CreditorAccount": {
          "SchemeName": "SortCodeAccountNumber",
          "Identification": "50499910000996",
          "Name": "Natwest Cart",
          "SecondaryIdentification": "secondary-identif"
        },
        "RemittanceInformation": {
          "Unstructured": "Tools",
          "Reference": "Tools"
        }
      }
    },
    "Risk": {}
  };
  const handleConfirmButtonClick = async () => {
    // console.log(`Bank ID clicked: ${bankId}`);
    console.log("calling mode in VRP",global.env);
    try {
      
      setLoading(true);
      setError(null);
      const consentdata = await EnvApiClient.callApiFactory('vrp',jsondata,null);
      setConsentData(consentdata);
      console.log(consentdata);
      
      if (way == 'web') {
        await EnvApiClient.manualUserConsent(
          consentdata.Data.ConsentId,
        );
        showInputDialog();
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

      const {customerDetails,debitorDetails,response } = await EnvApiClient.exchangeAccessToken(inputValue, consentData);
      console.log("details1-->",customerDetails);
      console.log("details2-->",debitorDetails);
      const consentId=consentData.Data.ConsentId;
      navigation.navigate('Customer Details', {
        customerDetails, totalAmount,debitorDetails,consentId
      });

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to retrieve access token.');
    } finally {
      setLoading(false);
    }
    setInputValue('');
    hideInputDialog();
  };
  const renderitem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => handleConfirmButtonClick()}>
        <View style={styles.bankItemContainer}>
          <Image
            key={index}
            source={item.icon}
            style={{ height: 50, width: 50, resizeMode: 'contain' }}
          />
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
        }}>
        <Searchbar
          placeholder="Search any banks"
          // onChangeText={onChangeSearch}
          value={searchQuery}
          icon={() => <Icon source="magnify" color="black" size={20} />}
          style={{
            borderRadius: 5,
            backgroundColor: '#E0FCFD',
          }}
        />
        {/* <Button onPress={submit} title="Press">Press</Button> */}
      </View>
      <Stack fill left style={{ backgroundColor: 'white', padding: 10 }}>
        <Surface elevation={10} category="medium">

          <FlatList
            data={allbanks}
            renderItem={renderitem}
            keyExtractor={bank => bank.id}
            contentContainerStyle={styles.container}
          />

        </Surface>
      </Stack>
      <View>
        <Portal>
          <Dialog visible={isInputDialogVisible} onDismiss={hideInputDialog}>
            <Dialog.Title>Redirect Input</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Paste URL from the browser"
                value={inputValue}
                onChangeText={text => setInputValue(text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideInputDialog}>Cancel</Button>
              <Button onPress={handleSubmit}>Submit</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
    // </KeyboardAwareScrollView>
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
    borderRadius: 8, // Border radius to make it rounded
    borderWidth: 1, // Border width
    borderColor: '#ccc',
    flexGrow: 1,
    marginBottom: 10,

  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
    overflow: 'hidden',

  },
  item: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fff',
  },
  modalContainer: {
    position: 'absolute',
    right: 20,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,

  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: wp('5%'),

  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',

  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  searchbar: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0%'),
    borderWidth: hp('1%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
  },
  input: {
    fontSize: wp('5%'),
    backgroundColor: 'white',
    height: 40, // Set the height of the search bar
    fontSize: 16, // Font size of the text input
    paddingHorizontal: 8,
  },
  toggle: {
    padding: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-around'
  },
});


export default BankList;