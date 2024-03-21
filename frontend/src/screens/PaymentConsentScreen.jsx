import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Title,
  Button,
  Icon,
  Dialog,
  Portal,
  TextInput,
  Divider,
  Checkbox,
  List,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import ApiFactory from '../../ApiFactory_PISP/ApiFactory';

const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');
const CustomListItem = ({title, value}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: hp('2.5%'),
    }}>
    <Text style={styles.leftContent}>{title}</Text>
    <Text style={styles.rightContent}>{value}</Text>
  </View>
);

const PaymentConsentScreen = ({route}) => {
  const navigation = useNavigation();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputDialogVisible, setInputDialogVisible] = useState(false);

  const showInputDialog = () => setInputDialogVisible(true);
  const hideInputDialog = () => setInputDialogVisible(false);
  const [expanded1, setExpanded1] = useState(true);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);

  const handlePress1 = () => setExpanded1(!expanded1);
  const handlePress2 = () => setExpanded2(!expanded2);
  const handlePress3 = () => setExpanded3(!expanded3);

  const FirstName = route.params.FirstName;
  const LastName = route.params.LastName;
  const SortCode = route.params.SortCode;
  const AccountNumber = route.params.AccountNumber;
  const Reference = route.params.Reference;
  const Amount = route.params.Amount;
  const DebtorAccount = route.params.DebtorAccount;

  const handleConfirmButtonClick = async () => {
    if (mode == 'sandbox') {
      try {
        const consentData = await sandboxApiClient.retrieveAccessToken(
          'payments',
          DebtorAccount,
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

  const showAlert = () => {
    Alert.alert(
      'Agree To all the Terms And Conditions',
      'Please check all the boxes before proceeding for payment',
      [{text: 'OK'}],
      {cancelable: false},
    );
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
            <Icon source="credit-card" color="#5a287d" size={hp('3%')} />
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
            marginHorizontal: wp('3%'),
            flexDirection: 'column',
            marginTop: hp('2%'),
          }}>
          <View style={{borderBottomWidth: hp('0.2%'), elevation: 2}}>
            <List.Accordion
              title="Payee Information"
              titleStyle={{
                fontSize: RFValue(18),
                fontWeight: 'bold',
                color: '#5a287d',
              }}
              expanded={expanded1}
              style={{borderRadius: 10}}
              onPress={handlePress1}>
              <CustomListItem title="Name" value={FirstName + ' ' + LastName} />
              <Divider />
              <CustomListItem title="Sort Code" value={SortCode} />
              <Divider />
              <CustomListItem title="Account Number" value={AccountNumber} />
            </List.Accordion>
          </View>
          {DebtorAccount && (
            <View
              style={{
                marginVertical: hp('1%'),
                borderBottomWidth: hp('0.2%'),
                elevation: 2,
              }}>
              <List.Accordion
                title="Payer Information"
                titleStyle={{
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  color: '#5a287d',
                }}
                expanded={expanded2}
                onPress={handlePress2}>
                <CustomListItem title="Name" value={DebtorAccount.Name} />
                <Divider />
                <CustomListItem
                  title="Sort Code"
                  value={DebtorAccount.SchemeName}
                />
                <Divider />
                <CustomListItem
                  title="Account Number"
                  value={DebtorAccount.Identification}
                />
              </List.Accordion>
            </View>
          )}
          <View
            style={{
              marginVertical: hp('1%'),
              borderBottomWidth: hp('0.2%'),
              elevation: 2,
            }}>
            <List.Accordion
              title="Terms"
              titleStyle={{
                fontSize: RFValue(18),
                fontWeight: 'bold',
                color: '#5a287d',
              }}
              expanded={expanded3}
              onPress={handlePress3}>
              <View style={{marginTop: hp('1.5%')}}>
                <View style={styles.checkboxContainer}>
                  <Checkbox.Android
                    status={checked2 ? 'checked' : 'unchecked'}
                    onPress={() => setChecked2(!checked2)}
                  />
                  <Text style={styles.checkboxText}>
                    I confirm that I have reviewed and verified the payment
                    details before proceeding with the transaction
                  </Text>
                </View>
                <View style={styles.checkboxContainer}>
                  <Checkbox.Android
                    status={checked1 ? 'checked' : 'unchecked'}
                    onPress={() => setChecked1(!checked1)}
                  />
                  <Text style={styles.checkboxText}>
                    I authorize the platform to process the payment using the
                    provided payment method for the specified transaction amount
                  </Text>
                </View>
              </View>
            </List.Accordion>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          We will securely transfer to your ASPSP to authenticate and make the
          payment
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained-tonal"
            onPress={() => {
              navigation.goBack();
            }}
            style={{...styles.button, backgroundColor: 'white'}}
            labelStyle={{fontWeight: 'bold', fontSize: RFValue(14)}}>
            Back
          </Button>
          <Button
            mode="contained-tonal"
            style={{
              ...styles.button,
              backgroundColor: '#5a287d',
            }}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: RFValue(14),
              color: 'white',
            }}
            onPress={() => {
              if (checked1 && checked2) {
                handleConfirmButtonClick();
              } else {
                showAlert();
              }
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
    paddingBottom: hp('20%'),
  },
  header: {
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('1.5%'),
    color: 'black',
  },
  subtitle: {
    fontSize: RFValue(16),
    textAlign: 'center',
    marginHorizontal: hp('1.5%'),
    fontWeight: '500',
  },
  highlightedSection: {
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    paddingVertical: hp('2%'),
    borderRadius: 5,
    marginTop: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  highlightedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightedTitle: {
    fontWeight: 'bold',
    fontSize: RFValue(19),
    color: '#5a287d',
    marginHorizontal: wp('1.2%'),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginVertical: hp('2%'),
    padding: wp('1%'),
  },
  leftContent: {
    position: 'absolute',
    left: 0,
    fontSize: RFValue(14),
    marginHorizontal: wp('2%'),
    fontWeight: 'bold',
    color: 'black',
  },
  rightContent: {
    position: 'absolute',
    right: 0,
    fontSize: RFValue(14),
    marginHorizontal: wp('2%'),
    fontWeight: 'bold',
    color: 'black',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    marginTop: hp('1.2%'),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    flex: 1,
    marginHorizontal: wp('2%'),
    flexWrap: 'wrap',
    fontSize: 16,
  },
  footer: {
    backgroundColor: 'rgba(220, 190, 190, 1)',
    padding: wp('5%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: hp('1%'),
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('1%'),
  },
  button: {
    borderRadius: 0,
    paddingVertical: hp('0.4%'),
    paddingHorizontal: wp('3.8%'),
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default PaymentConsentScreen;
