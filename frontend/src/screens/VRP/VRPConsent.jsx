
// import React, { useState, useEffect } from 'react';
// // import sandboxConfig from '../configs/Sandbox.json';
// import sandboxConfig from '../../../configs/Sandbox.json';
// import {
//     Title,
//     Text,
//     List,
//     Checkbox,
//     Icon,
//     Button,
//     Modal,
//     Dialog,
//     Portal,
//     TextInput,
// } from 'react-native-paper';
// import {
//     StyleSheet,
//     View,
//     Dimensions,
//     ScrollView,
//     TouchableOpacity,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import IconDialog from '../../components/IconDialog';
// import ApiFactory from '../../../ApiFactory/ApiFactory';
// import { all } from 'axios';

// const screenWidth = Dimensions.get('window').width;
// const mode = 'sandbox';
// const way = 'web';
// const apiFactory = new ApiFactory();
// const sandboxApiClient = apiFactory.createApiClient('sandbox');
// const VRPConsent = ({route}) => {
//     const formData = route.params?.formData;
//     const navigation = useNavigation();
//     const [loading, setLoading] = useState(false);
//     const [allPayments, setAllPayments] = useState('');
//     const [error, setError] = useState(null);
//     const [expanded1, setExpanded1] = useState(false);
//     const [expanded2, setExpanded2] = useState(false);
//     const [expanded3, setExpanded3] = useState(false);

//     const handlePress1 = () => setExpanded1(!expanded1);
//     const handlePress2 = () => setExpanded2(!expanded2);
//     const handlePress3 = () => setExpanded3(!expanded3);

//     const [checked1, setChecked1] = useState(true);
//     const [checked2, setChecked2] = useState(true);
//     const [checked3, setChecked3] = useState(true);
//     const [checked4, setChecked4] = useState(true);
//     const [checked5, setChecked5] = useState(true);
//     const [checked6, setChecked6] = useState(false);
//     const [checked7, setChecked7] = useState(false);

//     const handleCheckbox1 = () => setChecked1(!checked1);
//     const handleCheckbox2 = () => setChecked2(!checked2);
//     const handleCheckbox3 = () => setChecked3(!checked3);
//     const handleCheckbox4 = () => setChecked4(!checked4);
//     const handleCheckbox5 = () => setChecked5(!checked5);
//     const handleCheckbox6 = () => setChecked6(!checked6);
//     const handleCheckbox7 = () => setChecked7(!checked7);

//     const [isDialogVisible1, setDialogVisible1] = useState(false);

//     const showDialog1 = () => setDialogVisible1(true);
//     const hideDialog1 = () => setDialogVisible1(false);

//     const [isDialogVisible2, setDialogVisible2] = useState(false);

//     const showDialog2 = () => setDialogVisible2(true);
//     const hideDialog2 = () => setDialogVisible2(false);

//     const [isDialogVisible3, setDialogVisible3] = useState(false);

//     const showDialog3 = () => setDialogVisible3(true);
//     const hideDialog3 = () => setDialogVisible3(false);

//     const [isDialogVisible4, setDialogVisible4] = useState(false);

//     const showDialog4 = () => setDialogVisible4(true);
//     const hideDialog4 = () => setDialogVisible4(false);

//     const [isDialogVisible5, setDialogVisible5] = useState(false);

//     const showDialog5 = () => setDialogVisible5(true);
//     const hideDialog5 = () => setDialogVisible5(false);

//     const [isDialogVisible6, setDialogVisible6] = useState(false);

//     const showDialog6 = () => setDialogVisible6(true);
//     const hideDialog6 = () => setDialogVisible6(false);

//     const [isDialogVisible7, setDialogVisible7] = useState(false);

//     const showDialog7 = () => setDialogVisible7(true);
//     const hideDialog7 = () => setDialogVisible7(false);

//     const [isErrorDialogVisible, setErrorDialogVisible] = useState(false);
//     const showErrorDialog = () => setErrorDialogVisible(true);
//     const hideErrorDialog = () => setErrorDialogVisible(false);
//     const [isInputDialogVisible, setInputDialogVisible] = useState(false);
//     const showInputDialog = () => setInputDialogVisible(true);
//     const hideInputDialog = () => setInputDialogVisible(false);

