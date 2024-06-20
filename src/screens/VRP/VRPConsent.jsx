
import React, { useState, useEffect } from 'react';
// import sandboxConfig from '../../../configs_VRP/Sandbox.json';
import sandboxConfig from '../../../configs/Sandbox.json';
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
// import ApiFactory from '../../../ApiFactory_VRP/ApiFactory';
import ApiFactory from '../../../Apifactory/ApiFactory';

import { all } from 'axios';
import { Surface } from '@react-native-material/core';

const screenWidth = Dimensions.get('window').width;
const mode = 'sandbox';
const way = 'web';
const apiFactory = new ApiFactory();
const sandboxApiClient = apiFactory.createApiClient('sandbox');
const VRPConsent = ({ route }) => {
    const formData = route.params?.formData;
    const identification =  formData.accountNumber+formData.sortCode ;
    const jsondata =
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
                    "Identification": identification,
                    "Name": formData.firstName,
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
    const [consentData, setConsentData] = useState([]);



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
                    consentUrl: sandboxConfig.paymentRequestEndPoint
                };
                const consentdata = await sandboxApiClient.retrieveAccessToken_vrp(
                    { accessTokenParams },
                ); //here is data
                setConsentData(consentdata);
                if (way == 'web') {
                    const Vrpscope = 'openid payments';
                    const consentUrl = await sandboxApiClient.manualUserConsent_vrp(
                        Vrpscope,
                    );
                    
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
            
            const response=await sandboxApiClient.exchangeAccessToken_vrp(inputValue, formData,consentData);
            console.log(response)
            console.log(consentData)
            const updatedResponse = {
                ...response,
                refreshtoken: response.refresh_token,
                consentid: consentData,
              };
              
            navigation.navigate('GrantedForm', {
                creditorName: formData.firstName,
                accountnumber: formData.accountNumber,
                sortcode: formData.sortCode,
                referencenumber:formData.reference,
                selectconsentData: updatedResponse,
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

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <Title style={styles.headerText}>Start a new VRP</Title>
                <Text style={styles.textStyle}>
                    We need your permission to setup a Variable Recurring Payment (VRP),to make
                    transfers between your accounts, within the payment rules below:
                </Text>
                <View style={{ backgroundColor: '#D6CFC7', width: '100%', flex: 1 }}>
                    <Surface
                        elevation={0}

                        style={{ flex: 1, alignItems: 'center', backgroundColor: '#D6CFC7' }}>
                        <DataTable>
                            <View style={{ backgroundColor: '#D6CFC7' }}>
                                <DataTable.Header>
                                    <DataTable.Title textStyle={{ color: '#5a287d', fontSize: 20, fontWeight: 'bold' }}>Payment Terms</DataTable.Title>
                                </DataTable.Header>

                                <DataTable.Header>
                                    <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Reference</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{formData.reference}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Period Type</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{formData.period}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Max per {formData.period}</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>£{formData.perPeriod}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title textStyle={{ color: 'black', fontSize: 15 }}>Max per Payment</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>£{formData.perPayment}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Header>
                                    <DataTable.Title textStyle={{ color: 'black', fontSize: 15 }}>Expiry Date</DataTable.Title>
                                    <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{formData.expiryDate}</DataTable.Title>
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
                                <DataTable.Title textStyle={{ color: '#5a287d', fontSize: 20, fontWeight: 'bold' }}>To</DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Creditor Name</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{formData.firstName}</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Sort Code</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{formData.sortCode}</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Header>
                                <DataTable.Title style={{ maxWidth: 200 }} textStyle={{ color: 'black', fontSize: 15 }} numberOfLines={2}>Account Number</DataTable.Title>
                                <DataTable.Title numeric textStyle={{ color: 'black', fontSize: 15 }}>{formData.accountNumber}</DataTable.Title>
                            </DataTable.Header>
                        </DataTable>


                    </Surface>
                </View>
                <View style={{
                    position: 'relative', bottom: 0, width: '100%', backgroundColor: '#D6CFC7',
                    padding: 5, alignItems: 'center', justifyContent: 'center'
                }}>
                    <Text style={{ color: '#5a287d', fontSize: 18, justifyContent: 'center', alignItems: 'center' }}>We will now securely transfer you to the {formData.firstName} to authenticate</Text>
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