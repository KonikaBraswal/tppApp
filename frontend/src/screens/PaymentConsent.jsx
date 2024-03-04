// import React, {useState, useEffect} from 'react';
// import {
//   Title,
//   Text,
//   List,
//   Checkbox,
//   Icon,
//   Button,
//   Modal,
//   Dialog,
//   Portal,
//   TextInput,
// } from 'react-native-paper';
// import {
//   StyleSheet,
//   View,
//   Dimensions,
//   ScrollView,
//   TouchableOpacity,
//   useColorScheme,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import IconDialog from '../components/IconDialog';
// import ApiFactory from '../../ApiFactory_PISP/ApiFactory';

// const screenWidth = wp('100%');
// const mode = 'sandbox';
// const way = 'web';
// const apiFactory = new ApiFactory();
// const sandboxApiClient = apiFactory.createApiClient('sandbox');

// const PaymentConsent = ({route}) => {
//   const FirstName = route.params.FirstName;
//   const LastName = route.params.LastName;
//   const SortCode = route.params.SortCode;
//   const AccountNumber = route.params.AccountNumber;
//   const Reference = route.params.Reference;
//   const Amount = route.params.Amount;
//   const navigation = useNavigation();
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const [loading, setLoading] = useState(false);
//   const [userInput, setUserInput] = useState('');
//   const [error, setError] = useState(null);
//   const [expanded1, setExpanded1] = useState(false);
//   const [expanded2, setExpanded2] = useState(false);
//   const [expanded3, setExpanded3] = useState(false);

//   const handlePress1 = () => setExpanded1(!expanded1);
//   const handlePress2 = () => setExpanded2(!expanded2);
//   const handlePress3 = () => setExpanded3(!expanded3);

//   const [checked1, setChecked1] = useState(true);
//   const [checked2, setChecked2] = useState(true);
//   const [checked3, setChecked3] = useState(true);
//   const [checked4, setChecked4] = useState(true);
//   const [checked5, setChecked5] = useState(true);
//   const [checked6, setChecked6] = useState(false);
//   const [checked7, setChecked7] = useState(false);
//   const [permission, setPermission] = useState([]);

//   const handleCheckbox1 = () => setChecked1(!checked1);
//   const handleCheckbox2 = () => setChecked2(!checked2);
//   const handleCheckbox3 = () => setChecked3(!checked3);
//   const handleCheckbox4 = () => setChecked4(!checked4);
//   const handleCheckbox5 = () => setChecked5(!checked5);
//   const handleCheckbox6 = () => setChecked6(!checked6);
//   const handleCheckbox7 = () => setChecked7(!checked7);

//   const [isDialogVisible1, setDialogVisible1] = useState(false);

//   const showDialog1 = () => setDialogVisible1(true);
//   const hideDialog1 = () => setDialogVisible1(false);

//   const [isDialogVisible2, setDialogVisible2] = useState(false);

//   const showDialog2 = () => setDialogVisible2(true);
//   const hideDialog2 = () => setDialogVisible2(false);

//   const [isDialogVisible3, setDialogVisible3] = useState(false);

//   const showDialog3 = () => setDialogVisible3(true);
//   const hideDialog3 = () => setDialogVisible3(false);

//   const [isDialogVisible4, setDialogVisible4] = useState(false);

//   const showDialog4 = () => setDialogVisible4(true);
//   const hideDialog4 = () => setDialogVisible4(false);

//   const [isDialogVisible5, setDialogVisible5] = useState(false);

//   const showDialog5 = () => setDialogVisible5(true);
//   const hideDialog5 = () => setDialogVisible5(false);

//   const [isDialogVisible6, setDialogVisible6] = useState(false);

//   const showDialog6 = () => setDialogVisible6(true);
//   const hideDialog6 = () => setDialogVisible6(false);

//   const [isDialogVisible7, setDialogVisible7] = useState(false);

//   const showDialog7 = () => setDialogVisible7(true);
//   const hideDialog7 = () => setDialogVisible7(false);

//   const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);
//   const showErrorDialog = () => setErrorDialogVisible(true);
//   const hideErrorDialog = () => setErrorDialogVisible(false);
//   const [isInputDialogVisible, setInputDialogVisible] = useState(false);
//   const showInputDialog = () => setInputDialogVisible(true);
//   const hideInputDialog = () => {
//     setInputDialogVisible(false);
//   };

//   const [inputValue, setInputValue] = useState('');