//     const [inputValue, setInputValue] = useState('');

//     const areAllCheckboxesChecked = () => {
//         return (
//             (checked1 || checked2 || checked3 || checked4 || checked5) &&
//             checked6 &&
//             checked7
//         );
//     };

//     const handleConfirmButtonClick = async () => {
//         if (mode == 'sandbox') {
//             try {
//                 const permissions = {
//                     "Data": {
//                         "ControlParameters": {
//                             "VRPType": [
//                                 "UK.OBIE.VRPType.Other"
//                             ],
//                             "PSUAuthenticationMethods": [
//                                 "UK.OBIE.SCANotRequired"
//                             ],
//                             "ValidFromDateTime": "2021-08-01T23:06:53.599Z",
//                             "ValidToDateTime": "2024-08-01T23:06:53.599Z",
//                             "MaximumIndividualAmount": {
//                                 "Amount": 200.00,
//                                 "Currency": "GBP"
//                             },
//                             "PeriodicLimits": [
//                                 {
//                                     "PeriodType": "Week",
//                                     "PeriodAlignment": "Calendar",
//                                     "Amount": "300.00",
//                                     "Currency": "GBP"
//                                 }
//                             ]
//                         },
//                         "Initiation": {
//                             "CreditorAccount": {
//                                 "SchemeName": "SortCodeAccountNumber",
//                                 "Identification": "50499910000998",
//                                 "Name":formData.firstName,
//                                 "SecondaryIdentification": "secondary-identif"
//                             },
//                             "RemittanceInformation": {
//                                 "Unstructured": "Tools",
//                                 "Reference": formData.reference
//                             }
//                         }
//                     },
//                     "Risk": {}
//                 };

//                 setLoading(true);
//                 setError(null);
//                 const accessTokenParams = {
//                     scope: 'payments',
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded',
//                         // other headers here
//                     },
//                     body: permissions,
//                     consentUrl:sandboxConfig.paymentRequestEndPoint
//                 };
//                 const consentData = await sandboxApiClient.retrieveAccessToken(
//                     { accessTokenParams },
//                 ); //here is data
//                 console.log('Consent id:', consentData);
//                 if (way == 'web') {
//                     const Vrpscope='openid payments';
//                     const consentUrl = await sandboxApiClient.manualUserConsent(
//                         Vrpscope,
//                     );
//                     console.log(consentUrl);
//                     showInputDialog();
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 setError('Failed to retrieve access token.');
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             navigation.navigate('Consent');
//         }
//     };

//     const handleSubmit = async () => {
//         try {
//             console.log(inputValue);
//             const data = await sandboxApiClient.exchangeAccessToken(inputValue,formData);
//             setAllPayments(data);
            
//             navigation.navigate('VRP Details',{data});

//             //   console.log(data);

//         } catch (error) {
//             console.error('Error:', error);
//             setError('Failed to retrieve access token.');
//         } finally {
//             setLoading(false);
//         }
//         setInputValue('');
//         hideInputDialog();
//     };

//     return (
//         <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
//             <View style={styles.container}>
//                 <Title style={styles.headerText}>We Need Your Consent</Title>
//                 <Text style={styles.textStyle}>
//                     ONEBank needs your explicit consent to access the following information
//                     from the accounts held at your bank or building society
//                 </Text>

