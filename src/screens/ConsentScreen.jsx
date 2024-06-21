import React, { useState,useEffect } from 'react';
import {
  Title,
  Text,
  List,
  Checkbox,
  Button,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconDialog from '../components/IconDialog';
// import ApiFactory from '../../ApiFactory_AISP/ApiFactory';
import ApiFactory from '../../Apifactory/ApiFactory';

const mode = 'sandbox';
const way = Platform.OS === 'web' ? 'web' : 'android';
const apiFactory = new ApiFactory();
const switchEnvironment = (newEnv) => {
  global.env = newEnv; // Update the global environment variable
  const apiFactory = new ApiFactory();
  const apiClient = apiFactory.createApiClient(global.env);
  return apiClient;
  // Use the new apiClient as needed
 };
const ConsentScreen = () => {
  useEffect(() => {
    const newApiClient = switchEnvironment(global.env);
    setSandboxApiClient(newApiClient);
    return () => {
    };
 }, []);
  const navigation = useNavigation();
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);

  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(true);
  const [checked4, setChecked4] = useState(true);
  const [checked5, setChecked5] = useState(true);
  const [checked6, setChecked6] = useState(false);
  const [checked7, setChecked7] = useState(false);
  const [permission, setPermission] = useState([]);
  const [isInputDialogVisible, setInputDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [sandboxApiClient, setSandboxApiClient] = useState(null);
  const handlePress1 = () => setExpanded1(!expanded1);
  const handlePress2 = () => setExpanded2(!expanded2);
  const handlePress3 = () => setExpanded3(!expanded3);

  const handleCheckbox1 = () => setChecked1(!checked1);
  const handleCheckbox2 = () => setChecked2(!checked2);
  const handleCheckbox3 = () => setChecked3(!checked3);
  const handleCheckbox4 = () => setChecked4(!checked4);
  const handleCheckbox5 = () => setChecked5(!checked5);
  const handleCheckbox6 = () => setChecked6(!checked6);
  const handleCheckbox7 = () => setChecked7(!checked7);

  const handleConfirmButtonClick = async () => {
      try {
        const permissions = [];
        if (checked1) permissions.push('ReadAccountsDetail');
        if (checked2) permissions.push('ReadBalances');
        if (checked3) permissions.push('ReadTransactionsDebits');
        if (checked4) permissions.push('ReadTransactionsCredits');
        if (checked5) permissions.push('ReadTransactionsDetail');

        setPermission(permissions);

        const consentData = await sandboxApiClient.retrieveAccessToken(permissions);
        console.log('Consent id:', consentData);

        if (way === 'web') {
          const consentUrl = await sandboxApiClient.manualUserConsent(consentData);
          console.log(consentUrl);
          setInputDialogVisible(true);
        } else {
          const data2 = await sandboxApiClient.userConsentProgammatically();
          const transactionData = await sandboxApiClient.allCalls(
            '124b77ad-a58a-4d0c-9cf4-354f56eaec01/transactions'
          );
          console.log(transactionData);
          const balanceData = await sandboxApiClient.allCalls(
            '124b77ad-a58a-4d0c-9cf4-354f56eaec01/balances'
          );
          navigation.navigate('Your Accounts', {
            selectedBank: 'Natwest',
            selectedIcon: "'../assets/icons/natwest.png'",
            accounts: data2,
            transactions: transactionData,
            // balance: balanceData,
          });
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error
      }
   
  };

  const handleSubmit = async () => {
    try {
      const data = await sandboxApiClient.exchangeAccessToken(inputValue);
      navigation.navigate('Your Accounts', {
        selectedBank: 'Natwest',
        selectedIcon: "'../assets/icons/natwest.png'",
        accounts: data,
        permissions: permission,
      });
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    } finally {
      setInputDialogVisible(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.headerText}>We Need Your Consent</Title>
      <Text style={styles.textStyle}>
        ONEBank needs your explicit consent to access the following
        information from the accounts held at your bank or building society
      </Text>

      <List.Section>
        <List.Accordion
          title="Your Account Details"
          titleStyle={styles.titleStyle}
          expanded={expanded1}
          onPress={handlePress1}
          style={styles.accordionStyle}>
          <List.Item
            title="Your Account Details"
            left={() => (
              <Checkbox.Android
                status={checked1 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox1}
                disabled={true}
              />
            )}
          />
          <List.Item
            title="Your Balance Details"
            left={() => (
              <Checkbox.Android
                status={checked2 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox2}
              />
            )}
          />
        </List.Accordion>
        <List.Accordion
          title="Your Transaction Details"
          titleStyle={styles.titleStyle}
          expanded={expanded2}
          onPress={handlePress2}
          style={styles.accordionStyle}>
          <List.Item
            title="Your Transaction Debits"
            left={() => (
              <Checkbox.Android
                status={checked3 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox3}
              />
            )}
          />
          <List.Item
            title="Your Transaction Credits"
            left={() => (
              <Checkbox.Android
                status={checked4 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox4}
              />
            )}
          />
          <List.Item
            title="Your Transaction Details"
            left={() => (
              <Checkbox.Android
                status={checked5 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox5}
              />
            )}
          />
        </List.Accordion>
        <List.Accordion
          title="Reason For Access"
          titleStyle={styles.titleStyle}
          expanded={expanded3}
          onPress={handlePress3}
          style={styles.accordionStyle}>
          <List.Item
            title="I Am a Tpp So I Need Access"
            left={() => (
              <Checkbox.Android
                status={checked6 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox6}
              />
            )}
          />
          <List.Item
            title="I Am The Owner Of the Account"
            left={() => (
              <Checkbox.Android
                status={checked7 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox7}
              />
            )}
          />
        </List.Accordion>
      </List.Section>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Deny
        </Button>
        <Button mode="contained" onPress={handleConfirmButtonClick} style={styles.button}>
          Confirm
        </Button>
      </View>
      <Portal>
        <Dialog visible={isInputDialogVisible} onDismiss={() => setInputDialogVisible(false)}>
          <Dialog.Title>Redirect Input</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Paste URL from the browser"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInputDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSubmit}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#36013f',
    paddingTop: 10,
  },
  textStyle: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 16,
    color: '#454545',
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  accordionStyle: {
    width: '85%',
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#c8e1cc',
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    width: 150,
    paddingVertical: 10,
  },
});

export default ConsentScreen;