//   const areAllCheckboxesChecked = () => {
//     const condition1 = checked1 && checked6 && checked7;
//     const condition2 = (checked3 || checked4) && checked5;
//     const condition3 = !checked3 && !checked4 && !checked5;
//     return condition1 && (condition2 || condition3);
//   };

//   const handleConfirmButtonClick = async () => {
//     if (mode == 'sandbox') {
//       try {
//         const permissions = new Array();
//         if (checked1) {
//           permissions.push('ReadAccountsDetail');
//         }
//         if (checked2) {
//           permissions.push('ReadBalances');
//         }
//         if (checked3) {
//           permissions.push('ReadTransactionsDebits');
//         }
//         if (checked4) {
//           permissions.push('ReadTransactionsCredits');
//         }
//         if (checked5) {
//           permissions.push('ReadTransactionsDetail');
//         }
//         setPermission(permissions);

//         setLoading(true);
//         setError(null);

//         const consentData = await sandboxApiClient.retrieveAccessToken(
//           'payments',
//         );
//         console.log('Consent id:', consentData);
//         if (way == 'web') {
//           const consentUrl = await sandboxApiClient.manualUserConsent(
//             consentData,
//           );
//           console.log(consentUrl);
//           showInputDialog(permissions);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         setError('Failed to retrieve access token.');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       navigation.navigate('Consent');
//     }
//   };

//   const handleSubmit = async permission => {
//     try {
//       const data = await sandboxApiClient.exchangeAccessToken(inputValue);
//       navigation.navigate('Transaction Successful', {status: data.Status});
//     } catch (error) {
//       console.error('Error:', error);
//       setError('Failed to retrieve access token.');
//     } finally {
//       setLoading(false);
//     }
//     hideInputDialog();
//   };

//   return (
//     <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
//       <View style={styles.container}>
//         <Title style={styles.headerText}>We Need Your Consent</Title>
//         <Text style={styles.textStyle}>
//           ONEBank needs your explicit consent to access the following
//           information from the accounts held at your bank or building society
//         </Text>