//                 <List.Section>
//                     <List.Accordion
//                         title="Your Account Details"
//                         titleStyle={styles.titleStyle}
//                         left={props => (
//                             <List.Icon {...props} icon="account-cash" color="#36013f" />
//                         )}
//                         expanded={expanded1}
//                         onPress={handlePress1}
//                         style={styles.accordionStyle}>
//                         <List.Item
//                             left={props => (
//                                 <Checkbox.Android
//                                     status={checked1 ? 'checked' : 'unchecked'}
//                                     onPress={handleCheckbox1}
//                                 />
//                             )}
//                             title="Your Account Details"
//                             style={styles.accordionListStyle}
//                             right={props => (
//                                 <View style={{ marginTop: 10 }}>
//                                     <TouchableOpacity onPress={showDialog1}>
//                                         <Icon source="information" color={'#448ee4'} size={23} />
//                                     </TouchableOpacity>
//                                     {isDialogVisible1 && (
//                                         <IconDialog
//                                             visible={isDialogVisible1}
//                                             hideDialog={hideDialog1}
//                                             title={'Your Account Details'}
//                                             text={
//                                                 'We need your consent to access your account information.'
//                                             }
//                                         />
//                                     )}
//                                 </View>
//                             )}
//                         />
//                         <List.Item
//                             left={props => (
//                                 <Checkbox.Android
//                                     status={checked2 ? 'checked' : 'unchecked'}
//                                     onPress={handleCheckbox2}
//                                 />
//                             )}
//                             title="Your Balance Details"
//                             style={styles.accordionListStyle}
//                             right={props => (
//                                 <View style={{ marginTop: 8 }}>
//                                     <TouchableOpacity onPress={showDialog2}>
//                                         <Icon source="information" color={'#448ee4'} size={23} />
//                                     </TouchableOpacity>
//                                     {isDialogVisible2 && (
//                                         <IconDialog
//                                             visible={isDialogVisible2}
//                                             hideDialog={hideDialog2}
//                                             title={'Your Balance Details'}
//                                             text={
//                                                 'We need your consent to access your balance information.'
//                                             }
//                                         />
//                                     )}
//                                 </View>
//                             )}
//                         />
//                     </List.Accordion>
//                     <List.Accordion
//                         title="Your Transaction Details"
//                         titleStyle={styles.titleStyle}
//                         left={props => (
//                             <List.Icon {...props} icon="bank-transfer" color="#36013f" />
//                         )}
//                         expanded={expanded2}
//                         onPress={handlePress2}
//                         style={styles.accordionStyle}>
//                         <List.Item
//                             left={props => (
//                                 <Checkbox.Android
//                                     status={checked3 ? 'checked' : 'unchecked'}
//                                     onPress={handleCheckbox3}
//                                 />
//                             )}
//                             title="Your Transaction Debits"
//                             style={styles.accordionListStyle}
//                             right={props => (
//                                 <View style={{ marginTop: 8 }}>
//                                     <TouchableOpacity onPress={showDialog3}>
//                                         <Icon source="information" color={'#448ee4'} size={23} />
//                                     </TouchableOpacity>
//                                     {isDialogVisible3 && (
//                                         <IconDialog
//                                             visible={isDialogVisible3}
//                                             hideDialog={hideDialog3}
//                                             title={'Your Transaction Debits'}
//                                             text={
//                                                 'We need your consent to access your transaction debit information.'
//                                             }
//                                         />
//                                     )}
//                                 </View>
//                             )}
//                         />
//                         <List.Item
//                             left={props => (
//                                 <Checkbox.Android
//                                     status={checked4 ? 'checked' : 'unchecked'}
//                                     onPress={handleCheckbox4}
//                                 />
//                             )}
//                             title="Your Transaction Credits"
//                             style={styles.accordionListStyle}
//                             right={props => (
//                                 <View style={{ marginTop: 8 }}>
//                                     <TouchableOpacity onPress={showDialog4}>
//                                         <Icon source="information" color={'#448ee4'} size={23} />
//                                     </TouchableOpacity>
//                                     {isDialogVisible4 && (
//                                         <IconDialog
//                                             visible={isDialogVisible4}
//                                             hideDialog={hideDialog4}
//                                             title={'Your Transaction Credits'}
//                                             text={
//                                                 'We need your consent to access your transaction credit information..'
//                                             }
//                                         />
//                                     )}
//                                 </View>
//                             )}
//                         />
//                         <List.Item
//                             left={props => (
//                                 <Checkbox.Android
//                                     status={checked5 ? 'checked' : 'unchecked'}
//                                     onPress={handleCheckbox5}
//                                 />
//                             )}
//                             title="Your Transaction Details"
//                             style={styles.accordionListStyle}
//                             right={props => (
//                                 <View style={{ marginTop: 8 }}>
//                                     <TouchableOpacity onPress={showDialog5}>
//                                         <Icon source="information" color={'#448ee4'} size={23} />
//                                     </TouchableOpacity>
//                                     {isDialogVisible5 && (
//                                         <IconDialog
//                                             visible={isDialogVisible5}
//                                             hideDialog={hideDialog5}
//                                             title={'Your Transaction Details'}
//                                             text={
//                                                 'We need your consent to access your transaction information.'
//                                             }
//                                         />
//                                     )}
//                                 </View>
//                             )}
//                         />
//                     </List.Accordion>
//                     <List.Accordion
//                         title="Reason For Access"
//                         titleStyle={styles.titleStyle}
//                         left={props => (
//                             <List.Icon {...props} icon="progress-question" color="#36013f" />
//                         )}
//                         expanded={expanded3}
//                         onPress={handlePress3}
//                         style={styles.accordionStyle}>
//                         <List.Item
//                             left={props => (
//                                 <Checkbox.Android
//                                     status={checked6 ? 'checked' : 'unchecked'}
//                                     onPress={handleCheckbox6}
//                                 />
//                             )}
//                             title="I Am a Tpp So I Need Access"
//                             style={styles.accordionListStyle}
//                             right={props => (
//                                 <View style={{ marginTop: 8 }}>
//                                     <TouchableOpacity onPress={showDialog6}>
//                                         <Icon source="information" color={'#448ee4'} size={23} />
//                                     </TouchableOpacity>
//                                     {isDialogVisible6 && (
//                                         <IconDialog
//                                             visible={isDialogVisible6}
//                                             hideDialog={hideDialog6}
//                                             title={'Reason For Access'}
//                                             text={'You are the Third Party Provider.'}
//                                         />
//                                     )}
//                                 </View>
//                             )}
//                         />
//                         <List.Item
//                             left={props => (
//                                 <Checkbox.Android
//                                     status={checked7 ? 'checked' : 'unchecked'}
//                                     onPress={handleCheckbox7}
//                                 />
//                             )}
//                             title="I Am The Owner Of the Account"
//                             style={styles.accordionListStyle}
//                             right={props => (
//                                 <View style={{ marginTop: 8 }}>
//                                     <TouchableOpacity onPress={showDialog7}>
//                                         <Icon source="information" color={'#448ee4'} size={23} />
//                                     </TouchableOpacity>
//                                     {isDialogVisible7 && (
//                                         <IconDialog
//                                             visible={isDialogVisible7}
//                                             hideDialog={hideDialog7}
//                                             title={'Reason For Access'}
//                                             text={'You are the owner of the account.'}
//                                         />
//                                     )}
//                                     {/* {allPayments && (
//                                         <View>
//                                             <Text>Data: {JSON.stringify(allPayments)}</Text>
//                                         </View>
//                                     )} */}
//                                 </View>
//                             )}
//                         />
//                     </List.Accordion>
//                 </List.Section>
//                 <View style={{ flexDirection: 'row', marginVertical: 10 }}>
//                     <Button
//                         icon="close"
//                         mode="contained"
//                         style={{ marginRight: 10 }}
//                         onPress={() => navigation.goBack()}>
//                         Deny
//                     </Button>

