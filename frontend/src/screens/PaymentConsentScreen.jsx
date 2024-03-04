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
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ApiFactory from '../../ApiFactory_PISP/ApiFactory';

const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');

const PaymentConsentScreen = ({route}) => {
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputDialogVisible, setInputDialogVisible] = useState(false);

  const showInputDialog = () => setInputDialogVisible(true);
  const hideInputDialog = () => setInputDialogVisible(false);

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

  const showAlert = () => {
    Alert.alert(
      'Unchecked Submission',
      'Please check the box before proceeding',
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

        <View style={{marginTop: hp('1%')}}>
          <View style={styles.tile}>
            <Text style={styles.tileTitle}>Payee Information</Text>

            <View style={{flexDirection: 'column', marginTop: hp('0.5%')}}>
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

            <Divider style={styles.divider} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: wp('4%'),
              paddingVertical: hp('1.5%'),
            }}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />

            <Text style={{fontSize: hp('2%')}}>
              By checking the box labeled "I confirm that the details displayed
              are valid"
            </Text>
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
            labelStyle={{fontWeight: 'bold', fontSize: hp('2.2%')}}>
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
              fontSize: hp('1.8%'),
              color: 'white',
            }}
            onPress={() => {
              if (checked) {
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
    paddingBottom: hp('10%'),
  },
  header: {
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  title: {
    fontSize: hp('3.2%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('1%'),
    color: 'black',
  },
  subtitle: {
    fontSize: hp('2.2%'),
    textAlign: 'center',
    marginHorizontal: hp('1.5%'),
    fontWeight: '500',
  },
  highlightedSection: {
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    paddingVertical: hp('2%'),
    borderRadius: 5,
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('5%'),
  },
  highlightedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightedTitle: {
    fontWeight: 'bold',
    fontSize: hp('2.7%'),
    color: '#5a287d',
    marginHorizontal: wp('1.2%'),
  },

  tile: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  tileTitle: {
    fontSize: hp('2.7%'),
    fontWeight: 'bold',
    color: '#5a287d',
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
    fontSize: hp('2.2%'),
    marginVertical: hp('0.5%'),
    fontWeight: 'bold',
    color: 'black',
  },
  rightContent: {
    position: 'absolute',
    right: 0,
    fontSize: hp('2.2%'),
    marginVertical: hp('1%'),
    fontWeight: 'bold',
    color: 'black',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    marginTop: hp('1.2%'),
  },
  footer: {
    backgroundColor: 'rgba(220, 190, 190, 1)',
    padding: wp('4%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    fontWeight: 'bold',
    fontSize: hp('2.2%'),
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