//         <List.Section>
//           <List.Accordion
//             theme={{colors: {background: 'white'}}}
//             title="Your Account Details"
//             titleStyle={styles.titleStyle}
//             left={props => (
//               <List.Icon {...props} icon="account-cash" color="#36013f" />
//             )}
//             expanded={expanded1}
//             onPress={handlePress1}
//             style={styles.accordionStyle}>
//             <List.Item
//               left={props => (
//                 <Checkbox.Android
//                   status={checked1 ? 'checked' : 'unchecked'}
//                   onPress={handleCheckbox1}
//                   disabled={true}
//                 />
//               )}
//               title="Your Account Details"
//               style={styles.accordionListStyle}
//               right={props => (
//                 <View style={{marginTop: 10}}>
//                   <TouchableOpacity onPress={showDialog1}>
//                     <Icon source="information" color={'#448ee4'} size={23} />
//                   </TouchableOpacity>
//                   {isDialogVisible1 && (
//                     <IconDialog
//                       visible={isDialogVisible1}
//                       hideDialog={hideDialog1}
//                       title={'Your Account Details'}
//                       text={
//                         'We need your consent to access your account information.'
//                       }
//                     />
//                   )}
//                 </View>
//               )}
//             />
//             <List.Item
//               left={props => (
//                 <Checkbox.Android
//                   status={checked2 ? 'checked' : 'unchecked'}
//                   onPress={handleCheckbox2}
//                 />
//               )}
//               title="Your Balance Details"
//               style={styles.accordionListStyle}
//               right={props => (
//                 <View style={{marginTop: 8}}>
//                   <TouchableOpacity onPress={showDialog2}>
//                     <Icon source="information" color={'#448ee4'} size={23} />
//                   </TouchableOpacity>
//                   {isDialogVisible2 && (
//                     <IconDialog
//                       visible={isDialogVisible2}
//                       hideDialog={hideDialog2}
//                       title={'Your Balance Details'}
//                       text={
//                         'We need your consent to access your balance information.'
//                       }
//                     />
//                   )}
//                 </View>
//               )}
//             />
//           </List.Accordion>
//           <List.Accordion
//             theme={{colors: {background: 'white'}}}
//             title="Your Transaction Details"
//             titleStyle={styles.titleStyle}
//             left={props => (
//               <List.Icon {...props} icon="bank-transfer" color="#36013f" />
//             )}
//             expanded={expanded2}
//             onPress={handlePress2}
//             style={styles.accordionStyle}>
//             <List.Item
//               left={props => (
//                 <Checkbox.Android
//                   status={checked3 ? 'checked' : 'unchecked'}
//                   onPress={handleCheckbox3}
//                 />
//               )}
//               title="Your Transaction Debits"
//               style={styles.accordionListStyle}
//               right={props => (
//                 <View style={{marginTop: 8}}>
//                   <TouchableOpacity onPress={showDialog3}>
//                     <Icon source="information" color={'#448ee4'} size={23} />
//                   </TouchableOpacity>
//                   {isDialogVisible3 && (
//                     <IconDialog
//                       visible={isDialogVisible3}
//                       hideDialog={hideDialog3}
//                       title={'Your Transaction Debits'}
//                       text={
//                         'We need your consent to access your transaction debit information.'
//                       }
//                     />
//                   )}
//                 </View>
//               )}
//             />
//             <List.Item
//               left={props => (
//                 <Checkbox.Android
//                   status={checked4 ? 'checked' : 'unchecked'}
//                   onPress={handleCheckbox4}
//                 />
//               )}
//               title="Your Transaction Credits"
//               style={styles.accordionListStyle}
//               right={props => (
//                 <View style={{marginTop: 8}}>
//                   <TouchableOpacity onPress={showDialog4}>
//                     <Icon source="information" color={'#448ee4'} size={23} />
//                   </TouchableOpacity>
//                   {isDialogVisible4 && (
//                     <IconDialog
//                       visible={isDialogVisible4}
//                       hideDialog={hideDialog4}
//                       title={'Your Transaction Credits'}
//                       text={
//                         'We need your consent to access your transaction credit information..'
//                       }
//                     />
//                   )}
//                 </View>
//               )}
//             />
//             <List.Item
//               left={props => (
//                 <Checkbox.Android
//                   status={checked5 ? 'checked' : 'unchecked'}
//                   onPress={handleCheckbox5}
//                 />
//               )}
//               title="Your Transaction Details"
//               style={styles.accordionListStyle}
//               right={props => (
//                 <View style={{marginTop: 8}}>
//                   <TouchableOpacity onPress={showDialog5}>
//                     <Icon source="information" color={'#448ee4'} size={23} />
//                   </TouchableOpacity>
//                   {isDialogVisible5 && (
//                     <IconDialog
//                       visible={isDialogVisible5}
//                       hideDialog={hideDialog5}
//                       title={'Your Transaction Details'}
//                       text={
//                         'We need your consent to access your transaction information.'
//                       }
//                     />
//                   )}
//                 </View>
//               )}
//             />
//           </List.Accordion>
//           <List.Accordion
//             theme={{colors: {background: 'white'}}}
//             title="Reason For Access"
//             titleStyle={styles.titleStyle}
//             left={props => (
//               <List.Icon {...props} icon="progress-question" color="#36013f" />
//             )}
//             expanded={expanded3}
//             onPress={handlePress3}
//             style={styles.accordionStyle}>
//             <List.Item
//               left={props => (
//                 <Checkbox.Android
//                   status={checked6 ? 'checked' : 'unchecked'}
//                   onPress={handleCheckbox6}
//                 />
//               )}
//               title="I Am a Tpp So I Need Access"
//               style={styles.accordionListStyle}
//               right={props => (
//                 <View style={{marginTop: 8}}>
//                   <TouchableOpacity onPress={showDialog6}>
//                     <Icon source="information" color={'#448ee4'} size={23} />
//                   </TouchableOpacity>
//                   {isDialogVisible6 && (
//                     <IconDialog
//                       visible={isDialogVisible6}
//                       hideDialog={hideDialog6}
//                       title={'Reason For Access'}
//                       text={'You are the Third Party Provider.'}
//                     />
//                   )}
//                 </View>
//               )}
//             />
//             <List.Item
//               left={props => (
//                 <Checkbox.Android
//                   status={checked7 ? 'checked' : 'unchecked'}
//                   onPress={handleCheckbox7}
//                 />
//               )}
//               title="I Am The Owner Of the Account"
//               style={styles.accordionListStyle}
//               right={props => (
//                 <View style={{marginTop: 8}}>
//                   <TouchableOpacity onPress={showDialog7}>
//                     <Icon source="information" color={'#448ee4'} size={23} />
//                   </TouchableOpacity>
//                   {isDialogVisible7 && (
//                     <IconDialog
//                       visible={isDialogVisible7}
//                       hideDialog={hideDialog7}
//                       title={'Reason For Access'}
//                       text={'You are the owner of the account.'}
//                     />
//                   )}
//                 </View>
//               )}
//             />
//           </List.Accordion>
//         </List.Section>
//         <View style={{flexDirection: 'row', marginVertical: 10}}>
//           <Button
//             icon="close"
//             mode="contained"
//             style={{marginRight: 10}}
//             onPress={() => navigation.goBack()}>
//             Deny
//           </Button>