//                     <Button
//                         icon="check-bold"
//                         mode="contained"
//                         onPress={() => {
//                             if (areAllCheckboxesChecked()) {
//                                 handleConfirmButtonClick();
//                             } else {
//                                 showErrorDialog();
//                             }
//                             //handleConfirmButtonClick();
//                         }}
//                         disabled={!areAllCheckboxesChecked()}
//                         style={{ marginLeft: 10 }}>
//                         Confirm
//                     </Button>
//                     {isErrorDialogVisible && (
//                         <IconDialog
//                             visible={isErrorDialogVisible}
//                             hideDialog={hideErrorDialog}
//                             title={
//                                 'We need consent, Please check boxes under Reason for Access'
//                             }
//                             text={''}
//                         />
//                     )}
//                     <Portal>
//                         <Dialog visible={isInputDialogVisible} onDismiss={hideInputDialog}>
//                             <Dialog.Title>Redirect Input</Dialog.Title>
//                             <Dialog.Content>
//                                 <TextInput
//                                     label=" Paste URL from the browser"
//                                     value={inputValue}
//                                     onChangeText={text => setInputValue(text)}
//                                 />
//                             </Dialog.Content>
//                             <Dialog.Actions>
//                                 <Button onPress={hideInputDialog}>Cancel</Button>
//                                 <Button onPress={handleSubmit}>Submit</Button>
//                             </Dialog.Actions>
//                         </Dialog>
//                     </Portal>
//                 </View>
//             </View>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         display: 'flex',
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//         backgroundColor: '#fff',
//         marginTop: 30,
//     },
//     headerText: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#36013f',
//         margin: 20,
//     },
//     textStyle: {
//         textAlign: 'center',
//         padding: 10,
//         fontSize: 17,
//     },
//     titleStyle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     accordionStyle: {
//         width: screenWidth - 40,
//         margin: 20,
//         borderRadius: 10,
//         backgroundColor: '#c8e1cc',
//         elevation: 3,
//     },
//     accordionListStyle: {
//         width: screenWidth - 40,
//         marginLeft: 20,
//     },
// });

