import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Title,
  Button,
  Icon,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import ApiFactory from '../../ApiFactory_PISP/ApiFactory';

const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const PaymentConsentScreen = ({route}) => {
  const navigation = useNavigation();
  const [isPayeeInfoOpen, setIsPayeeInfoOpen] = useState(false);
  const [isPayerInfoOpen, setIsPayerInfoOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputDialogVisible, setInputDialogVisible] = useState(false);
  const showInputDialog = () => setInputDialogVisible(true);
  const hideInputDialog = () => {
    setInputDialogVisible(false);
  };

  const handleConfirmButtonClick = async () => {
    if (mode == 'sandbox') {
      try {
        const consentData = await sandboxApiClient.retrieveAccessToken(
          'payments',
        );
        console.log('Consent id:', consentData);
        if (way == 'web') {
          const consentUrl = await sandboxApiClient.manualUserConsent(
            consentData,
          );
          console.log(consentUrl);
          showInputDialog();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      navigation.navigate('PISP');
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await sandboxApiClient.exchangeAccessToken(inputValue);
      navigation.navigate('Transaction Successful', {status: data.Status});
    } catch (error) {
      console.error('Error:', error);
    }
    hideInputDialog();
  };

  const FirstName = route.params.FirstName;
  const LastName = route.params.LastName;
  const SortCode = route.params.SortCode;
  const AccountNumber = route.params.AccountNumber;
  const Reference = route.params.Reference;
  const Amount = route.params.Amount;
  const toggleSection = section => {
    if (section === 'payee') {
      setIsPayeeInfoOpen(!isPayeeInfoOpen);
    } else if (section === 'payer') {
      setIsPayerInfoOpen(!isPayerInfoOpen);
    } else if (section === 'terms') {
      setIsTermsOpen(!isTermsOpen);
    }
  };
  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    return `${day} - ${month} - ${year}`;
  };
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Permission to make a payment</Text>
          <Text style={styles.subtitle}>
            We need your permission to securely initiate payment order from your
            bank account
          </Text>
        </View>

        <View style={styles.highlightedSection}>
          <View style={styles.highlightedRow}>
            <Icon source="credit-card" color="#5a287d" size={25} />
            <Title style={styles.highlightedTitle}>Payment</Title>
          </View>

          <View style={styles.row}>
            <Text style={styles.leftContent}>Payment Total</Text>
            <Text style={styles.rightContent}>$ {Amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.leftContent}>Payment Reference</Text>
            <Text style={styles.rightContent}>{Reference}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.leftContent}>Payment Date</Text>
            <Text style={styles.rightContent}>{formattedDate}</Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 15,
            justifyContent: 'center',
          }}>
          <View style={styles.tile}>
            <Text style={styles.tileTitle}>Payee Information</Text>

            <View style={{flexDirection: 'column', marginTop: 2}}>
              <View style={styles.row}>
                <Text style={styles.leftContent}>Name</Text>
                <Text style={styles.rightContent}>
                  {FirstName} {LastName}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.leftContent}>Sort Code</Text>
                <Text style={styles.rightContent}>{SortCode}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.leftContent}>Account Number</Text>
                <Text style={styles.rightContent}>{AccountNumber}</Text>
              </View>
            </View>
          </View>
          {/* <TouchableOpacity
            style={styles.tile}
            onPress={() => toggleSection('payee')}>
            <Text style={styles.tileTitle}>Payee Info</Text>
            {isPayeeInfoOpen && (
              <View style={{flexDirection: 'column', marginTop: 2}}>
                <View style={styles.row}>
                  <Text style={styles.leftContent}>Name</Text>
                  <Text style={styles.rightContent}>
                    {FirstName} {LastName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.leftContent}>Sort Code</Text>
                  <Text style={styles.rightContent}>Right Content</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.leftContent}>Account Number</Text>
                  <Text style={styles.rightContent}>{AccountNumber}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={styles.tile}
            onPress={() => toggleSection('payer')}>
            <Text style={styles.tileTitle}>Payer Info</Text>
            {isPayerInfoOpen && (
              <View style={{flexDirection: 'column', marginTop: 2}}>
                <View style={styles.row}>
                  <Text style={styles.leftContent}>Sort Code</Text>
                  <Text style={styles.rightContent}>Right Content</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.leftContent}>Account Number</Text>
                  <Text style={styles.rightContent}>Right Content</Text>
                </View>
              </View>
            )}
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={styles.tile}
            onPress={() => toggleSection('terms')}>
            <Text style={styles.tileTitle}>Terms</Text>
            {isTermsOpen && (
              <View style={styles.tileContent}>
                <Text style={styles.tileContentText}>
                  Details about the terms...
                </Text>
              </View>
            )}
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          We will securely transfer to your ASPSP to authenticate amd make the
          payment
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained-tonal"
            onPress={() => {
              navigation.goBack();
            }}
            style={{...styles.button, backgroundColor: 'white'}}
            labelStyle={{fontWeight: 'bold', fontSize: 16}}>
            Back
          </Button>
          <Button
            mode="contained-tonal"
            style={{
              ...styles.button,
              backgroundColor: '#5a287d',
            }}
            labelStyle={{fontWeight: 'bold', fontSize: 16, color: 'white'}}
            onPress={() => {
              handleConfirmButtonClick();
            }}>
            I Allow
          </Button>
          <Portal>
            <Dialog visible={isInputDialogVisible} onDismiss={hideInputDialog}>
              <Dialog.Title>Redirect Input</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label=" Paste URL from the browser"
                  value={inputValue}
                  onChangeText={text => setInputValue(text)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideInputDialog}>Cancel</Button>
                <Button
                  onPress={() => {
                    handleSubmit();
                  }}>
                  Submit
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 10,
    fontWeight: '500',
  },
  highlightedSection: {
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 20,
  },
  highlightedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightedTitle: {
    fontWeight: 'bold',
    fontSize: 21,
    color: '#5a287d',
    marginHorizontal: 6,
  },
  highlightedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  tile: {
    margin: 10,
    padding: 10,
    borderColor: 'black',
    borderBottomWidth: 2,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a287d',
  },
  tileContent: {
    marginTop: 5,
    padding: 5,
  },
  tileContentText: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 15,
    padding: 5,
  },
  leftContent: {
    position: 'absolute',
    left: 0,
    fontSize: 16,
    marginVertical: 3,
    fontWeight: 'bold',
    color: 'black',
  },
  rightContent: {
    position: 'absolute',
    right: 0,
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  footer: {
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    borderRadius: 0,
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default PaymentConsentScreen;