//           <Button
//             icon="check-bold"
//             mode="contained"
//             onPress={() => {
//               if (areAllCheckboxesChecked()) {
//                 handleConfirmButtonClick();
//               } else {
//                 showErrorDialog();
//               }
//             }}
//             disabled={!areAllCheckboxesChecked()}
//             style={{marginLeft: 10}}>
//             Confirm
//           </Button>
//           {isErrorDialogVisible && (
//             <IconDialog
//               visible={isErrorDialogVisible}
//               hideDialog={hideErrorDialog}
//               title={
//                 'We need consent, Please check boxes under Reason for Access'
//               }
//               text={''}
//             />
//           )}
//           <Portal>
//             <Dialog visible={isInputDialogVisible} onDismiss={hideInputDialog}>
//               <Dialog.Title>Redirect Input</Dialog.Title>
//               <Dialog.Content>
//                 <TextInput
//                   label=" Paste URL from the browser"
//                   value={inputValue}
//                   onChangeText={text => setInputValue(text)}
//                 />
//               </Dialog.Content>
//               <Dialog.Actions>
//                 <Button onPress={hideInputDialog}>Cancel</Button>
//                 <Button
//                   onPress={() => {
//                     handleSubmit(permission);
//                   }}>
//                   Submit
//                 </Button>
//               </Dialog.Actions>
//             </Dialog>
//           </Portal>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     marginTop: hp('4%'),
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: wp('5%'),
//     backgroundColor: '#fff',
//   },
//   headerText: {
//     fontSize: wp('7%'),
//     fontWeight: 'bold',
//     color: '#36013f',
//     paddingTop: wp('4%'),
//   },
//   textStyle: {
//     textAlign: 'center',
//     padding: wp('2%'),
//     fontSize: hp('2.5%'),
//     color: '#454545',
//   },
//   titleStyle: {
//     fontSize: wp('4.5%'),
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   accordionStyle: {
//     width: wp('85%'),
//     margin: wp('5%'),
//     borderRadius: wp('2%'),
//     backgroundColor: '#c8e1cc',
//     elevation: 3,
//   },
//   accordionListStyle: {
//     width: wp('90%'),
//     marginLeft: wp('5%'),
//   },
// });
// export default PaymentConsent;
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
  const [isPayeeInfoOpen, setIsPayeeInfoOpen] = useState(false);
  const [isPayerInfoOpen, setIsPayerInfoOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
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

        <View style={{marginTop: hp('2%')}}>
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
            labelStyle={{fontWeight: 'bold', fontSize: hp('2%')}}>
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
              fontSize: hp('2%'),
              color: 'white',
            }}
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
    paddingBottom: hp('10%'),
  },
  header: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  title: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('1%'),
    color: 'black',
  },
  subtitle: {
    fontSize: hp('2%'),
    textAlign: 'center',
    marginHorizontal: hp('1%'),
    fontWeight: '500',
  },
  highlightedSection: {
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    paddingVertical: hp('1.5%'),
    borderRadius: 5,
    marginTop: hp('1%'),
    paddingHorizontal: wp('5%'),
  },
  highlightedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightedTitle: {
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    color: '#5a287d',
    marginHorizontal: wp('1%'),
  },
  highlightedText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginVertical: hp('1%'),
  },
  tile: {
    margin: wp('3%'),
    padding: wp('2%'),
    borderColor: 'black',
    borderBottomWidth: 2,
  },
  tileTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#5a287d',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginVertical: hp('1.5%'),
    padding: wp('1%'),
  },
  leftContent: {
    position: 'absolute',
    left: 0,
    fontSize: hp('2%'),
    marginVertical: hp('0.5%'),
    fontWeight: 'bold',
    color: 'black',
  },
  rightContent: {
    position: 'absolute',
    right: 0,
    fontSize: hp('2%'),
    marginVertical: hp('1%'),
    fontWeight: 'bold',
    color: 'black',
  },
  footer: {
    backgroundColor: 'rgba(220, 190, 190, 0.6)',
    padding: wp('5%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: hp('1%'),
  },
  button: {
    borderRadius: 0,
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default PaymentConsentScreen;