// export default VRPConsent;


import React, { useState, useEffect } from 'react';
// import sandboxConfig from '../configs/Sandbox.json';
import sandboxConfig from '../../../configs_VRP/Sandbox.json';
import {
    Title,
    Text,
    List,
    Checkbox,
    Icon,
    Button,
    Modal,
    Dialog,
    Portal,
    TextInput,
    DataTable
} from 'react-native-paper';
import {
    StyleSheet,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconDialog from '../../components/IconDialog';
import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import { all } from 'axios';
import { Surface } from '@react-native-material/core';

const screenWidth = Dimensions.get('window').width;
const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');
const VRPConsent = ({route}) => {
    const formData = route.params?.formData;

    const jsondata=
    {
        "Data": {
        "ControlParameters": {
            "VRPType": [
                "UK.OBIE.VRPType.Other"
            ],
            "PSUAuthenticationMethods": [
                "UK.OBIE.SCANotRequired"
            ],
            "ValidFromDateTime": formData.currentDate,//new Date().toLocaleString()
            "ValidToDateTime": formData.expiryDate,
            "MaximumIndividualAmount": {
                "Amount": formData.perPayment,//200
                "Currency": "GBP"
            },
            "PeriodicLimits": [
                {
                    "PeriodType": formData.period,
                    "PeriodAlignment": "Calendar",
                    "Amount": formData.perPeriod.toString(),//"300"
                    "Currency": "GBP"
                }
            ]
        },
        "Initiation": {
            "CreditorAccount": {
                "SchemeName": "SortCodeAccountNumber",
                "Identification": formData.accountNumber,
                "Name":formData.firstName,
                "SecondaryIdentification": "secondary-identif"
            },
            "RemittanceInformation": {
                "Unstructured": "Tools",
                "Reference": formData.reference
            }
        }
    },
    "Risk": {}
};
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

    const [inputValue, setInputValue] = useState('');

 

    const handleConfirmButtonClick = async () => {
        if (mode == 'sandbox') {
            try {
                const permissions = jsondata;

                setLoading(true);
                setError(null);
                const accessTokenParams = {
                    scope: 'payments',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        // other headers here
                    },
                    body: permissions,
                    consentUrl:sandboxConfig.paymentRequestEndPoint
                };
                const consentData = await sandboxApiClient.retrieveAccessToken(
                    { accessTokenParams },
                ); //here is data
                console.log('Consent id:', consentData);
                if (way == 'web') {
                    const Vrpscope='openid payments';
                    const consentUrl = await sandboxApiClient.manualUserConsent(
                        Vrpscope,
                    );
                    console.log(consentUrl);
                    showInputDialog();
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to retrieve access token.');
            } finally {
                setLoading(false);
            }
        } else {
            navigation.navigate('Consent');
        }
    };

    const handleSubmit = async () => {
        try {
            console.log(inputValue);
           await sandboxApiClient.exchangeAccessToken(inputValue,formData);
            //setAllPayments(data);
            
            navigation.navigate('ConsentsforVRP');

            //   console.log(data);

        } catch (error) {
            console.error('Error:', error);
            setError('Failed to retrieve access token.');
        } finally {
            setLoading(false);
        }
        setInputValue('');
        hideInputDialog();
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <Title style={styles.headerText}>Start a new VRP</Title>
                <Text style={styles.textStyle}>
                    We need your permission to setup a Variable Recurring Payment (VRP),to make 
                    transfers between your accounts, within the payment rules below:
                </Text>
                <View style={{backgroundColor:'#D6CFC7',width:'100%',flex:1}}>
                <Surface
                    elevation={0}
                   
                    style={{ flex:1,alignItems:'center' ,backgroundColor:'#D6CFC7'}}>
                        <DataTable>
                            <View style={{backgroundColor:'#D6CFC7'}}>
                        <DataTable.Header>
                        <DataTable.Title textStyle={{color:'#5a287d',fontSize:20,fontWeight:'bold'}}>Payment Terms</DataTable.Title>
                        </DataTable.Header>
                       
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Reference</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.reference}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Period Type</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.period}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Max per {formData.period}</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>£{formData.perPeriod}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title textStyle={{color:'black',fontSize:15}}>Max per Payment</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>£{formData.perPayment}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title textStyle={{color:'black',fontSize:15}}>Expiry Date</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.expiryDate}</DataTable.Title>
                        </DataTable.Header>  
                        </View>  
                    </DataTable>
                    
                </Surface>
                <Surface
                    elevation={2}
                    category="medium"
                    style={{ width: '100%', height: 200 }}>
                          <DataTable>
                       
                        <DataTable.Header>
                        <DataTable.Title textStyle={{color:'#5a287d',fontSize:20,fontWeight:'bold'}}>To</DataTable.Title>
                        </DataTable.Header>
                       
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Creditor Name</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.firstName}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Sort Code</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.sortCode}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Header>
                        <DataTable.Title style={{maxWidth:200}} textStyle={{color:'black',fontSize:15}}numberOfLines={2}>Account Number</DataTable.Title>
                        <DataTable.Title numeric textStyle={{color:'black',fontSize:15}}>{formData.accountNumber}</DataTable.Title>
                        </DataTable.Header>
                    </DataTable>
                

                </Surface>
                </View>
                <View style={{ position: 'relative', bottom: 0, width: '100%', backgroundColor: '#D6CFC7',
                 padding:5,alignItems:'center' ,justifyContent:'center'}}>
                <Text style={{color:'#5a287d',fontSize:18,justifyContent:'center',alignItems:'center'}}>We will now securely transfer you to the {formData.firstName} to authenticate</Text>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Button
                        icon="close"
                        mode="contained"
                        style={{ marginRight: 10 }}
                        onPress={() => navigation.goBack()}>
                        Deny
                    </Button>

                    <Button
                        icon="check-bold"
                        mode="contained"
                        onPress={() => {
                        handleConfirmButtonClick();
                        }}

                        style={{ marginLeft: 10 }}>
                        I Allow
                    </Button>
                    </View>
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
                                <Button onPress={handleSubmit}>Submit</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        marginTop: 1,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#36013f',
        margin: 5,
    },
    textStyle: {
        textAlign: 'center',
        padding: 10,
        fontSize: 17,
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    accordionStyle: {
        width: screenWidth - 40,
        margin: 20,
        borderRadius: 10,
        backgroundColor: '#c8e1cc',
        elevation: 3,
    },
    accordionListStyle: {
        width: screenWidth - 40,
        marginLeft: 20,
    },
});

export default VRPConsent;